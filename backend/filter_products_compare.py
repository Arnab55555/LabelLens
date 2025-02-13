import pandas as pd

# Load the dataset
df = pd.read_csv("output_hsr.csv")  # Replace with your actual CSV file path

# Define keywords for filtering
keywords = [
    "Brie", "Cheddar cheese", "cheese", "Yogurt", "dairy", "Breakfast cereals", 
    "olive oil", "walnut oil", "sunflower oil", "cooking oil"
]

# Convert relevant columns to lowercase for case-insensitive filtering
df_filtered = df[df["product_name"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False) |
               df["categories"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False) |
               df["ingredients_text"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False) |
               df["main_category_en"].str.lower().str.contains('|'.join([kw.lower() for kw in keywords]), na=False)]

# Save the filtered data to a new CSV file
df_filtered.to_csv("filtered_products_compare.csv", index=False)

print("Filtered products saved to filtered_products.csv")
