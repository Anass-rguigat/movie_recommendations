import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
tags = pd.read_csv('ml-latest/tags.csv', header=0)
movies = pd.read_csv('ml-latest/movies.csv', header=0)
ratings = pd.read_csv('ml-latest/ratings.csv', header=0)

def check_name(x):
    words = x.split()
    return all(x[0].isupper() and x[1:].islower() for x in words if len(x) > 1)

def clean(x):
    if x.istitle() or check_name(x):
        return x.replace(" ", "").lower()
    else:
        return x.lower().strip()

tags['tag'] = tags['tag'].apply(lambda x: clean(x))

expanded_movies_df = movies.copy()
movies_ids = expanded_movies_df['movieId'].values.tolist()
expanded_movies_df['soup'] = [" ".join(tags[tags['movieId'] == id]['tag'].values.tolist()) for id in movies_ids]

def fill_empty_tag(x):
    if x['soup'] == '':
        return " ".join(x['genres'].lower().split('|'))
    return x['soup']

expanded_movies_df['soup'] = expanded_movies_df.apply(lambda x: fill_empty_tag(x), axis=1)


count = CountVectorizer(stop_words='english')
count_matrix = count.fit_transform(expanded_movies_df['soup'])

class Based:
    MODEL_NAME = 'Based-ByTagsOrMovie'
    
    def __init__(self, items_ids, items_matrix, items_data):
        self.items_ids = items_ids
        self.items_matrix = items_matrix
        self.items_data = items_data
        
    def get_model_name(self):
        return self.MODEL_NAME
    
    def get_item_profile(self, item_id):
        idx = self.items_ids.index(item_id)
        return self.items_matrix[idx].toarray().reshape(-1)
    
    def get_items_profiles(self, ids):
        item_profiles = np.array([self.get_item_profile(x) for x in ids])
        return item_profiles
    
    def get_similar_items(self, item_profile, topn=10):
        cosine_similarities = cosine_similarity(item_profile, self.items_matrix)
        similar_indices = cosine_similarities.argsort().flatten()[-topn:]
        similar_items = sorted([(self.items_ids[i], cosine_similarities[0, i]) for i in similar_indices], key=lambda x: -x[1])
        return similar_items
    
    def recommend_items(self, input_str, topn=10):
        input_str = clean(input_str)
        if input_str in self.items_data['title'].values:
            item_id = self.items_data[self.items_data['title'] == input_str]['movieId'].values[0]
            item_profile = self.get_item_profile(item_id).reshape(1, -1)
        else:
            item_profile = count.transform([input_str])
        
        similar_items = self.get_similar_items(item_profile, topn)
        recommendations_df = pd.DataFrame(similar_items, columns=['movieId', 'similarity'])
        recommendations_df = recommendations_df.merge(self.items_data[['movieId', 'title']], on='movieId', how='left')
        return recommendations_df

