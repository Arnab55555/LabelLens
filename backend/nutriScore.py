import csv

# Updated thresholds for 2023 Nutri-Score
points_thresholds_2023 = {
    # Negative points
    "energy": [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350],    # kJ / 100g
    "energy_beverages": [30, 90, 150, 210, 240, 270, 300, 330, 360, 390],    # kJ / 100g or 100ml
    "sugars": [3.4, 6.8, 10, 14, 17, 20, 24, 27, 31, 34, 37, 41, 44, 48, 51],    # g / 100g
    "sugars_beverages": [0.5, 2, 3.5, 5, 6, 7, 8, 9, 10, 11],    # g / 100g or 100ml
    "saturated_fat": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],    # g / 100g
    "salt": [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.8, 4],    # g / 100g

    # For fats
    "energy_from_saturated_fat": [120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200],    # kJ / 100g
    "saturated_fat_ratio": [10, 16, 22, 28, 34, 40, 46, 52, 58, 64],    # %

    # Positive points
    "fruits_vegetables_legumes": [40, 60, 80, 80, 80],    # %
    "fruits_vegetables_legumes_beverages": [40, 40, 60, 60, 80, 80],
    "fiber": [3.0, 4.1, 5.2, 6.3, 7.4],    # g / 100g - AOAC method
    "proteins": [2.4, 4.8, 7.2, 9.6, 12, 14, 17],    # g / 100g
    "proteins_beverages": [1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3.0],    # g / 100g
}

def round_to_max_decimal_places(value, decimals):
    return round(value, decimals)

def add_units_to_positive_and_negative_nutriscore_components(nutriscore_data_ref):
    for type in ['positive', 'negative']:
        components = nutriscore_data_ref['components'].get(type, [])

        for component in components:
            # Compute the unit.
            unit = None
            if component['id'] == 'non_nutritive_sweeteners':
                unit = 'number'
            elif component['id'] in ['fruits_vegetables_legumes', 'saturated_fat_ratio']:
                unit = '%'
            else:
                if component['id'].startswith('energy'):
                    unit = 'kJ'
                else:
                    unit = 'g'
            component['unit'] = unit

