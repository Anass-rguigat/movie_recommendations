from flask import Flask, request, jsonify
import logging
import pandas as pd
from flask_cors import CORS
from model_evaluator import ModelEvaluator
from popularity_recommender import PopularityRecommender
from content_based import ContentBasedRecommender
from collaborative import CFRecommender  
from hybrid import HybridRecommender 
from sklearn.feature_extraction.text import CountVectorizer
from scipy.sparse.linalg import svds
import numpy as np

app = Flask(__name__)
CORS(app) # This will allow all origins by default.

# Load data and initialize recommendation model
movies = pd.read_csv('ml-latest/movies.csv', header=0)
ratings = pd.read_csv('ml-latest/ratings.csv', header=0)
tags = pd.read_csv('ml-latest/tags.csv',header=0)
links = pd.read_csv('ml-latest/links.csv',header=0)

movies['year'] = movies['title'].str.extract(r'\((\d{4})\)')
movies['year'] = movies['year'].fillna('1999')

threshold_date = '2015'
ids = movies[movies['year'] < threshold_date]['movieId'].values
training_data = ratings[ratings['movieId'].isin(ids)]
testing_data = ratings[~ratings['movieId'].isin(ids)]

#evaluator

model_evaluator = ModelEvaluator(training_data, testing_data)

#content
def check_name(x):
    words = x.split()
    return all(x[0].isupper() and x[1:].islower() for x in words if len(x) > 1)

def clean(x):
    if x.istitle() or check_name(x):
        return x.replace(" ", "").lower()
    else:
        return x.lower().strip()

tags['tag'] = tags['tag'].apply(lambda x: clean(x))

expended_movies_df = movies.copy()
movies_ids = expended_movies_df['movieId'].values.tolist()
expended_movies_df['soup'] = [" ".join(tags[tags['movieId'] == id]['tag'].values.tolist()) for id in movies_ids]

def fill_empty_tag(x):
    if x['soup'] == '' :
        return " ".join(x['genres'].lower().split('|'))
    return x['soup']

expended_movies_df['soup'] = expended_movies_df.apply(lambda x: fill_empty_tag(x), axis=1)


count = CountVectorizer(stop_words = 'english')
count_matrix = count.fit_transform(expended_movies_df['soup'])
content_based_recommender_model = ContentBasedRecommender(expended_movies_df['movieId'].values.tolist(), count_matrix, training_data, testing_data)


#popularity 
popularity = ratings.groupby('movieId').agg({'rating':['mean', 'count']}).reset_index()
popularity.columns = ['movieId','ratings_mean', 'ratings_count']
popularity = popularity.sort_values(by='ratings_mean', ascending=False)
popularity_model = PopularityRecommender(popularity)


#collaborative filtering 
users_items_pivot_matrix_df = ratings.pivot(index='userId', columns='movieId', values='rating').fillna(0)

users_items_pivot_matrix = users_items_pivot_matrix_df.values 


NUMBER_OF_FACTORS_MF = 15
U, sigma, Vt = svds(users_items_pivot_matrix, k = NUMBER_OF_FACTORS_MF)

sigma = np.diag(sigma)

all_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt)

preds_df = pd.DataFrame(all_user_predicted_ratings, columns=users_items_pivot_matrix_df.columns, index = users_items_pivot_matrix_df.index)

def normalize(value, old_max, old_min, new_max=5.0, new_min=0.0):
    old_range = (old_max - old_min)
    new_range = (new_max - new_min)
    return (((value - old_min) * new_range) / old_range) + new_min

preds_df = preds_df.apply(lambda x: normalize(x, all_user_predicted_ratings.max(), all_user_predicted_ratings.min()))

cf_recommender_model = CFRecommender(preds_df)

#hybrid 
hybrid_model = HybridRecommender(cf_model=cf_recommender_model, cb_model=content_based_recommender_model, expended_movies_df=expended_movies_df)


