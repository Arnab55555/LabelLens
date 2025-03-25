from flask import Flask, jsonify, request
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
mongo = PyMongo(app)
products_collection = mongo.db.productinfos

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/data", methods=["GET"])
def get_data():
    try:
        # Debugging: Check if the connection is established
        print("Connected to MongoDB")

        # Fetch data from MongoDB
        data = list(products_collection.find({}, {'_id': 0}))

        # # Debugging: Print the fetched data
        # print("Fetched data:", data)

        return jsonify(data)

    except Exception as e:
        # Debugging: Print the error
        print("Error fetching data:", str(e))
        return jsonify({"error": str(e)})
    


def load_data_from_mongodb():
    products = list(products_collection.find({}, {"_id": 0, "code": 1, "product_name": 1, "category": 1, "ingredients_text": 1, "nutriscore_grade_final": 1, "image_url": 1}))
    return pd.DataFrame(products)

def combine_features(row):
    return str(row['category']) + ' ' + str(row.get('ingredients_text', ''))

def create_similarity_matrix(df):
    df['combined_features'] = df.apply(combine_features, axis=1)
    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform(df['combined_features'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    return cosine_sim

def recommend_similar_products(product_index, cosine_sim, df, num_recommendations=5, print_output=True):
    similar_products = list(enumerate(cosine_sim[product_index]))
    product_category = df.iloc[product_index]['category']
    similar_products = [item for item in similar_products if df.iloc[item[0]]['category'] == product_category]
    similar_products = [item for item in similar_products if item[0] != product_index]
    sorted_similar_products = sorted(similar_products, key=lambda x: x[1], reverse=True)[:num_recommendations]
    return sorted_similar_products

def recommend_better_alternative(product_index, cosine_sim, df, num_recommendations=5): 
    similar_products = recommend_similar_products(product_index, cosine_sim, df, num_recommendations)
    original_grade = df.iloc[product_index]['nutriscore_grade_final']

    better_alternatives = [item for item in similar_products if df.iloc[item[0]]['nutriscore_grade_final'] < original_grade and df.iloc[item[0]]['nutriscore_grade_final'] != 'Nutri-Score is not applicable']

    return sorted(better_alternatives, key=lambda x: x[1], reverse=True)[:num_recommendations]

@app.route('/recommend_better_alternatives/<code>', methods=['GET'])
def recommend_better_alternatives_api(code):
    try:
        code = int(code)
        df = load_data_from_mongodb()

        if df.empty:
            return jsonify({"error": "No data found in MongoDB"}), 404
        
        product_index = df[df['code'] == code].index

        if product_index.empty:
            return jsonify({"error": "Product not found"}), 404
        
        product_index = product_index[0]
        cosine_similarity_matrix = create_similarity_matrix(df)
        better_alternatives = recommend_better_alternative(product_index, cosine_similarity_matrix, df) 

        response = [{
            "code": int(df.iloc[i]['code']),
            "product_name": df.iloc[i]['product_name'],
            "nutriscore_grade_final": df.iloc[i]['nutriscore_grade_final'],
            "image_url": df.iloc[i]['image_url'] if pd.notna(df.iloc[i]['image_url']) else None,
            
        } 
        for i, score in better_alternatives
        ]

        return jsonify(response)

    except ValueError:
        return jsonify({"error": "Invalid product code"}), 400


    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0',port=5001)
