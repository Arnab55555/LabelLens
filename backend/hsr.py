

# import csv
# from enum import Enum
# from typing import List, Optional

# class Category(Enum):
#     DairyBeverages = 0
#     DairyFoods = 1
#     FatsOilsAndSpreads = 2
#     Cheese = 3
#     PlainWater = 4
#     UnsweetenedFlavouredWater = 5
#     UnprocessedFruitAndVegetables = 6
#     NonDairyBeverages = 7
#     Jellies = 8
#     WaterBasedIcedConfection = 9
#     OtherFoods = 100

# class Attributes(Enum):
#     ContainsFruitOrVegetable = 0
#     ContainsNutsOrLegumes = 1

# def category1(category):
#     return category in [Category.NonDairyBeverages, Category.Jellies, Category.WaterBasedIcedConfection]

# def category1d(category):
#     return category == Category.DairyBeverages

# def category2(category):
#     return category == Category.OtherFoods

# def category2d(category):
#     return category == Category.DairyFoods

# def category3(category):
#     return category == Category.FatsOilsAndSpreads

# def category3d(category):
#     return category == Category.Cheese

# def calculate_fruit_vegetable_nut_legume_points(category, attributes, percentage_fruit_vegetable_nut_legume):
#     if not attributes or not (Attributes.ContainsFruitOrVegetable in attributes or Attributes.ContainsNutsOrLegumes in attributes):
#         return 0

#     range_values = []

#     if category1d(category) or category2(category) or category2d(category) or category3(category) or category3d(category):
#         if Attributes.ContainsFruitOrVegetable in attributes:
#             range_values = [25, 43, 52, 63, 67, 80, 90, 100]
#         elif Attributes.ContainsNutsOrLegumes in attributes:
#             range_values = [40, 60, 67, 75, 80, 90, 95, 100]
#     elif category1(category):
#         range_values = [25, 33, 41, 49, 57, 65, 73, 81, 89, 96]
#     else:
#         return 0

#     points = next((i for i, value in enumerate(range_values) if percentage_fruit_vegetable_nut_legume < value), -1)

#     if points >= 0:
#         return points
#     elif points == -1 and percentage_fruit_vegetable_nut_legume >= range_values[-1]:
#         return len(range_values)

#     return 0

# def calculate_protein_points(category, baseline_points, fruit_vegetable_nut_legume_points, protein_grams):
#     range_values = []

#     if category1(category):
#         return 0
#     elif baseline_points >= 13 and fruit_vegetable_nut_legume_points < 5:
#         return 0
#     elif category1d(category) or category2(category) or category2d(category) or category3(category) or category3d(category):
#         range_values = [1.6, 3.1, 4.8, 6.4, 8, 9.6, 11.6, 13.9, 16.7, 20, 24, 28.9, 34.7, 41.6, 50]
#     else:
#         return 0

#     points = next((i for i, value in enumerate(range_values) if protein_grams <= value), -1)

#     if points >= 0:
#         return points
#     elif points == -1 and protein_grams >= range_values[-1]:
#         return len(range_values)

#     return 0

# def calculate_fibre_points(category, fibre_grams):
#     range_values = []

#     if category1(category) or category1d(category):
#         return 0
#     elif category2(category) or category2d(category) or category3(category) or category3d(category):
#         range_values = [0.9, 1.9, 2.8, 3.7, 4.7, 5.4, 6.3, 7.3, 8.4, 9.7, 11.2, 13, 15, 17.3, 20]
#     else:
#         return 0

#     points = next((i for i, value in enumerate(range_values) if fibre_grams <= value), -1)

#     if points >= 0:
#         return points
#     elif points == -1 and fibre_grams >= range_values[-1]:
#         return len(range_values)

#     return 0

# def calculate_baseline_points(category, nutritional_information):
#     ranges = {
#         'energykJ': [],
#         'saturatedFatGrams': [],
#         'totalSugarsGrams': [],
#         'sodiumMilligrams': [],
#     }

#     common_energy_range = [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350, 3685]
#     common_sodium_range = [90, 180, 270, 360, 450, 540, 630, 720, 810, 900, 990, 1080, 1170, 1260, 1350, 1440, 1530, 1620, 1710, 1800, 1890, 1980, 2070, 2160, 2250, 2340, 2430, 2520, 2610, 2700]

