from flask import Flask, request, jsonify
import logging
import pandas as pd
from model_evaluator import ModelEvaluator
from popularity_recommender import PopularityRecommender
from content_based import ContentBasedRecommender
from collaborative import CFRecommender  
from hybrid import HybridRecommender 
from sklearn.feature_extraction.text import CountVectorizer
from scipy.sparse.linalg import svds
import numpy as np

app = Flask(__name__)

# Load data and initialize recommendation model
movies = pd.read_csv('ml-latest/movies.csv', header=0)
ratings = pd.read_csv('ml-latest/ratings.csv', header=0)
tags = pd.read_csv('ml-latest/tags.csv',header=0)

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
    user_id = int(request.json['user_id'])
    ids = popularity_model.recommend_items(user_id)['movieId'].values
    recommended_movies = movies[movies['movieId'].isin(ids)].to_dict(orient='records')
    return jsonify(recommended_movies)
@app.route('/recommendations-content_based', methods=['POST'])
def recommendation_content():
    user_id = int(request.json['user_id'])
    ids = content_based_recommender_model.recommend_items(user_id)['movieId'].values
    movie = movies[movies['movieId'].isin(ids)].to_dict(orient='records')
    return jsonify(movie)

@app.route('/recommendations-collaborative', methods=['POST'])
def recommendation_collaborative():
    user_id = int(request.json['user_id'])
    ids = cf_recommender_model.recommend_items(user_id)['movieId'].values
    movie = movies[movies['movieId'].isin(ids)].to_dict(orient='records')
    return jsonify(movie)

@app.route('/recommendations-hybrid', methods=['POST'])
def recommendation_hybrid():
    user_id = int(request.json['user_id'])
    ids = hybrid_model.recommend_items(user_id)['movieId'].values
    movie = movies[movies['movieId'].isin(ids)].to_dict(orient='records')
    return jsonify(movie)

@app.route('/recommendations-hybrid_search', methods=['POST'])
def recommendation_hybrid_search():
    title = request.json['title']
    ids =hybrid_model.recommend_items_by_title(title)['movieId'].values
    movie =movies[movies['movieId'].isin(ids)].to_dict(orient='records')
    return jsonify(movie)


logging.basicConfig(level=logging.DEBUG)
if __name__ == '__main__':
    app.run(debug=True)
