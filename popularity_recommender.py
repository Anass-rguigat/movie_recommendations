import pandas as pd

class PopularityRecommender:
    MODEL_NAME = 'Popularity'
    
    def __init__(self, popularities_df):
        self.popularities_df = popularities_df
    
    def get_model_name(self):
        return self.MODEL_NAME
    
    def weighted_rating(self, x, m, C):
        V = x['ratings_count']
        R = x['ratings_mean']
        return (V/(V+m)*R) + (m/(m+V)* C)
                
    def recommend_items(self, user_id, items_to_ignore=[], topn=10, verbose=False):
        C = self.popularities_df['ratings_mean'].mean()
        
        self.popularities_df['predicted_rating'] = self.popularities_df.apply(lambda x: self.weighted_rating(x,10,C), axis=1) 
        
        recommendations_df = self.popularities_df[~self.popularities_df['movieId'].isin(items_to_ignore)].sort_values('predicted_rating', ascending=False).head(topn)
        return recommendations_df