#     if category1d(category) or category2(category) or category2d(category):
#         ranges['energykJ'] = common_energy_range
#         ranges['saturatedFatGrams'] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11.2, 12.5, 13.9, 15.5, 17.3, 19.3, 21.6, 24.1, 26.9, 30, 33.5, 37.4, 41.7, 46.6, 52, 58, 64.7, 72.3, 80.6, 90]
#         ranges['totalSugarsGrams'] = [5, 8.9, 12.8, 16.8, 20.7, 24.6, 28.5, 32.4, 36.3, 40.3, 44.2, 48.1, 52, 55.9, 59.8, 63.8, 67.7, 71.6, 75.5, 79.4, 83.3, 87.3, 91.2, 95.1, 99]
#         ranges['sodiumMilligrams'] = common_sodium_range
#     elif category3(category) or category3d(category):
#         ranges['energykJ'] = common_energy_range
#         ranges['saturatedFatGrams'] = list(range(1, 31))  # [1..30]
#         ranges['totalSugarsGrams'] = [5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45]
#         ranges['sodiumMilligrams'] = common_sodium_range
#     elif category1(category):
#         ranges['energykJ'] = [-1, 31, 61, 91, 121, 151, 181, 211, 241, 271]
#         ranges['totalSugarsGrams'] = [0.1, 1.6, 3.1, 4.6, 6.1, 7.6, 9.1, 10.6, 12.1, 13.6]
#     else:
#         return 0

#     total = 0

#     for key, range_values in ranges.items():
#         if not range_values:
#             continue

#         nutrition = nutritional_information.get(key, 0)
#         points = next((i for i, value in enumerate(range_values) if nutrition <= value), -1)

#         if points >= 0:
#             total += points
#         elif points == -1 and nutrition >= range_values[-1]:
#             total += len(range_values)

#     return total

# def rating_from_total_points(category, total_points):
#     point_range = []
#     ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5]
#     rounded_points = round(total_points)

#     if category1(category):
#         point_range = [-float('inf'), -float('inf'), 0, 1, 3, 5, 7, 9, 11, 12]
#     elif category1d(category):
#         point_range = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
#     elif category2(category):
#         point_range = [-11, -7, -2, 2, 6, 11, 15, 20, 24, 25]
#     elif category2d(category):
#         point_range = [-2, 0, 2, 3, 5, 7, 8, 10, 12, 13]
#     elif category3(category):
#         point_range = [13, 16, 20, 23, 27, 30, 34, 37, 41, 42]
#     elif category3d(category):
#         point_range = [24, 26, 28, 30, 31, 33, 35, 37, 39, 40]
#     else:
#         return None

#     rating_index = next((i for i, value in enumerate(point_range) if rounded_points <= value), -1)

#     if rating_index >= 0:
#         return ratings[rating_index]
#     elif rating_index == -1 and rounded_points >= point_range[-1]:
#         return ratings[-1]

#     return None

# def calculate_health_star_rating(category, nutritional_information):
#     if not isinstance(category, Category):
#         raise TypeError(f"Expected a Category, got {type(category).__name__}")

#     if category in [Category.PlainWater, Category.UnprocessedFruitAndVegetables]:
#         return 5

#     if category == Category.UnsweetenedFlavouredWater:
#         return 4.5

#     baseline_points = calculate_baseline_points(category, nutritional_information)
#     fibre_points = calculate_fibre_points(category, nutritional_information.get('fibreGrams', 0))
#     fruit_vegetable_nut_legume_points = calculate_fruit_vegetable_nut_legume_points(
#         category,
#         nutritional_information.get('attributes', []),
#         nutritional_information.get('percentageFruitVegetableNutLegume', 0)
#     )
#     protein_points = calculate_protein_points(
#         category,
#         baseline_points,
#         fruit_vegetable_nut_legume_points,
#         nutritional_information.get('proteinGrams', 0)
#     )

#     total_points = baseline_points - fibre_points - fruit_vegetable_nut_legume_points - protein_points
#     health_star_rating = rating_from_total_points(category, total_points)

#     return health_star_rating

# def map_category(csv_category):
#     category_mapping = {
#         'Beverages': Category.NonDairyBeverages,
#         'Cheese': Category.Cheese,
#         'Dairy': Category.DairyFoods,
#         'Fat/Nuts/Oil/Seeds': Category.FatsOilsAndSpreads,
#         'General Food': Category.OtherFoods,
#         'Water': Category.PlainWater,
#     }
#     return category_mapping.get(csv_category, None)

