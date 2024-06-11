import pandas as pd

class HybridRecommender:
    MODEL_NAME = 'Hybrid'
    
    def __init__(self, cf_model, cb_model, expended_movies_df):
        self.cf_model = cf_model
        self.cb_model = cb_model
        self.expended_movies_df = expended_movies_df
        
    def get_model_name(self):
        return self.MODEL_NAME
    
    def recommend_items(self, user_id, items_to_ignore=[], topn=30):
        cf_recommendations = self.cf_model.recommend_items(user_id, items_to_ignore=items_to_ignore, topn=topn)
        cb_recommendations = self.cb_model.recommend_items(user_id, items_to_ignore=items_to_ignore, topn=topn)
        hybrid_recommendations = pd.concat([cf_recommendations, cb_recommendations]).drop_duplicates().reset_index(drop=True)
        return hybrid_recommendations.sample(frac=1).head(topn)
    
    def recommend_items_by_title(self, title, topn=10):
        # Find the movie based on the provided title
        movie = self.expended_movies_df[self.expended_movies_df['title'].str.contains(title, case=False)]

        if movie.empty:
            return pd.DataFrame(columns=['movieId'])

        # Extract the genres from the found movie
        query_genres = movie.iloc[0]['genres']

        # Initialize list to store similar movie ids
        similar_movies = []

        # Find other movies with similar genres
        for index, row in self.expended_movies_df.iterrows():
            if row['title'] != movie.iloc[0]['title'] and row['genres'] == query_genres:
                similar_movies.append({'movieId': row['movieId']})

        if similar_movies:
            return pd.DataFrame(similar_movies).head(topn)
        else:
            return pd.DataFrame(columns=['movieId'])





