# import pandas as pd
# import matplotlib.pyplot as plt
# import numpy as np
# from sklearn.preprocessing import MinMaxScaler

# # Load the CSV file
# df = pd.read_csv("output_hsr.csv")  # Replace with your CSV file path

# # Mapping lowercase Nutri-Score grades ('a', 'b', 'c', 'd', 'e') to percentage values
# nutriscore_mapping = {'a': 100, 'b': 75, 'c': 50, 'd': 25, 'e': 0}
# df['NutriScore_Percentage'] = df['nutriscore_grade_final'].map(nutriscore_mapping)

# # Convert Health Star Rating (HSR) to numeric, handling errors
# df['HealthStarRating'] = pd.to_numeric(df['HealthStarRating'], errors='coerce')

# # Drop rows where HealthStarRating is NaN
# df = df.dropna(subset=['HealthStarRating'])

# # Normalize HSR to a percentage scale (0.5 to 5 mapped to 0-100%)
# df['HSR_Percentage'] = ((df['HealthStarRating'] - 0.5) / 4.5) * 100

# # Round to nearest whole number for proper binning
# df['HSR_Percentage'] = df['HSR_Percentage'].round(0)

# # Count occurrences for each percentage level
# nutriscore_counts = df['NutriScore_Percentage'].value_counts().sort_index()
# hsr_counts = df['HSR_Percentage'].value_counts().sort_index()

# # Plot the comparison
# plt.figure(figsize=(10, 5))
# plt.plot(nutriscore_counts.index, nutriscore_counts.values, label='Nutri-Score Count', marker='o', linestyle='dashed', color='blue')
# plt.plot(hsr_counts.index, hsr_counts.values, label='Health Star Rating Count', marker='s', linestyle='solid', color='red')

# plt.xlabel("Percentage Score (0-100%)")
# plt.ylabel("Product Count")
# plt.title("Comparison of Nutri-Score and Health Star Rating Distribution")
# plt.legend()
# plt.grid()
# plt.show()

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# Load the CSV file
df = pd.read_csv("output_hsr.csv")  # Replace with your CSV file path

# Mapping lowercase Nutri-Score grades ('a', 'b', 'c', 'd', 'e') to percentage values
nutriscore_mapping = {'a': 100, 'b': 75, 'c': 50, 'd': 25, 'e': 0}
grade_labels = {100: 'A', 75: 'B', 50: 'C', 25: 'D', 0: 'E'}  # Labels for annotation
df['NutriScore_Percentage'] = df['nutriscore_grade_final'].map(nutriscore_mapping)

# Convert Health Star Rating (HSR) to numeric, handling errors
df['HealthStarRating'] = pd.to_numeric(df['HealthStarRating'], errors='coerce')

# Drop rows where HealthStarRating is NaN
df = df.dropna(subset=['HealthStarRating'])

# Normalize HSR to a percentage scale (0.5 to 5 mapped to 0-100%)
df['HSR_Percentage'] = ((df['HealthStarRating'] - 0.5) / 4.5) * 100

# Round to nearest whole number for proper binning
df['HSR_Percentage'] = df['HSR_Percentage'].round(0)

# Count occurrences for each percentage level
nutriscore_counts = df['NutriScore_Percentage'].value_counts().sort_index()
hsr_counts = df['HSR_Percentage'].value_counts().sort_index()

# Reverse map HSR percentages to original star ratings for labeling
hsr_labels = {((hsr - 0.5) / 4.5) * 100: f"{hsr:.1f}" for hsr in np.arange(0.5, 5.5, 0.5)}

# Plot the comparison
plt.figure(figsize=(10, 5))
plt.plot(nutriscore_counts.index, nutriscore_counts.values, label='Nutri-Score Count', marker='o', linestyle='dashed', color='blue')
plt.plot(hsr_counts.index, hsr_counts.values, label='Health Star Rating Count', marker='s', linestyle='solid', color='red')

# Annotate Nutri-Score labels (A-E) slightly above the points
for x, y in nutriscore_counts.items():
    plt.text(x, y + max(nutriscore_counts.values) * 0.05, grade_labels[x], ha='center', fontsize=10, color='blue', fontweight='bold')

# Annotate HSR labels (0.5 - 5.0) slightly above the points
for x, y in hsr_counts.items():
    if x in hsr_labels:
        plt.text(x, y + max(hsr_counts.values) * 0.05, hsr_labels[x], ha='center', fontsize=10, color='red', fontweight='bold')

plt.xlabel("Percentage Score (0-100%)")
plt.ylabel("Product Count")
plt.title("Comparison of Nutri-Score and Health Star Rating Distribution")
plt.legend()
plt.grid()
plt.show()