# def process_csv(input_file, output_file):
#     with open(input_file, mode='r', newline='', encoding='utf-8') as infile, open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
#         reader = csv.DictReader(infile)
#         fieldnames = reader.fieldnames + ['HealthStarRating']
#         writer = csv.DictWriter(outfile, fieldnames=fieldnames)
#         writer.writeheader()

#         for row in reader:
#             category = map_category(row['category'])
#             if category is None:
#                 row['HealthStarRating'] = 'Not Applicable'
#             else:
#                 nutritional_information = {
#                     'energykJ': float(row['energy_100g']) if row['energy_100g'] else 0,
#                     'saturatedFatGrams': float(row['saturated-fat_100g']) if row['saturated-fat_100g'] else 0,
#                     'totalSugarsGrams': float(row['sugars_100g']) if row['sugars_100g'] else 0,
#                     'sodiumMilligrams': (float(row['salt_100g']) / 2.5 * 1000) if row['salt_100g'] else 0,
#                     'fibreGrams': float(row.get('fiber_100g', 0)) if row.get('fiber_100g') else 0,
#                     'proteinGrams': float(row.get('proteins_100g', 0)) if row.get('proteins_100g') else 0,
#                 }
#                 try:
#                     hsr = calculate_health_star_rating(category, nutritional_information)
#                     row['HealthStarRating'] = hsr
#                 except Exception as e:
#                     row['HealthStarRating'] = 'Error'

#             writer.writerow(row)

# # Example usage
# process_csv('LatestNutriScore.csv', 'Nutri_HSR_Score.csv')


# import csv
# from enum import Enum
# from typing import List, Optional

# class Category(Enum):
#     DairyBeverages = 0
#     DairyFoods = 1
#     FatsOilsAndSpreads = 2
#     Cheese = 3
#     PlainWater = 4
#     UnsweetenedFlavouredWater = 5
#     UnprocessedFruitAndVegetables = 6
#     NonDairyBeverages = 7
#     Jellies = 8
#     WaterBasedIcedConfection = 9
#     OtherFoods = 100

# class Attributes(Enum):
#     ContainsFruitOrVegetable = 0
#     ContainsNutsOrLegumes = 1

# def category1(category):
#     return category in [Category.NonDairyBeverages, Category.Jellies, Category.WaterBasedIcedConfection]

# def category1d(category):
#     return category == Category.DairyBeverages

# def category2(category):
#     return category == Category.OtherFoods

# def category2d(category):
#     return category == Category.DairyFoods

# def category3(category):
#     return category == Category.FatsOilsAndSpreads

# def category3d(category):
#     return category == Category.Cheese

# def calculate_fruit_vegetable_nut_legume_points(category, attributes, percentage_fruit_vegetable_nut_legume):
#     if not attributes or not (Attributes.ContainsFruitOrVegetable in attributes or Attributes.ContainsNutsOrLegumes in attributes):
#         return 0

#     range_values = []

#     if category1d(category) or category2(category) or category2d(category) or category3(category) or category3d(category):
#         if Attributes.ContainsFruitOrVegetable in attributes:
#             range_values = [25, 43, 52, 63, 67, 80, 90, 100]
#         elif Attributes.ContainsNutsOrLegumes in attributes:
#             range_values = [40, 60, 67, 75, 80, 90, 95, 100]
#     elif category1(category):
#         range_values = [25, 33, 41, 49, 57, 65, 73, 81, 89, 96]
#     else:
#         return 0

#     points = next((i for i, value in enumerate(range_values) if percentage_fruit_vegetable_nut_legume < value), -1)

#     if points >= 0:
#         return points
#     elif points == -1 and percentage_fruit_vegetable_nut_legume >= range_values[-1]:
#         return len(range_values)

#     return 0

# def calculate_protein_points(category, baseline_points, fruit_vegetable_nut_legume_points, protein_grams):
#     range_values = []

#     if category1(category):
#         return 0
#     elif baseline_points >= 13 and fruit_vegetable_nut_legume_points < 5:
#         return 0
#     elif category1d(category) or category2(category) or category2d(category) or category3(category) or category3d(category):
#         range_values = [1.6, 3.1, 4.8, 6.4, 8, 9.6, 11.6, 13.9, 16.7, 20, 24, 28.9, 34.7, 41.6, 50]
#     else:
#         return 0

