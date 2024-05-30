from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd

def normalize(value, old_max, old_min, new_max=5.0, new_min=0.0):
    old_range = (old_max - old_min)
    new_range = (new_max - new_min)
    return (((value - old_min) * new_range) / old_range) + new_min

class ContentBasedRecommender:
    MODEL_NAME = 'Content-Based'
    
    def __init__(self, items_ids, items_matrix, training_data, testing_data):
        self.items_ids = items_ids
        self.items_matrix = items_matrix
        self.training_data = training_data
        self.testing_data = testing_data
        
    def get_model_name(self):
        return self.MODEL_NAME
    
    def get_item_profile(self, item_id):
        idx = self.items_ids.index(item_id)
        return self.items_matrix[idx].toarray().reshape(-1)
    
    def get_items_profiles(self, ids):
        item_profiles = np.array([self.get_item_profile(x) for x in ids])
        return item_profiles
    
    def build_users_profile(self, user_id):
        user_df = self.training_data[self.training_data['userId'] == user_id]
        user_items_profiles = self.get_items_profiles(user_df['movieId'].values)
        
        user_items_ratings = np.array(user_df['rating'].values).reshape(-1, 1)
        user_profile = np.sum(np.multiply(user_items_profiles, user_items_ratings), axis=0) / np.sum(user_items_ratings)
        return user_profile
    
    def get_similar_items_to_user_profile(self, user_id, topn=1000):
        user_profile = self.build_users_profile(user_id).reshape(1, -1)
        cosine_similarities = cosine_similarity(user_profile, self.items_matrix.toarray())
        similar_indices = cosine_similarities.argsort().flatten()[-topn:]
        similar_items = sorted([(self.items_ids[i], cosine_similarities[0, i]) for i in similar_indices], key=lambda x: -x[1])
        return similar_items
    
    def recommend_items(self, user_id, items_to_ignore=[], topn=10):
        similar_items = self.get_similar_items_to_user_profile(user_id)
        similar_items_filtered = list(filter(lambda x: x[0] not in items_to_ignore, similar_items))
        recommendations_df = pd.DataFrame(similar_items_filtered, columns=['movieId', 'predicted_rating']).head(topn)
        recommendations_df['predicted_rating'] = recommendations_df['predicted_rating'].apply(lambda x: normalize(x, 1.0, 0.0))
        return recommendations_df
