import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

def load_data_from_csv(file_path):
    """
    Load the data from the CSV file and return it as a pandas DataFrame.
    """
    return pd.read_csv(file_path)

def combine_features(row):
    """
    Combine 'category' and 'ingredients_text' into a single string.
    """
    return str(row['category']) + ' ' + str(row['ingredients_text'])

def create_similarity_matrix(df):
    """
    Create a similarity matrix based on the combined features using TF-IDF and cosine similarity.
    """
    df['combined_features'] = df.apply(combine_features, axis=1)

    # Convert the combined features into a TF-IDF matrix
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_features'])

    # Calculate cosine similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    return cosine_sim

def recommend_similar_products(product_index, cosine_sim, df, num_recommendations=5):
    """
    Recommend similar products based on cosine similarity.
    """
    similar_products = list(enumerate(cosine_sim[product_index]))
    
    # Filter products by the same category
    product_category = df.iloc[product_index]['category']
    similar_products = [item for item in similar_products if df.iloc[item[0]]['category'] == product_category]
    
    # Remove the original product from the list
    similar_products = [item for item in similar_products if item[0] != product_index]
    
    # Sort products by similarity score
    sorted_similar_products = sorted(similar_products, key=lambda x: x[1], reverse=True)[:num_recommendations]
    
    print(f"\nTop {num_recommendations} similar products to {df.iloc[product_index]['product_name']} (Category: {product_category}, Nutri-Score: {df.iloc[product_index]['nutriscore_grade_final']}):")
    for i, score in sorted_similar_products:
        print(f"{df.iloc[i]['product_name']} (Similarity Score: {score:.4f})")

    return sorted_similar_products

def recommend_better_alternative(product_index, cosine_sim, df, num_recommendations=5):
    """
    Recommend better alternative products based on Nutri-Score grade.
    """
    similar_products = list(enumerate(cosine_sim[product_index]))
    
    # Filter products by the same category
    product_category = df.iloc[product_index]['category']
    similar_products = [item for item in similar_products if df.iloc[item[0]]['category'] == product_category]
    
    # Remove the original product from the list
    similar_products = [item for item in similar_products if item[0] != product_index]
    
    # Get the Nutri-Score grade of the original product
    original_grade = df.iloc[product_index]['nutriscore_grade_final']
    
    # Find better alternatives
    better_alternatives = [item for item in similar_products if df.iloc[item[0]]['nutriscore_grade_final'] < original_grade]
    
    if better_alternatives:
        # Sort better alternatives by similarity score
        sorted_better_alternatives = sorted(better_alternatives, key=lambda x: x[1], reverse=True)[:num_recommendations]
        
        print("\nTop 5 better alternative products:")
        for i, score in sorted_better_alternatives:
            print(f"{df.iloc[i]['product_name']} (Similarity Score: {score:.4f}, Nutri-Score: {df.iloc[i]['nutriscore_grade_final']})")
    else:
        print("\nNo alternative product available")

# ====== PERFORMANCE EVALUATION FUNCTIONS ======
def evaluate_recommendation_system(df, cosine_sim, num_samples=50, num_recommendations=5):
    """
    Evaluate the recommendation system using Precision, Recall, and Mean Average Precision (MAP).
    """
    precision_scores = []
    recall_scores = []
    average_precisions = []
    
    for _ in range(num_samples):
        product_index = np.random.randint(0, len(df))  # Randomly select a product
        similar_products = list(enumerate(cosine_sim[product_index]))
        
        # Filter out the original product
        similar_products = [item for item in similar_products if item[0] != product_index]

        # Sort by similarity score
        sorted_similar_products = sorted(similar_products, key=lambda x: x[1], reverse=True)[:num_recommendations]

        recommended_indices = [idx for idx, _ in sorted_similar_products]
        
        # Define relevant products (same category)
        relevant_indices = df[df['category'] == df.iloc[product_index]['category']].index.tolist()
        relevant_set = set(relevant_indices)

        # Calculate Precision and Recall
        true_positives = len(set(recommended_indices) & relevant_set)
        precision = true_positives / num_recommendations if num_recommendations > 0 else 0
        recall = true_positives / len(relevant_set) if len(relevant_set) > 0 else 0

        precision_scores.append(precision)
        recall_scores.append(recall)

        # Calculate Average Precision (AP)
        ap = 0
        num_relevant_found = 0
        for i, idx in enumerate(recommended_indices):
            if idx in relevant_set:
                num_relevant_found += 1
                ap += num_relevant_found / (i + 1)  # Precision at this rank

        ap = ap / len(relevant_set) if len(relevant_set) > 0 else 0
        average_precisions.append(ap)

    # Compute final evaluation metrics
    mean_precision = np.mean(precision_scores)
    mean_recall = np.mean(recall_scores)
    map_score = np.mean(average_precisions)

    print("\n==== Performance Metrics ====")
    print(f"Mean Precision: {mean_precision:.4f}")
    print(f"Mean Recall: {mean_recall:.4f}")
    print(f"Mean Average Precision (MAP): {map_score:.4f}")

# ====== MAIN SCRIPT ======
if __name__ == "__main__":
    # Load data from CSV file
    df = load_data_from_csv(r'LatestNutriScore.csv')  # Update with actual path

    # Ensure necessary columns exist
    if {'category', 'ingredients_text', 'product_name', 'nutriscore_grade_final'}.issubset(df.columns):
        # Create cosine similarity matrix using TF-IDF
        cosine_sim = create_similarity_matrix(df)

        # Example: Get recommendations for a product at index 62
        product_index = 65
        recommend_similar_products(product_index, cosine_sim, df, num_recommendations=5)
        
        # Example: Get better alternative recommendations for the product at index 62
        recommend_better_alternative(product_index, cosine_sim, df, num_recommendations=5)

        # Evaluate the system
        evaluate_recommendation_system(df, cosine_sim, num_samples=50, num_recommendations=5)
    else:
        print("The dataset must contain 'category', 'ingredients_text', 'product_name', and 'nutriscore_grade_final' columns.")