#     points = next((i for i, value in enumerate(range_values) if protein_grams <= value), -1)

#     if points >= 0:
#         return points
#     elif points == -1 and protein_grams >= range_values[-1]:
#         return len(range_values)

#     return 0

# def calculate_fibre_points(category, fibre_grams):
#     range_values = []

#     if category1(category) or category1d(category):
#         return 0
#     elif category2(category) or category2d(category) or category3(category) or category3d(category):
#         range_values = [0.9, 1.9, 2.8, 3.7, 4.7, 5.4, 6.3, 7.3, 8.4, 9.7, 11.2, 13, 15, 17.3, 20]
#     else:
#         return 0

#     points = next((i for i, value in enumerate(range_values) if fibre_grams <= value), -1)

#     if points >= 0:
#         return points
#     elif points == -1 and fibre_grams >= range_values[-1]:
#         return len(range_values)

#     return 0

# def calculate_baseline_points(category, nutritional_information):
#     ranges = {
#         'energykJ': [],
#         'saturatedFatGrams': [],
#         'totalSugarsGrams': [],
#         'sodiumMilligrams': [],
#     }

#     common_energy_range = [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350, 3685]
#     common_sodium_range = [90, 180, 270, 360, 450, 540, 630, 720, 810, 900, 990, 1080, 1170, 1260, 1350, 1440, 1530, 1620, 1710, 1800, 1890, 1980, 2070, 2160, 2250, 2340, 2430, 2520, 2610, 2700]

#     if category1d(category) or category2(category) or category2d(category):
#         ranges['energykJ'] = common_energy_range
#         ranges['saturatedFatGrams'] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11.2, 12.5, 13.9, 15.5, 17.3, 19.3, 21.6, 24.1, 26.9, 30, 33.5, 37.4, 41.7, 46.6, 52, 58, 64.7, 72.3, 80.6, 90]
#         ranges['totalSugarsGrams'] = [5, 8.9, 12.8, 16.8, 20.7, 24.6, 28.5, 32.4, 36.3, 40.3, 44.2, 48.1, 52, 55.9, 59.8, 63.8, 67.7, 71.6, 75.5, 79.4, 83.3, 87.3, 91.2, 95.1, 99]
#         ranges['sodiumMilligrams'] = common_sodium_range
#     elif category3(category) or category3d(category):
#         ranges['energykJ'] = common_energy_range
#         ranges['saturatedFatGrams'] = list(range(1, 31))  # [1..30]
#         ranges['totalSugarsGrams'] = [5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45]
#         ranges['sodiumMilligrams'] = common_sodium_range
#     elif category1(category):
#         ranges['energykJ'] = [-1, 31, 61, 91, 121, 151, 181, 211, 241, 271]
#         ranges['totalSugarsGrams'] = [0.1, 1.6, 3.1, 4.6, 6.1, 7.6, 9.1, 10.6, 12.1, 13.6]
#     else:
#         return 0

#     total = 0

#     for key, range_values in ranges.items():
#         if not range_values:
#             continue

#         nutrition = nutritional_information.get(key, 0)
#         points = next((i for i, value in enumerate(range_values) if nutrition <= value), -1)

#         if points >= 0:
#             total += points
#         elif points == -1 and nutrition >= range_values[-1]:
#             total += len(range_values)

#     return total

# def rating_from_total_points(category, total_points):
#     point_range = []
#     ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5]
#     rounded_points = round(total_points)

#     if category1(category):
#         point_range = [-float('inf'), -float('inf'), 0, 1, 3, 5, 7, 9, 11, 12]
#     elif category1d(category):
#         point_range = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
#     elif category2(category):
#         point_range = [-11, -7, -2, 2, 6, 11, 15, 20, 24, 25]
#     elif category2d(category):
#         point_range = [-2, 0, 2, 3, 5, 7, 8, 10, 12, 13]
#     elif category3(category):
#         point_range = [13, 16, 20, 23, 27, 30, 34, 37, 41, 42]
#     elif category3d(category):
#         point_range = [24, 26, 28, 30, 31, 33, 35, 37, 39, 40]
#     else:
#         return None

#     rating_index = next((i for i, value in enumerate(point_range) if rounded_points <= value), -1)

#     if rating_index >= 0:
#         return ratings[rating_index]
#     elif rating_index == -1 and rounded_points >= point_range[-1]:
#         return ratings[-1]

#     return None

