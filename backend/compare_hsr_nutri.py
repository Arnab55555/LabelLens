import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load dataset
df = pd.read_csv('filtered_products_compare.csv')

# Convert HealthStarRating to numeric to avoid type errors
df['HealthStarRating'] = pd.to_numeric(df['HealthStarRating'], errors='coerce')

# Define Nutri-Score to percentage mapping
nutriscore_mapping = {'a': 100, 'b': 80, 'c': 60, 'd': 40, 'e': 20}

# Convert Nutri-Score grades to percentages
df['NutriScore_Percentage'] = df['nutriscore_grade_final'].str.lower().map(nutriscore_mapping)

# Convert HSR to percentage (0.5 to 5.0 range mapped to 0-100)
df['HSR_Percentage'] = ((df['HealthStarRating'] - 0.5) / (5.0 - 0.5)) * 100

# Filter category = cheese (assuming there is a category column in the dataset)
df_cheese = df[df['category'] == 'Fat/Nuts/Oil/Seeds']

# Compute absolute difference
df_cheese['Difference'] = abs(df_cheese['NutriScore_Percentage'] - df_cheese['HSR_Percentage'])

# Set threshold for significant difference (adjustable threshold)
df_cheese_filtered = df_cheese[df_cheese['Difference'] > 25]

# Sort by difference for better visualization
df_cheese_filtered = df_cheese_filtered.sort_values(by='Difference', ascending=False)

# Plot the bar graph
fig, ax = plt.subplots(figsize=(12, 6))
width = 0.4  # Bar width
x = np.arange(len(df_cheese_filtered))  # X-axis positions

ax.bar(x - width/2, df_cheese_filtered['NutriScore_Percentage'], width, label='Nutri-Score (%)', color='blue')
ax.bar(x + width/2, df_cheese_filtered['HSR_Percentage'], width, label='HSR (%)', color='orange')

# Annotate with Nutri-Score grade and HSR value
for i, (ns, hsr, name, grade, hsr_val) in enumerate(zip(df_cheese_filtered['NutriScore_Percentage'],
                                                         df_cheese_filtered['HSR_Percentage'],
                                                         df_cheese_filtered['product_name'],
                                                         df_cheese_filtered['nutriscore_grade_final.1'],
                                                         df_cheese_filtered['HealthStarRating'])):
    ax.text(i - width/2, ns + 2, f'{grade.upper()}', ha='center', fontsize=10, color='blue', fontweight='bold')
    ax.text(i + width/2, hsr + 2, f'{hsr_val:.1f}', ha='center', fontsize=10, color='orange', fontweight='bold')

# Labels and Title
ax.set_xticks(x)
ax.set_xticklabels(df_cheese_filtered['product_name'], rotation=45, ha='right')
ax.set_ylabel('Percentage (%)')
ax.set_ylim(0, 120)  # Ensure Y-axis is from 0 to 120 for better annotation space
ax.set_title('Nutri-Score vs Health Star Rating (Fats/Nuts/Oil/Seeds)')
ax.legend()

plt.tight_layout()
plt.show()