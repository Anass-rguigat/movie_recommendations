import pandas as pd
import re

movies = pd.read_csv('ml-latest/movies.csv', header=0)

def extract_year(title):
    match = re.search(r'\((.*?)\)', title)
    if match:
        return match.group(len(match.groups()))
    return '1999'

movies['year'] = movies['title'].apply(lambda x: extract_year(x))

def get_favorite_movies(user_id, ratings_df):
    favorites = ratings_df[(ratings_df['userId'] == user_id) & (ratings_df['rating'] >= 3.5)].sort_values(by='rating', ascending=False)['movieId']
    return set(favorites if type(favorites) == pd.Series else [favorites])

class ModelEvaluator:
    def __init__(self, training_data, testing_data, threshold=3.5):
        self.training_data = training_data
        self.testing_data = testing_data
        self.threshold = threshold 
    
    def evaluate_model_for_user(self, model, user_id):
        # Obtenir les films favoris dans le test
        favorites_in_test = get_favorite_movies(user_id, self.testing_data)
        
        # Obtenir les recommandations du modèle pour l'utilisateur donné
        # à travers ses films favoris, en utilisant les données d'entraînement
        person_recs_df = model.recommend_items(user_id, items_to_ignore=get_favorite_movies(user_id, self.training_data))
        
        # Filtrer les recommandations en fonction du seuil et trier par note prédite
        person_recs_df = person_recs_df[person_recs_df['predicted_rating'] >= self.threshold].sort_values(by='predicted_rating', ascending=False)
        
        # Calculer le nombre de films réellement recommandés qui sont des favoris dans le test
        true_relevant = person_recs_df[person_recs_df['movieId'].isin(favorites_in_test)].shape[0]
        
        # Sélectionner les 5 premières recommandations
        top_5_recommended = person_recs_df.head(5)
        
        # Sélectionner les 10 premières recommandations
        top_10_recommended = person_recs_df.head(10)
        
        # Calculer les nombres de hits@5 et hits@10
        hits_at_5_count = top_5_recommended[top_5_recommended['movieId'].isin(favorites_in_test)].shape[0]
        hits_at_10_count = top_10_recommended[top_10_recommended['movieId'].isin(favorites_in_test)].shape[0]
        
        # Calculer la précision@5 et le rappel@5
        precision_at_5 = hits_at_5_count / top_5_recommended.shape[0] if top_5_recommended.shape[0] != 0 else 1
        recall_at_5 = hits_at_5_count / true_relevant if true_relevant != 0 else 1
        
        # Calculer la précision@10 et le rappel@10
        precision_at_10 = hits_at_10_count / top_10_recommended.shape[0] if top_10_recommended.shape[0] != 0 else 1
        recall_at_10 = hits_at_10_count / true_relevant if true_relevant != 0 else 1
        
        person_metrics = {
            'hits@5_count': hits_at_5_count,
            'hits@10_count': hits_at_10_count,
            'recommended@5_count': top_5_recommended.shape[0],
            'recommended@10_count': top_10_recommended.shape[0],
            'relevents': true_relevant,
            'recall@5': recall_at_5,
            'recall@10': recall_at_10,
            'precision@5': precision_at_5,
            'precision@10': precision_at_10
        }
        return person_metrics
    
    
    def evaluate_model(self, model):
        users_metrics = []
        users_ids = list(set(self.testing_data['userId'].values))
        for idx, user_id in enumerate(users_ids):
            metrics = self.evaluate_model_for_user(model, user_id)
            metrics['user_id'] = user_id
            users_metrics.append(metrics)
        print('%d users processed' % idx)
        
        detailed_results_df = pd.DataFrame(users_metrics).sort_values('hits@5_count', ascending=False)

        global_recall_at_5 = detailed_results_df['hits@5_count'].sum() / float(detailed_results_df['relevents'].sum())
        global_recall_at_10 = detailed_results_df['hits@10_count'].sum() / float(detailed_results_df['relevents'].sum())
        
        global_precision_at_5 = detailed_results_df['hits@5_count'].sum() / float(detailed_results_df['recommended@5_count'].sum())
        global_precision_at_10 = detailed_results_df['hits@10_count'].sum() / float(detailed_results_df['recommended@10_count'].sum())
        
        global_metrics = {
            'modelName': model.get_model_name(),
            'recall@5': global_recall_at_5,
            'recall@10': global_recall_at_10,
            'precision@5': global_precision_at_5,
            'precision@10': global_precision_at_10
        }
        return global_metrics, detailed_results_df