# def calculate_health_star_rating(category, nutritional_information):
#     if not isinstance(category, Category):
#         raise TypeError(f"Expected a Category, got {type(category).__name__}")

#     if category in [Category.PlainWater, Category.UnprocessedFruitAndVegetables]:
#         return 5

#     if category == Category.UnsweetenedFlavouredWater:
#         return 4.5

#     baseline_points = calculate_baseline_points(category, nutritional_information)
#     fibre_points = calculate_fibre_points(category, nutritional_information.get('fibreGrams', 0))
#     fruit_vegetable_nut_legume_points = calculate_fruit_vegetable_nut_legume_points(
#         category,
#         nutritional_information.get('attributes', []),
#         nutritional_information.get('percentageFruitVegetableNutLegume', 0)
#     )
#     protein_points = calculate_protein_points(
#         category,
#         baseline_points,
#         fruit_vegetable_nut_legume_points,
#         nutritional_information.get('proteinGrams', 0)
#     )

#     total_points = baseline_points - fibre_points - fruit_vegetable_nut_legume_points - protein_points
#     health_star_rating = rating_from_total_points(category, total_points)

#     return health_star_rating, total_points

# def map_category(csv_category):
#     category_mapping = {
#         'Beverages': Category.NonDairyBeverages,
#         'Cheese': Category.Cheese,
#         'Dairy': Category.DairyFoods,
#         'Fat/Nuts/Oil/Seeds': Category.FatsOilsAndSpreads,
#         'General Food': Category.OtherFoods,
#         'Water': Category.PlainWater,
#     }
#     return category_mapping.get(csv_category, None)

# def process_csv(input_file, output_file):
#     with open(input_file, mode='r', newline='', encoding='utf-8') as infile, open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
#         reader = csv.DictReader(infile)
#         fieldnames = reader.fieldnames + ['HealthStarRating', 'hsr_total_points']
#         writer = csv.DictWriter(outfile, fieldnames=fieldnames)
#         writer.writeheader()

#         for row in reader:
#             category = map_category(row['category'])
#             if category is None:
#                 row['HealthStarRating'] = 'Not Applicable'
#                 row['hsr_total_points'] = 'Not Applicable'
#             else:
#                 nutritional_information = {
#                     'energykJ': float(row['energy_100g']) if row['energy_100g'] else 0,
#                     'saturatedFatGrams': float(row['saturated-fat_100g']) if row['saturated-fat_100g'] else 0,
#                     'totalSugarsGrams': float(row['sugars_100g']) if row['sugars_100g'] else 0,
#                     'sodiumMilligrams': (float(row['salt_100g']) / 2.5 * 1000) if row['salt_100g'] else 0,
#                     'fibreGrams': float(row.get('fiber_100g', 0)) if row.get('fiber_100g') else 0,
#                     'proteinGrams': float(row.get('proteins_100g', 0)) if row.get('proteins_100g') else 0,
#                 }
#                 try:
#                     hsr, total_points = calculate_health_star_rating(category, nutritional_information)
#                     row['HealthStarRating'] = hsr
#                     row['hsr_total_points'] = total_points
#                 except Exception as e:
#                     row['HealthStarRating'] = 'Error'
#                     row['hsr_total_points'] = 'Error'

#             writer.writerow(row)

# # Example usage
# process_csv('LatestNutriScore.csv', 'HSR_POINTS_NUTRI.csv')

import csv
from enum import Enum
from typing import List, Optional

class Category(Enum):
    DairyBeverages = 0
    DairyFoods = 1
    FatsOilsAndSpreads = 2
    Cheese = 3
    PlainWater = 4
    UnsweetenedFlavouredWater = 5
    UnprocessedFruitAndVegetables = 6
    NonDairyBeverages = 7
    Jellies = 8
    WaterBasedIcedConfection = 9
    OtherFoods = 100

class Attributes(Enum):
    ContainsFruitOrVegetable = 0
    ContainsNutsOrLegumes = 1

def category1(category):
    return category in [Category.NonDairyBeverages, Category.Jellies, Category.WaterBasedIcedConfection]

def category1d(category):
    return category == Category.DairyBeverages

def category2(category):
    return category == Category.OtherFoods

def category2d(category):
    return category == Category.DairyFoods

def category3(category):
    return category == Category.FatsOilsAndSpreads

def category3d(category):
    return category == Category.Cheese

