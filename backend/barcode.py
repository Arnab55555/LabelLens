import pandas as pd
import re

# Function to extract the product code from a given URL
def extract_product_code(url):
    match = re.search(r'/product/([^/]+)(?:/|$)', url)  # Updated regex to match end of URL
    if match:
        return match.group(1)  # Return the captured product code
    return None  # Return None if there's no match

# Read the CSV file containing URLs
# Update 'path_to_your_dataset.csv' to your actual CSV file path
df = pd.read_csv(r'C:\Users\Suhail Khan\Documents\GitHub\LabelLens\codes.csv')

# Assuming your CSV has a column named 'url' containing the URLs
# Create a new column 'product_code' to store the extracted product codes
df['product_code'] = df['url'].apply(extract_product_code)

# Save the updated DataFrame with product codes to a new CSV file
df.to_csv('updated_dataset.csv', index=False)

print("Product codes extracted and saved to 'updated_dataset.csv'.")
