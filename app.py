import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

def load_data_from_csv(file_path):
    """
    Load the data from the CSV file and return it as a pandas DataFrame.
    """
    return pd.read_csv(file_path)

def combine_features(row):
    """
    Combine 'categories_tags', 'ingredients_tags', and 'food_groups_tags' into a single string.
    """
    return str(row['categories_tags']) + ' ' + str(row['ingredients_tags']) + ' ' + str(row['food_groups_tags'])

def create_similarity_matrix(df):
    """
    Create a similarity matrix based on the combined features using TF-IDF and cosine similarity.
    """
    # Combine features into a single string
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
    
    # Sort products by similarity score
    sorted_similar_products = sorted(similar_products, key=lambda x: x[1], reverse=True)[1:num_recommendations+1]
    
    print(f"Top {num_recommendations} similar products to {df.iloc[product_index]['product_name']}:")
    for i, score in sorted_similar_products:
        print(f"{df.iloc[i]['product_name']} (Similarity Score: {score})")

# Main function to run the recommendation system
if __name__ == "__main__":
    # Load data from CSV file
    df = load_data_from_csv(r'C:\Users\Arnab\OneDrive\Desktop\MajorProject\Dataset_Part5.csv')  # Replace 'your_data.csv' with your actual CSV file path

    # Ensure necessary columns exist
    if {'categories_tags', 'ingredients_tags', 'food_groups_tags', 'product_name'}.issubset(df.columns):
        # Create cosine similarity matrix using TF-IDF
        cosine_sim = create_similarity_matrix(df)

        # Example: Get recommendations for the first product (index 0)
        recommend_similar_products(63, cosine_sim, df, num_recommendations=5)
    else:
        print("The dataset must contain 'categories_tags', 'ingredients_tags', 'food_groups_tags', and 'product_name' columns.")