def compute_nutriscore_score_2023(nutriscore_data_ref):
    energy = "energy"
    saturated_fat = "saturated_fat"
    if nutriscore_data_ref.get('is_fat_oil_nuts_seeds'):
        saturated_fat = "saturated_fat_ratio"
        energy = "energy_from_saturated_fat"

    # Initialize points for each nutrient
    for nutrient in [energy, "sugars", saturated_fat, "salt", "fruits_vegetables_legumes", "fiber", "proteins"]:
        nutrient_threshold_id = nutrient
        if nutriscore_data_ref.get('is_beverage') and f"{nutrient}_beverages" in points_thresholds_2023:
            nutrient_threshold_id += "_beverages"

        nutriscore_data_ref[f"{nutrient}_points"] = 0

        # If the nutrient value is defined, assign points according to the thresholds
        if nutrient in nutriscore_data_ref:
            for threshold in points_thresholds_2023[nutrient_threshold_id]:
                if (nutrient == "saturated_fat_ratio" and nutriscore_data_ref[nutrient] >= threshold) or \
                   (nutrient != "saturated_fat_ratio" and nutriscore_data_ref[nutrient] > threshold):
                    nutriscore_data_ref[f"{nutrient}_points"] += 1

        # Set maximum points for the nutrient
        nutriscore_data_ref[f"{nutrient}_points_max"] = len(points_thresholds_2023[nutrient_threshold_id])

    # For red meat products, the number of maximum protein points is set at 2 points
    if nutriscore_data_ref.get('is_red_meat_product') and nutriscore_data_ref.get('proteins_points', 0) > 2:
        nutriscore_data_ref['proteins_points'] = 2
        nutriscore_data_ref['proteins_points_limited_reason'] = "red_meat_product"

    # Store the lists of negative and positive components retained for the Nutri-Score of the product
    nutriscore_data_ref['components'] = {
        'negative': [],
        'positive': [],
    }

    # Negative points calculation
    negative_components = [energy, "sugars", saturated_fat, "salt"]

    # Beverages with non-nutritive sweeteners have 4 extra negative points
    if nutriscore_data_ref.get('is_beverage'):
        negative_components.append("non_nutritive_sweeteners")
        nutriscore_data_ref['non_nutritive_sweeteners_points_max'] = 4
        nutriscore_data_ref['non_nutritive_sweeteners_points'] = 4 if nutriscore_data_ref.get('non_nutritive_sweeteners', 0) > 0 else 0

    nutriscore_data_ref['negative_points'] = 0

    for nutrient in negative_components:
        points = nutriscore_data_ref.get(f"{nutrient}_points", 0)
        points_max = nutriscore_data_ref.get(f"{nutrient}_points_max", 0)
        nutriscore_data_ref['components']['negative'].append({
            'id': nutrient,
            'value': round(nutriscore_data_ref.get(nutrient, 0), 2),
            'points': points,
            'points_max': points_max,
        })
        nutriscore_data_ref['negative_points'] += points
        nutriscore_data_ref['negative_points_max'] = nutriscore_data_ref.get('negative_points_max', 0) + points_max

    # Positive points calculation
    nutriscore_data_ref['positive_points'] = 0
    nutriscore_data_ref['positive_nutrients'] = ["fiber", "fruits_vegetables_legumes"]

    # Positive points for proteins are counted under certain conditions
    nutriscore_data_ref['count_proteins'] = 0
    if nutriscore_data_ref.get('is_beverage'):
        nutriscore_data_ref['count_proteins'] = 1
        nutriscore_data_ref['count_proteins_reason'] = "beverage"
    elif nutriscore_data_ref.get('is_cheese'):
        nutriscore_data_ref['count_proteins'] = 1
        nutriscore_data_ref['count_proteins_reason'] = "cheese"
    else:
        if nutriscore_data_ref.get('is_fat_oil_nuts_seeds'):
            if nutriscore_data_ref.get('negative_points', 0) < 7:
                nutriscore_data_ref['count_proteins'] = 1
                nutriscore_data_ref['count_proteins_reason'] = "negative_points_less_than_7"
            else:
                nutriscore_data_ref['count_proteins_reason'] = "negative_points_greater_than_or_equal_to_7"
        else:
            if nutriscore_data_ref.get('negative_points', 0) < 11:
                nutriscore_data_ref['count_proteins'] = 1
                nutriscore_data_ref['count_proteins_reason'] = "negative_points_less_than_11"
            else:
                nutriscore_data_ref['count_proteins_reason'] = "negative_points_greater_than_or_equal_to_11"

    if nutriscore_data_ref['count_proteins']:
        nutriscore_data_ref['positive_nutrients'].insert(0, "proteins")

    for nutrient in nutriscore_data_ref['positive_nutrients']:
        points = nutriscore_data_ref.get(f"{nutrient}_points", 0)
        points_max = nutriscore_data_ref.get(f"{nutrient}_points_max", 0)
        nutriscore_data_ref['components']['positive'].append({
            'id': nutrient,
            'value': round(nutriscore_data_ref.get(nutrient, 0), 2),
            'points': points,
            'points_max': points_max,
        })
        nutriscore_data_ref['positive_points'] += points
        nutriscore_data_ref['positive_points_max'] = nutriscore_data_ref.get('positive_points_max', 0) + points_max

    # Add units for the retained positive and negative components
    add_units_to_positive_and_negative_nutriscore_components(nutriscore_data_ref)

    # Delete input nutrient values, keep only values inside the retained positive and negative components
    keys_to_delete = [
        'energy', 'energy_from_saturated_fat', 'sugars', 'fat', 'saturated_fat', 'saturated_fat_ratio',
        'salt', 'non_nutritive_sweeteners', 'fruits_vegetables_legumes', 'fiber', 'proteins'
    ]
    for key in keys_to_delete:
        if key in nutriscore_data_ref:
            del nutriscore_data_ref[key]
        if f"{key}_points" in nutriscore_data_ref:
            del nutriscore_data_ref[f"{key}_points"]
        if f"{key}_points_max" in nutriscore_data_ref:
            del nutriscore_data_ref[f"{key}_points_max"]

    score = nutriscore_data_ref.get('negative_points', 0) - nutriscore_data_ref.get('positive_points', 0)
    return score