def calculate_fruit_vegetable_nut_legume_points(category, attributes, percentage_fruit_vegetable_nut_legume):
    if not attributes or not (Attributes.ContainsFruitOrVegetable in attributes or Attributes.ContainsNutsOrLegumes in attributes):
        return 0

    range_values = []

    if category1d(category) or category2(category) or category2d(category) or category3(category) or category3d(category):
        if Attributes.ContainsFruitOrVegetable in attributes:
            range_values = [25, 43, 52, 63, 67, 80, 90, 100]
        elif Attributes.ContainsNutsOrLegumes in attributes:
            range_values = [40, 60, 67, 75, 80, 90, 95, 100]
    elif category1(category):
        range_values = [25, 33, 41, 49, 57, 65, 73, 81, 89, 96]
    else:
        return 0

    points = next((i for i, value in enumerate(range_values) if percentage_fruit_vegetable_nut_legume < value), -1)

    if points >= 0:
        return points
    elif points == -1 and percentage_fruit_vegetable_nut_legume >= range_values[-1]:
        return len(range_values)

    return 0

def calculate_protein_points(category, baseline_points, fruit_vegetable_nut_legume_points, protein_grams):
    range_values = []

    if category1(category):
        return 0
    elif baseline_points >= 13 and fruit_vegetable_nut_legume_points < 5:
        return 0
    elif category1d(category) or category2(category) or category2d(category) or category3(category) or category3d(category):
        range_values = [1.6, 3.1, 4.8, 6.4, 8, 9.6, 11.6, 13.9, 16.7, 20, 24, 28.9, 34.7, 41.6, 50]
    else:
        return 0

    points = next((i for i, value in enumerate(range_values) if protein_grams <= value), -1)

    if points >= 0:
        return points
    elif points == -1 and protein_grams >= range_values[-1]:
        return len(range_values)

    return 0

def calculate_fibre_points(category, fibre_grams):
    range_values = []

    if category1(category) or category1d(category):
        return 0
    elif category2(category) or category2d(category) or category3(category) or category3d(category):
        range_values = [0.9, 1.9, 2.8, 3.7, 4.7, 5.4, 6.3, 7.3, 8.4, 9.7, 11.2, 13, 15, 17.3, 20]
    else:
        return 0

    points = next((i for i, value in enumerate(range_values) if fibre_grams <= value), -1)

    if points >= 0:
        return points
    elif points == -1 and fibre_grams >= range_values[-1]:
        return len(range_values)

    return 0

def calculate_baseline_points(category, nutritional_information):
    ranges = {
        'energykJ': [],
        'saturatedFatGrams': [],
        'totalSugarsGrams': [],
        'sodiumMilligrams': [],
    }

    common_energy_range = [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350, 3685]
    common_sodium_range = [90, 180, 270, 360, 450, 540, 630, 720, 810, 900, 990, 1080, 1170, 1260, 1350, 1440, 1530, 1620, 1710, 1800, 1890, 1980, 2070, 2160, 2250, 2340, 2430, 2520, 2610, 2700]

    if category1d(category) or category2(category) or category2d(category):
        ranges['energykJ'] = common_energy_range
        ranges['saturatedFatGrams'] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11.2, 12.5, 13.9, 15.5, 17.3, 19.3, 21.6, 24.1, 26.9, 30, 33.5, 37.4, 41.7, 46.6, 52, 58, 64.7, 72.3, 80.6, 90]
        ranges['totalSugarsGrams'] = [5, 8.9, 12.8, 16.8, 20.7, 24.6, 28.5, 32.4, 36.3, 40.3, 44.2, 48.1, 52, 55.9, 59.8, 63.8, 67.7, 71.6, 75.5, 79.4, 83.3, 87.3, 91.2, 95.1, 99]
        ranges['sodiumMilligrams'] = common_sodium_range
    elif category3(category) or category3d(category):
        ranges['energykJ'] = common_energy_range
        ranges['saturatedFatGrams'] = list(range(1, 31))  # [1..30]
        ranges['totalSugarsGrams'] = [5, 9, 13.5, 18, 22.5, 27, 31, 36, 40, 45]
        ranges['sodiumMilligrams'] = common_sodium_range
    elif category1(category):
        ranges['energykJ'] = [-1, 31, 61, 91, 121, 151, 181, 211, 241, 271]
        ranges['totalSugarsGrams'] = [0.1, 1.6, 3.1, 4.6, 6.1, 7.6, 9.1, 10.6, 12.1, 13.6]
    else:
        return 0

    total = 0

    for key, range_values in ranges.items():
        if not range_values:
            continue

        nutrition = nutritional_information.get(key, 0)
        points = next((i for i, value in enumerate(range_values) if nutrition <= value), -1)

        if points >= 0:
            total += points
        elif points == -1 and nutrition >= range_values[-1]:
            total += len(range_values)

    return total