# Define Flask routes
@app.route('/recommendations-popularity', methods=['POST'])
def recommendation_popularity():
    try:
        # Get the user_id from the request JSON
        user_id = int(request.json['user_id'])
        
        # Get movie recommendations for the user from the popularity filtering model
        pl = popularity_model.recommend_items(user_id)
        
        # Read the links.csv file to get tmdbId for recommended movies
        links = pd.read_csv('ml-latest/links.csv', header=0)
        links = links[['movieId', 'tmdbId']]
        
        # Merge tmdbId with recommendations
        pl = pd.merge(pl, links, on='movieId', how='left')
        
        # Convert tmdbId to integer
        pl['tmdbId'] = pl['tmdbId'].fillna(0).astype(int)
        
        # Convert DataFrame to dictionary
        pl_dict = pl.to_dict(orient='records')
        
        return jsonify(pl_dict), 200
    except Exception as e:
        logging.error(f"Error in recommendation_popularity: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500 
    
# -=-=-=-=- =-=-=-= -=-=-=- =-=-=-=
@app.route('/recommendations-content_based', methods=['POST'])
def recommendation_content():
    try:
        # Get the user_id from the request JSON
        user_id = int(request.json['user_id'])
        
        # Get movie recommendations for the user from the content based filtering model
        cb = content_based_recommender_model.recommend_items(user_id)
        
        # Read the ratings file to get ratings for recommended movies
        ratings = pd.read_csv('ml-latest/ratings.csv', header=0)
        
        # Calculate average rating for each recommended movie
        average_ratings = ratings.groupby('movieId')['rating'].mean().reset_index()
        average_ratings.columns = ['movieId', 'average_rating']
        
        # Merge average ratings with recommendations
        cb = pd.merge(cb, average_ratings, on='movieId', how='left')
        
        # Read the links.csv file to get tmdbId for recommended movies
        links = pd.read_csv('ml-latest/links.csv', header=0)
        links = links[['movieId', 'tmdbId']]
        
        # Merge tmdbId with recommendations
        cb = pd.merge(cb, links, on='movieId', how='left')
        
        # Convert tmdbId to integer
        cb['tmdbId'] = cb['tmdbId'].fillna(0).astype(int)
        
        # Convert DataFrame to dictionary
        cb_dict = cb.to_dict(orient='records')
        
        return jsonify(cb_dict), 200
    except Exception as e:
        logging.error(f"Error in recommendation_content based: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/recommendations-collaborative', methods=['POST'])
def recommendation_collaborative():
    try:
        # Get the user_id from the request JSON
        user_id = int(request.json['user_id'])
        
        # Get movie recommendations for the user from the collaborative filtering model
        recommendations = cf_recommender_model.recommend_items(user_id)
        
        # Read the ratings file to get ratings for recommended movies
        ratings = pd.read_csv('ml-latest/ratings.csv', header=0)
        
        # Calculate average rating for each recommended movie
        average_ratings = ratings.groupby('movieId')['rating'].mean().reset_index()
        average_ratings.columns = ['movieId', 'average_rating']
        
        # Merge average ratings with recommendations
        recommendations = pd.merge(recommendations, average_ratings, on='movieId', how='left')
        
        # Read the links.csv file to get tmdbId for recommended movies
        links = pd.read_csv('ml-latest/links.csv', header=0)
        links = links[['movieId', 'tmdbId']]
        
        # Merge tmdbId with recommendations
        recommendations = pd.merge(recommendations, links, on='movieId', how='left')
        
        # Convert tmdbId to integer
        recommendations['tmdbId'] = recommendations['tmdbId'].fillna(0).astype(int)
        
        # Convert DataFrame to dictionary
        recommendations_dict = recommendations.to_dict(orient='records')
        
        return jsonify(recommendations_dict), 200
    except Exception as e:
        logging.error(f"Error in recommendation_collaborative: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500



@app.route('/recommendations-hybrid', methods=['POST'])
def recommendation_hybrid():
    try:
        # Get the user_id from the request JSON
        user_id = int(request.json['user_id'])
        
        # Get movie recommendations for the user from the Hybrid filtering model
        hybrid = hybrid_model.recommend_items(user_id)
        
        # Read the ratings file to get ratings for recommended movies
        ratings = pd.read_csv('ml-latest/ratings.csv', header=0)
        
        # Calculate average rating for each recommended movie
        average_ratings = ratings.groupby('movieId')['rating'].mean().reset_index()
        average_ratings.columns = ['movieId', 'average_rating']
        
        # Merge average ratings with recommendations
        hybrid = pd.merge(hybrid, average_ratings, on='movieId', how='left')
        
        # Read the links.csv file to get tmdbId for recommended movies
        links = pd.read_csv('ml-latest/links.csv', header=0)
        links = links[['movieId', 'tmdbId']]
        
        # Merge tmdbId with recommendations
        hybrid = pd.merge(hybrid, links, on='movieId', how='left')
        
        # Convert tmdbId to integer
        hybrid['tmdbId'] = hybrid['tmdbId'].fillna(0).astype(int)
        
        # Convert DataFrame to dictionary
        hybrid_dict = hybrid.to_dict(orient='records')
        
        return jsonify(hybrid_dict), 200
    except Exception as e:
        logging.error(f"Error in recommendation_hybrid: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/recommendations-hybrid_search', methods=['POST'])
def recommendation_hybrid_search():
    try:
        # Get the title from the request JSON
        title = request.json['title']
        
        # Get movie by title recommendations for the user from the Hybrid filtering model
        titles =hybrid_model.recommend_items_by_title(title)
        
        # Read the ratings file to get ratings for recommended movies
        ratings = pd.read_csv('ml-latest/ratings.csv', header=0)
        
        # Calculate average rating for each recommended movie
        average_ratings = ratings.groupby('movieId')['rating'].mean().reset_index()
        average_ratings.columns = ['movieId', 'average_rating']
        
        # Merge average ratings with recommendations
        titles = pd.merge(titles, average_ratings, on='movieId', how='left')
        
        # Read the links.csv file to get tmdbId for recommended movies
        links = pd.read_csv('ml-latest/links.csv', header=0)
        links = links[['movieId', 'tmdbId']]
        
        # Merge tmdbId with recommendations
        titles = pd.merge(titles, links, on='movieId', how='left')
        
        # Convert tmdbId to integer
        titles['tmdbId'] = titles['tmdbId'].fillna(0).astype(int)
        
        # Convert DataFrame to dictionary
        titles_dict = titles.to_dict(orient='records')
        
        return jsonify(titles_dict), 200
    except Exception as e:
        logging.error(f"Error in recommendation_hybrid_title: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

@app.route('/add-rating', methods=['POST'])
def add_rating():
    try:
        data = request.json
        user_id = int(data['userId'])
        movie_id = int(data['movieId'])
        rating = float(data['rating'])

        # Append the new rating to the ratings DataFrame
        new_rating = pd.DataFrame({'userId': [user_id], 'movieId': [movie_id], 'rating': [rating]})
        ratings = pd.read_csv('ml-latest/ratings.csv', header=0)
        updated_ratings = pd.concat([ratings, new_rating], ignore_index=True)

        # Write the updated ratings DataFrame back to the CSV file
        updated_ratings.to_csv('ml-latest/ratings.csv', index=False)

        return jsonify({'message': 'Rating added successfully.'}), 201

    except Exception as e:
        logging.error(f"Failed to add rating: {e}")
        return jsonify({'error': 'Failed to add rating.'}), 500



logging.basicConfig(level=logging.DEBUG)
if __name__ == '__main__':
    app.run(debug=True)