def compute_nutriscore_grade_2023(nutrition_score, is_beverage, is_water, is_fat_oil_nuts_seeds):
    if nutrition_score is None:
        return ''

    if is_beverage:
        if is_water:
            return 'a'
        elif nutrition_score <= 2:
            return 'b'
        elif nutrition_score <= 6:
            return 'c'
        elif nutrition_score <= 9:
            return 'd'
        else:
            return 'e'

    if is_fat_oil_nuts_seeds:
        if nutrition_score <= -6:
            return 'a'
        elif nutrition_score <= 2:
            return 'b'
        elif nutrition_score <= 10:
            return 'c'
        elif nutrition_score <= 18:
            return 'd'
        else:
            return 'e'

    if nutrition_score <= 0:
        return 'a'
    elif nutrition_score <= 2:
        return 'b'
    elif nutrition_score <= 10:
        return 'c'
    elif nutrition_score <= 18:
        return 'd'
    else:
        return 'e'

def safe_float(value):
    try:
        return float(value)
    except ValueError:
        return 0.0

def process_csv_file(input_csv, output_csv):
    with open(input_csv, mode='r', encoding='utf-8') as infile, open(output_csv, mode='w', newline='', encoding='utf-8') as outfile:
        reader = csv.DictReader(infile)
        fieldnames = reader.fieldnames
        
        if fieldnames is None:
            raise ValueError("CSV file does not have a header row or the header row is empty.")

        # Add new columns for Nutri-Score score and grade
        fieldnames += ['nutriscore_score_final', 'nutriscore_grade_final']
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        
        writer.writeheader()
        
        for row in reader:
            if row.get('category') == 'Non-Food':
                row['nutriscore_score_final'] = 'N/A'
                row['nutriscore_grade_final'] = 'Nutri-Score is not applicable'
            else:
                nutriscore_data_ref = {
                    'energy': safe_float(row.get('energy_100g')),
                    'sugars': safe_float(row.get('sugars_100g')),
                    'saturated_fat': safe_float(row.get('saturated-fat_100g')),
                    'salt': safe_float(row.get('salt_100g')),
                    'fiber': safe_float(row.get('fiber_100g')),
                    'fruits_vegetables_legumes': safe_float(row.get('fruits-vegetables-nuts-estimate-from-ingredients_100g')),
                    'proteins': safe_float(row.get('proteins_100g')),
                    'is_beverage': row.get('category') == 'Beverages',
                    'is_water': row.get('category') == 'Water',
                    'is_fat_oil_nuts_seeds': row.get('category') == 'Fats/Nuts/Oil/Seeds',
                    'is_red_meat_product': row.get('category') == 'Red Meat',
                    'is_cheese': row.get('category') in ('Cheese', 'Dairy')
                }

                nutriscore_data_ref['components'] = {'positive': [], 'negative': []}
                
                nutriscore_score = compute_nutriscore_score_2023(nutriscore_data_ref)
                nutriscore_grade = compute_nutriscore_grade_2023(nutriscore_score,
                                                                nutriscore_data_ref['is_beverage'],
                                                                nutriscore_data_ref['is_water'],
                                                                nutriscore_data_ref['is_fat_oil_nuts_seeds'])
                
                row['nutriscore_score_final'] = round_to_max_decimal_places(nutriscore_score, 1)
                row['nutriscore_grade_final'] = nutriscore_grade
            
            writer.writerow(row)

# Example usage
process_csv_file('foodDataset.csv', 'LatestNutriScore.csv')