def rating_from_total_points(category, total_points):
    point_range = []
    ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5]
    rounded_points = round(total_points)

    if category1(category):
        point_range = [-float('inf'), -float('inf'), 0, 1, 3, 5, 7, 9, 11, 12]
    elif category1d(category):
        point_range = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7]
    elif category2(category):
        point_range = [-11, -7, -2, 2, 6, 11, 15, 20, 24, 25]
    elif category2d(category):
        point_range = [-2, 0, 2, 3, 5, 7, 8, 10, 12, 13]
    elif category3(category):
        point_range = [13, 16, 20, 23, 27, 30, 34, 37, 41, 42]
    elif category3d(category):
        point_range = [24, 26, 28, 30, 31, 33, 35, 37, 39, 40]
    else:
        return None

    rating_index = next((i for i, value in enumerate(point_range) if rounded_points <= value), -1)

    if rating_index >= 0:
        return ratings[rating_index]
    elif rating_index == -1 and rounded_points >= point_range[-1]:
        return ratings[-1]

    return None

def calculate_health_star_rating(category, nutritional_information):
    if not isinstance(category, Category):
        raise TypeError(f"Expected a Category, got {type(category).__name__}")

    if category in [Category.PlainWater, Category.UnprocessedFruitAndVegetables]:
        return 5, 0

    if category == Category.UnsweetenedFlavouredWater:
        return 4.5, 0

    baseline_points = calculate_baseline_points(category, nutritional_information)
    fibre_points = calculate_fibre_points(category, nutritional_information.get('fibreGrams', 0))
    fruit_vegetable_nut_legume_points = calculate_fruit_vegetable_nut_legume_points(
        category,
        nutritional_information.get('attributes', []),
        nutritional_information.get('percentageFruitVegetableNutLegume', 0)
    )
    protein_points = calculate_protein_points(
        category,
        baseline_points,
        fruit_vegetable_nut_legume_points,
        nutritional_information.get('proteinGrams', 0)
    )

    total_points = baseline_points - fibre_points - fruit_vegetable_nut_legume_points - protein_points
    health_star_rating = rating_from_total_points(category, total_points)

    return health_star_rating, total_points

def map_category(csv_category):
    category_mapping = {
        'Beverages': Category.NonDairyBeverages,
        'Cheese': Category.Cheese,
        'Dairy': Category.DairyFoods,
        'Fat/Nuts/Oil/Seeds': Category.FatsOilsAndSpreads,
        'General Food': Category.OtherFoods,
        'Water': Category.PlainWater,
    }
    return category_mapping.get(csv_category, None)

def process_csv(input_file, output_file):
    def safe_float(value):
        try:
            return float(value)
        except ValueError:
            return 0.0

    with open(input_file, mode='r', newline='', encoding='utf-8') as infile, open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames + ['HealthStarRating', 'HSRTotalPoints']
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            category = map_category(row['category'])
            if category is None:
                row['HealthStarRating'] = 'Not Applicable'
                row['HSRTotalPoints'] = 'Not Applicable'
            else:
                nutritional_information = {
                    'energykJ': safe_float(row['energy_100g']),
                    'saturatedFatGrams': safe_float(row['saturated-fat_100g']),
                    'totalSugarsGrams': safe_float(row['sugars_100g']),
                    'sodiumMilligrams': safe_float(row['salt_100g']) / 2.5 * 1000,
                    'fibreGrams': safe_float(row.get('fiber_100g', 0)),
                    'proteinGrams': safe_float(row.get('proteins_100g', 0)),
                }
                try:
                    hsr, total_points = calculate_health_star_rating(category, nutritional_information)
                    row['HealthStarRating'] = hsr
                    row['HSRTotalPoints'] = total_points
                except Exception as e:
                    row['HealthStarRating'] = 'Error'
                    row['HSRTotalPoints'] = 'Error'

            writer.writerow(row)

# Example usage
process_csv('LatestNutriScore.csv', 'output_hsr.csv')