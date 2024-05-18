from flask import Flask, request, jsonify
import pandas as pd
from model_evaluator import ModelEvaluator
from popularity_recommender import PopularityRecommender
from content_based import ContentBasedRecommender
app = Flask(__name__)

# Load data and initialize recommendation model
movies = pd.read_csv('ml-latest/movies.csv', header=0)
ratings = pd.read_csv('ml-latest/ratings.csv', header=0)

movies['year'] = movies['title'].str.extract(r'\((\d{4})\)')
movies['year'] = movies['year'].fillna('1999')

threshold_date = '2015'
ids = movies[movies['year'] < threshold_date]['movieId'].values
training_data = ratings[ratings['movieId'].isin(ids)]
testing_data = ratings[~ratings['movieId'].isin(ids)]

model_evaluator = ModelEvaluator(training_data, testing_data)

genres = list(set([x for genres in movies['genres'].values for x in genres.split('|')]))
expanded_movies_df = movies.copy()
for g in genres:
    expanded_movies_df[g] = [0 if g in genres.split('|') else 1 for genres in movies['genres'].values]

content_based_recommender_model = ContentBasedRecommender(expanded_movies_df, training_data, testing_data)


popularity = ratings.groupby('movieId').agg({'rating':['mean', 'count']}).reset_index()
popularity.columns = ['movieId','ratings_mean', 'ratings_count']
popularity = popularity.sort_values(by='ratings_mean', ascending=False)
popularity_model = PopularityRecommender(popularity)

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

if __name__ == '__main__':
    app.run(debug=True)
