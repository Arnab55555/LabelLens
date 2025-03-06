import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
# Replace 'your_file.csv' with the correct file path
df = pd.read_csv('LatestNutriScore2.csv')

# Create a color map for the NutriScore grades (lowercase letters)
color_map = {
    'a': '#00e400',  # Green
    'b': '#66cc00',  # Light Green
    'c': '#ffcc00',  # Yellow
    'd': '#ff6600',  # Orange
    'e': '#ff0000'   # Red
}

# Apply the color map to create a 'color' column in the dataset
df['color'] = df['nutriscore_grade_final'].map(color_map)

# Plotting the bar graph
plt.figure(figsize=(10, 6))

# Create bins for NutriScore values from -15 to 40
bins = range(-15, 41, 1)  # Adjust bin range as needed

# Create axes object to adjust background
ax = plt.gca()  # Get current axes

# Set the background color of the graph area (axes area)
ax.set_facecolor('lightgrey')

# Set the gridlines
ax.grid(True, color='white', linewidth=0.8)  # White gridlines

# Plot the histogram with the same bin width for all grades
for grade, color in color_map.items():
    # Filter data by NutriScore grade
    grade_data = df[df['nutriscore_grade_final'] == grade]
   
    # Plot the colored bars for each grade, without borders
    sns.histplot(grade_data['nutriscore_score_final'], bins=bins, kde=False, color=color, label=grade, stat='count', edgecolor=None, zorder=2)

# Customize labels and title
plt.xlabel('NutriScore Value')
plt.ylabel('Number of Products')
plt.title('Distribution of Food Products by NutriScore')

# Show the legend
plt.legend(title='NutriScore Grade', loc='upper right')

# Show the plot
plt.show()