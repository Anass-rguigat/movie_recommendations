import numpy as np
import pandas as pd
class CFRecommender:
    
    MODEL_NAME = 'Collaborative Filtering'
    
    def __init__(self, predictions_df):
        self.predictions_df = predictions_df
        
    def get_model_name(self):
        return self.MODEL_NAME
    
    def recommend_items(self, user_id, items_to_ignore=[], topn=10, verbose=False):
        sorted_user_predictions = self.predictions_df.loc[user_id].sort_values(ascending=False)
        recommendations = {'movieId': sorted_user_predictions.index, 'predicted_rating':sorted_user_predictions.values}
        recommendations_df = pd.DataFrame(recommendations)
        recommendations_df = recommendations_df[~recommendations_df['movieId'].isin(items_to_ignore)].sort_values('predicted_rating', ascending = False).head(topn)
        return recommendations_df
