# import pandas as pd

# # Load the dataset
# df = pd.read_csv("LatestNutriScore2.csv")  # Replace with your actual CSV file path

# # Define keywords for filtering
# keywords = [
#     "Brie", "Cheddar cheese", "cheese", "Yogurt", "dairy", "Breakfast cereals", 
#     "olive oil", "walnut oil", "sunflower oil", "cooking oil"
# ]

# # Convert relevant columns to lowercase for case-insensitive filtering
# df_filtered = df[df["product_name"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False) |
#                df["categories"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False) |
#                df["ingredients_text"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False) |
#                df["main_category_en"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False)]

# # Save the filtered data to a new CSV file
# df_filtered.to_csv("New_filtered_products_compare.csv", index=False)

# print("new Filtered products saved to filtered_products.csv")


import pandas as pd

# Load the dataset
df = pd.read_csv("LatestNutriScore2.csv")  # Replace with your actual CSV file path

# Define keywords for filtering
keywords = [
    "Brie", "Cheddar cheese", "cheese", "Yogurt", "dairy", "Breakfast cereals",
    "olive oil", "walnut oil", "sunflower oil", "cooking oil"
]

# Convert relevant columns to lowercase for case-insensitive filtering
filtered_df = df[
    (df["categories"].str.lower().str.contains("non-food", na=False) == False) &  # Exclude Non-Food
    (df["HealthStarRating"].str.lower() != "not applicable") &  # Exclude Not Applicable HealthStarRating
    (
        df["product_name"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False) |
        df["categories"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False) |
        df["ingredients_text"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False) |
        df["main_category_en"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False)
    )
]

# Save the filtered data to a new CSV file
filtered_df.to_csv("New_filtered_products_compare.csv", index=False)

print("New Filtered products saved to New_filtered_products_compare.csv")
