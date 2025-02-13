# import pandas as pd
# import matplotlib.pyplot as plt
# import seaborn as sns
# import numpy as np

# # Load dataset
# df = pd.read_csv('HSR_POINTS_NUTRI.csv')

# # Convert 'hsr_total_points' to numeric (handling errors if any non-numeric values exist)
# df['hsr_total_points'] = pd.to_numeric(df['hsr_total_points'], errors='coerce')

# # Drop NaN values (if conversion failed for any row)
# df = df.dropna(subset=['hsr_total_points'])

# # Group data by hsr_total_points and count the number of products
# distribution = df['hsr_total_points'].value_counts().sort_index()

# # Define color gradient from red to dark green based on star rating
# colors = sns.color_palette("RdYlGn", n_colors=len(distribution))

# # Plot the bar chart
# plt.figure(figsize=(10, 6))
# bars = plt.bar(distribution.index, distribution.values, color=colors)

# # Labels and title
# plt.xlabel("HSR Total Points")
# plt.ylabel("Number of Products")
# plt.title("Distribution of Health Star Ratings")

# # Ensure xticks are properly formatted as integers
# plt.xticks(np.arange(int(min(distribution.index)), int(max(distribution.index)) + 1, step=1))

# # Show the plot
# plt.show()

# import pandas as pd
# import matplotlib.pyplot as plt
# import seaborn as sns
# import numpy as np

# # Load dataset
# df = pd.read_csv('HSR_POINTS_NUTRI.csv')

# # Convert 'hsr_total_points' to numeric (handling errors if any non-numeric values exist)
# df['hsr_total_points'] = pd.to_numeric(df['hsr_total_points'], errors='coerce')

# # Drop NaN values (if conversion failed for any row)
# df = df.dropna(subset=['hsr_total_points'])

# # Convert to integer if necessary
# df['hsr_total_points'] = df['hsr_total_points'].astype(int)

# # Get the full range of points
# min_val, max_val = df['hsr_total_points'].min(), df['hsr_total_points'].max()
# all_points = np.arange(min_val, max_val + 1)

# # Compute the distribution
# distribution = df['hsr_total_points'].value_counts().reindex(all_points, fill_value=0).sort_index()

# # Define color gradient from green to red (Nutri-Score inspired but with more shades)
# colors = sns.color_palette("RdYlGn_r", n_colors=len(distribution))  # Reverse for green to red

# # Plot the bar chart with no gaps
# plt.figure(figsize=(10, 6))
# plt.bar(distribution.index, distribution.values, color=colors, width=1.0)  # Width 1.0 ensures bars touch

# # Labels and title
# plt.xlabel("HSR Total Points")
# plt.ylabel("Number of Products")
# plt.title("Distribution of Health Star Ratings")

# # Properly format xticks
# plt.xticks(distribution.index)

# # Show the plot
# plt.show()
# 
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load the dataset
df = pd.read_csv('output_hsr.csv')

# Convert HealthStarRating and HSRTotalPoints to numeric, coercing errors to NaN
df['HealthStarRating'] = pd.to_numeric(df['HealthStarRating'], errors='coerce')
df['HSRTotalPoints'] = pd.to_numeric(df['HSRTotalPoints'], errors='coerce')

# Drop rows with NaN values in HealthStarRating or HSRTotalPoints
df = df.dropna(subset=['HealthStarRating', 'HSRTotalPoints'])

# Group by HSRTotalPoints and count the number of products
points_counts = df.groupby('HSRTotalPoints').size().reset_index(name='Counts')

# Define the color grading similar to Nutri-Score
colors = {
    0.5: '#FF0000',  # Red
    1.0: '#FF4500',  # Orange-Red
    1.5: '#FF8C00',  # Dark Orange
    2.0: '#FFD700',  # Gold
    2.5: '#ADFF2F',  # Green Yellow
    3.0: '#7FFF00',  # Chartreuse
    3.5: '#32CD32',  # Lime Green
    4.0: '#00FF00',  # Lime
    4.5: '#00FA9A',  # Medium Spring Green
    5.0: '#00FF7F'   # Spring Green
}

# Create a color list for each bar based on the average HealthStarRating for each HSRTotalPoints
average_ratings = df.groupby('HSRTotalPoints')['HealthStarRating'].mean().reset_index()
average_ratings['Color'] = average_ratings['HealthStarRating'].apply(lambda x: colors[round(x * 2) / 2])

# Merge the counts and average ratings dataframes
merged_data = pd.merge(points_counts, average_ratings, on='HSRTotalPoints')

# Sort the merged data by HSRTotalPoints
merged_data = merged_data.sort_values(by='HSRTotalPoints')

# Create a bar plot
plt.figure(figsize=(10, 6))
bars = plt.bar(merged_data['HSRTotalPoints'], merged_data['Counts'], color=merged_data['Color'], width=1.0)

# Set background color to light grey
plt.gca().set_facecolor('#D3D3D3')

# Determine grid intervals
max_count = merged_data['Counts'].max()
y_ticks = np.linspace(0, max_count, 6)  # Exactly 6 y-ticks
x_ticks = np.linspace(merged_data['HSRTotalPoints'].min(), merged_data['HSRTotalPoints'].max(), 6)  # 6 x-ticks

# Set x and y ticks
plt.xticks(x_ticks.astype(int))  
plt.yticks(y_ticks.astype(int))

# Add limited grid lines
plt.grid(color='white', linestyle='-', linewidth=0.7, axis='both')  # Enable grid for both axes
plt.gca().set_axisbelow(True)  # Keep grid below bars

# Add labels and title
plt.xlabel('HSR Total Points')
plt.ylabel('Number of Products')
plt.title('HSR Total Points Distribution with Health Star Rating Color Coding')

# Create a legend
handles = [plt.Rectangle((0, 0), 1, 1, color=colors[rating]) for rating in sorted(colors.keys())]
labels = [f'{rating} Stars' for rating in sorted(colors.keys())]
plt.legend(handles, labels, title='Health Star Rating')

# Show the plot
plt.show()
