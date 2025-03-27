// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   SafeAreaView,
//   StyleSheet,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // Import MaterialIcons

// export default function ProfileScreen(): React.JSX.Element {
//   // Static user data (can be made dynamic later)
//   const [user, setUser] = useState({
//     age: "21",
//     weight: "70",
//     height: "177", // Height in cm
//     heightUnit: "cm", // 'cm' or 'ft'
//     feet: "5", // Feet part of height
//     inches: "10", // Inches part of height
//     gender: "Male",
//     activityLevel: "Moderate",
//   });

//   // State for TDEE and macronutrients
//   const [tdee, setTDEE] = useState(0);
//   const [carbs, setCarbs] = useState(0);
//   const [protein, setProtein] = useState(0);
//   const [fats, setFats] = useState(0);

//   // State to toggle edit mode
//   const [isEditable, setIsEditable] = useState(false);

  // Function to validate inputs
  // const validateInputs = () => {
  //   const age = parseFloat(user.age);
  //   const weight = parseFloat(user.weight);
  //   const height = parseFloat(user.height);
  //   const feet = parseFloat(user.feet);
  //   const inches = parseFloat(user.inches);

  //   if (isNaN(age) || age <= 0) {
  //     Alert.alert("Invalid Age", "Please enter a valid age (positive number).");
  //     return false;
  //   }

  //   if (isNaN(weight) || weight <= 0) {
  //     Alert.alert("Invalid Weight", "Please enter a valid weight (positive number).");
  //     return false;
  //   }

  //   if (user.heightUnit === "cm" && (isNaN(height) || height <= 0)) {
  //     Alert.alert("Invalid Height", "Please enter a valid height in centimeters (positive number).");
  //     return false;
  //   }

  //   if (user.heightUnit === "ft") {
  //     if (isNaN(feet) || feet <= 0) {
  //       Alert.alert("Invalid Feet", "Please enter a valid feet value (positive number).");
  //       return false;
  //     }
  //     if (isNaN(inches) || inches < 0 || inches >= 12) {
  //       Alert.alert("Invalid Inches", "Please enter a valid inches value (0 to 12).");
  //       return false;
  //     }
  //   }

  //   return true;
  // };

//   // Function to calculate TDEE and macronutrients
//   const calculateTDEE = () => {
//     if (!validateInputs()) return;

//     const weight = parseFloat(user.weight);
//     const age = parseFloat(user.age);

//     // Convert height to cm
//     let heightInCm = parseFloat(user.height);
//     if (user.heightUnit === "ft") {
//       const feet = parseFloat(user.feet);
//       const inches = parseFloat(user.inches);
//       heightInCm = feet * 30.48 + inches * 2.54;
//     }

//     // BMR calculation (Mifflin-St Jeor Equation)
//     let bmr = 10 * weight + 6.25 * heightInCm - 5 * age + 5;

//     // Adjust for activity level
//     const activityMultipliers: Record<string,number> = {
//       Sedentary: 1.2,
//       Light: 1.375,
//       Moderate: 1.55,
//       Active: 1.725,
//       VeryActive: 1.9,
//     };
//     const tdeeValue = bmr * activityMultipliers[user.activityLevel];
//     setTDEE(tdeeValue);

//     // Macronutrient calculation (20% fat, 20% protein, 60% carbs)
//     setFats((tdeeValue * 0.2) / 9);
//     setProtein((tdeeValue * 0.2) / 4);
//     setCarbs((tdeeValue * 0.6) / 4);
//   };

//   // Automatically calculate TDEE and macronutrients when user data changes
//   useEffect(() => {
//     calculateTDEE();
//   }, [user]);

//   // Function to handle height unit switch
  // const toggleHeightUnit = () => {
  //   const newUnit = user.heightUnit === "cm" ? "ft" : "cm";

  //   if (newUnit === "ft") {
  //     // Convert cm to feet and inches
  //     const heightInCm = parseFloat(user.height);
  //     if (isNaN(heightInCm) || heightInCm <= 0) {
  //       Alert.alert("Invalid Height", "Please enter a valid height in centimeters (positive number).");
  //       return;
  //     }
  //     const feet = Math.floor(heightInCm / 30.48);
  //     const inches = ((heightInCm % 30.48) / 2.54).toFixed(2);
  //     setUser({
  //       ...user,
  //       heightUnit: newUnit,
  //       feet: feet.toString(),
  //       inches: inches.toString(),
  //     });
  //   } else {
  //     // Convert feet and inches to cm
  //     const feet = parseFloat(user.feet);
  //     const inches = parseFloat(user.inches);
  //     if (isNaN(feet) || feet <= 0 || isNaN(inches) || inches < 0 || inches >= 12) {
  //       Alert.alert("Invalid Height", "Please enter valid feet and inches.");
  //       return;
  //     }
  //     const heightInCm = feet * 30.48 + inches * 2.54;
  //     setUser({
  //       ...user,
  //       heightUnit: newUnit,
  //       height: heightInCm.toFixed(2),
  //     });
  //   }
  // };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Edit Button */}
//         <View style={styles.editContainer}>
//           <TouchableOpacity
//             onPress={() => setIsEditable(!isEditable)}
//             style={[styles.editButton, isEditable && styles.editButtonActive]}
//           >
//             <MaterialIcons
//               name="edit"
//               size={20}
//               color={isEditable ? "#FFF" : "#6200EE"}
//             />
//             <Text style={[styles.editText, isEditable && styles.editTextActive]}>
//               {isEditable ? "Editing" : "Edit"}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Editing Mode Message */}
//         {isEditable && (
//           <Text style={styles.editingMessage}>Editing Mode is ON</Text>
//         )}

//         <Text style={styles.title}>Profile & Nutrition</Text>

//         {/* User Details Section */}
        // <View style={styles.section}>
        //   <Text style={styles.sectionTitle}>Your Details</Text>
        //   <View style={styles.inputRow}>
        //     <Text style={styles.label}>Age</Text>
        //     <TextInput
        //       style={[styles.input, !isEditable && styles.inputDisabled]}
        //       value={user.age}
        //       onChangeText={(text) => setUser({ ...user, age: text })}
        //       keyboardType="numeric"
        //       editable={isEditable}
        //     />
        //   </View>
        //   <View style={styles.inputRow}>
        //     <Text style={styles.label}>Weight (kg)</Text>
        //     <TextInput
        //       style={[styles.input, !isEditable && styles.inputDisabled]}
        //       value={user.weight}
        //       onChangeText={(text) => setUser({ ...user, weight: text })}
        //       keyboardType="numeric"
        //       editable={isEditable}
        //     />
        //   </View>
        //   <View style={styles.inputRow}>
        //     <Text style={styles.label}>Height</Text>
        //     {user.heightUnit === "cm" ? (
        //       <TextInput
        //         style={[styles.input, !isEditable && styles.inputDisabled]}
        //         value={user.height}
        //         onChangeText={(text) => setUser({ ...user, height: text })}
        //         keyboardType="numeric"
        //         editable={isEditable}
        //       />
        //     ) : (
        //       <View style={styles.heightInputContainer}>
        //         <TextInput
        //           style={[styles.input, styles.heightInput, !isEditable && styles.inputDisabled]}
        //           value={user.feet}
        //           onChangeText={(text) => setUser({ ...user, feet: text })}
        //           keyboardType="numeric"
        //           placeholder="Feet"
        //           editable={isEditable}
        //         />
        //         <TextInput
        //           style={[styles.input, styles.heightInput, !isEditable && styles.inputDisabled]}
        //           value={user.inches}
        //           onChangeText={(text) => setUser({ ...user, inches: text })}
        //           keyboardType="numeric"
        //           placeholder="Inches"
        //           editable={isEditable}
        //         />
        //       </View>
        //     )}
        //     <TouchableOpacity onPress={toggleHeightUnit} style={styles.unitButton}>
        //       <Text style={styles.unitText}>{user.heightUnit}</Text>
        //     </TouchableOpacity>
        //   </View>
        //   <View style={styles.inputRow}>
        //     <Text style={styles.label}>Gender</Text>
        //     <View style={[styles.chip, { backgroundColor: user.gender === "Male" ? "#6200EE" : "#FF6F61" }]}>
        //       <Picker
        //         selectedValue={user.gender}
        //         onValueChange={(itemValue) => setUser({ ...user, gender: itemValue })}
        //         style={styles.picker}
        //         dropdownIconColor="#FFF"
        //         enabled={isEditable}
        //       >
        //         <Picker.Item label="Male" value="Male" />
        //         <Picker.Item label="Female" value="Female" />
        //       </Picker>
        //     </View>
        //   </View>
        //   <View style={styles.inputRow}>
        //     <Text style={styles.label}>Activity Level</Text>
        //     <View
        //       style={[
        //         styles.chip,
        //         {
        //           backgroundColor:
        //             user.activityLevel === "Sedentary"
        //               ? "#A9A9A9"
        //               : user.activityLevel === "Light"
        //               ? "#FFD700"
        //               : user.activityLevel === "Moderate"
        //               ? "#32CD32"
        //               : user.activityLevel === "Active"
        //               ? "#1E90FF"
        //               : "#FF4500",
        //         },
        //       ]}
        //     >
        //       <Picker
        //         selectedValue={user.activityLevel}
        //         onValueChange={(itemValue) => setUser({ ...user, activityLevel: itemValue })}
        //         style={styles.picker}
        //         dropdownIconColor="#FFF"
        //         enabled={isEditable}
        //       >
        //         <Picker.Item label="Sedentary" value="Sedentary" />
        //         <Picker.Item label="Light" value="Light" />
        //         <Picker.Item label="Moderate" value="Moderate" />
        //         <Picker.Item label="Active" value="Active" />
        //         <Picker.Item label="Very Active" value="VeryActive" />
        //       </Picker>
        //     </View>
        //   </View>
        // </View>

//         {/* Results Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Your Nutrition</Text>
//           <View style={styles.resultRow}>
//             <Text style={styles.resultLabel}>TDEE</Text>
//             <Text style={styles.resultValue}>{tdee.toFixed(2)} kcal</Text>
//           </View>
//           <View style={styles.resultRow}>
//             <Text style={styles.resultLabel}>Carbs</Text>
//             <Text style={styles.resultValue}>{carbs.toFixed(2)} g</Text>
//           </View>
//           <View style={styles.resultRow}>
//             <Text style={styles.resultLabel}>Protein</Text>
//             <Text style={styles.resultValue}>{protein.toFixed(2)} g</Text>
//           </View>
//           <View style={styles.resultRow}>
//             <Text style={styles.resultLabel}>Fats</Text>
//             <Text style={styles.resultValue}>{fats.toFixed(2)} g</Text>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//   },
//   scrollContainer: {
//     padding: 20,
//   },
//   editContainer: {
//     alignItems: "flex-end",
//     marginBottom: 10,
//   },
//   editButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderRadius: 5,
//     backgroundColor: "#FFF",
//     borderWidth: 1,
//     borderColor: "#6200EE",
//   },
//   editButtonActive: {
//     backgroundColor: "#6200EE",
//   },
//   editText: {
//     marginLeft: 5,
//     color: "#6200EE",
//     fontSize: 16,
//   },
//   editTextActive: {
//     color: "#FFF",
//   },
//   editingMessage: {
//     textAlign: "center",
//     color: "#6200EE",
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   section: {
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#555",
//     marginBottom: 15,
//   },
//   inputRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   label: {
//     flex: 1,
//     fontSize: 16,
//     color: "#777",
//   },
//   input: {
//     flex: 2,
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 5,
//     padding: 10,
//     fontSize: 16,
//   },
//   inputDisabled: {
//     backgroundColor: "#F5F5F5",
//     borderColor: "#DDD",
//     color: "#999",
//   },
//   heightInputContainer: {
//     flex: 2,
//     flexDirection: "row",
//     gap: 10,
//   },
//   heightInput: {
//     flex: 1,
//   },
//   unitButton: {
//     padding: 10,
//     backgroundColor: "#6200EE",
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   unitText: {
//     color: "#FFF",
//     fontSize: 16,
//   },
//   chip: {
//     flex: 2,
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 5,
//     padding: 5,
//   },
//   picker: {
//     flex: 1,
//     color: "#FFF",
//   },
//   resultRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   resultLabel: {
//     fontSize: 16,
//     color: "#777",
//   },
//   resultValue: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
// });

















import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function ProfileScreen(): React.JSX.Element {
  const [user, setUser] = useState({
    age: "21",
    weight: "70",
    height: "177",
    heightUnit: "cm",
    feet: "5",
    inches: "10",
    gender: "Male",
    activityLevel: "Moderate",
  });

  const [tdee, setTDEE] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fats, setFats] = useState(0);
  const [isEditable, setIsEditable] = useState(false);

  // Nutrition thresholds based on ICMR and FSSAI guidelines
    const nutritionThresholds = {
      carbs: { percentage: 60, unit: 'g' },
      protein: { percentage: 20, unit: 'g' },
      fats: { percentage: 20, unit: 'g' },
      saturatedFat: { max: 22, unit: 'g' }, // ICMR recommendation
      sugar: { max: 25, unit: 'g' }, // ICMR recommendation
      fiber: { min: 25, unit: 'g' }, // ICMR recommendation
    };


  const validateInputs = () => {
    const age = parseFloat(user.age);
    const weight = parseFloat(user.weight);
    const height = parseFloat(user.height);
    const feet = parseFloat(user.feet);
    const inches = parseFloat(user.inches);

    if (isNaN(age) || age <= 0) {
      Alert.alert("Invalid Age", "Please enter a valid age (positive number).");
      return false;
    }

    if (isNaN(weight) || weight <= 0) {
      Alert.alert("Invalid Weight", "Please enter a valid weight (positive number).");
      return false;
    }

    if (user.heightUnit === "cm" && (isNaN(height) || height <= 0)) {
      Alert.alert("Invalid Height", "Please enter a valid height in centimeters (positive number).");
      return false;
    }

    if (user.heightUnit === "ft") {
      if (isNaN(feet) || feet <= 0) {
        Alert.alert("Invalid Feet", "Please enter a valid feet value (positive number).");
        return false;
      }
      if (isNaN(inches) || inches < 0 || inches >= 12) {
        Alert.alert("Invalid Inches", "Please enter a valid inches value (0 to 12).");
        return false;
      }
    }

    return true;
  };

  const calculateTDEE = () => {
    if (!validateInputs()) return;

    const weight = parseFloat(user.weight);
    const age = parseFloat(user.age);

    // Convert height to cm
    let heightInCm = parseFloat(user.height);
    if (user.heightUnit === "ft") {
      const feet = parseFloat(user.feet);
      const inches = parseFloat(user.inches);
      heightInCm = feet * 30.48 + inches * 2.54;
    }

    // BMR calculation (Mifflin-St Jeor Equation)
    let bmr = 10 * weight + 6.25 * heightInCm - 5 * age;
    bmr += user.gender === "Male" ? 5 : -161;

    const activityMultipliers = {
      Sedentary: 1.2,
      Light: 1.375,
      Moderate: 1.55,
      Active: 1.725,
      VeryActive: 1.9,
    };
    
    const tdeeValue = bmr * activityMultipliers[user.activityLevel];
    setTDEE(tdeeValue);

    // Calculate macronutrients based on fixed percentages of TDEE
    // Carbs: 60%, Protein: 20%, Fats: 20%
    const carbCalories = tdeeValue * (nutritionThresholds.carbs.percentage / 100);
    const proteinCalories = tdeeValue * (nutritionThresholds.protein.percentage / 100);
    const fatCalories = tdeeValue * (nutritionThresholds.fats.percentage / 100);

    // Convert calories to grams
    // Carbs and protein: 4 calories per gram
    // Fat: 9 calories per gram
    setCarbs(carbCalories / 4);
    setProtein(proteinCalories / 4);
    setFats(fatCalories / 9);
  };

  useEffect(() => {
    calculateTDEE();
  }, [user]);

  const toggleHeightUnit = () => {
    const newUnit = user.heightUnit === "cm" ? "ft" : "cm";

    if (newUnit === "ft") {
      // Convert cm to feet and inches
      const heightInCm = parseFloat(user.height);
      if (isNaN(heightInCm) || heightInCm <= 0) {
        Alert.alert("Invalid Height", "Please enter a valid height in centimeters (positive number).");
        return;
      }
      const feet = Math.floor(heightInCm / 30.48);
      const inches = ((heightInCm % 30.48) / 2.54).toFixed(2);
      setUser({
        ...user,
        heightUnit: newUnit,
        feet: feet.toString(),
        inches: inches.toString(),
      });
    } else {
      // Convert feet and inches to cm
      const feet = parseFloat(user.feet);
      const inches = parseFloat(user.inches);
      if (isNaN(feet) || feet <= 0 || isNaN(inches) || inches < 0 || inches >= 12) {
        Alert.alert("Invalid Height", "Please enter valid feet and inches.");
        return;
      }
      const heightInCm = feet * 30.48 + inches * 2.54;
      setUser({
        ...user,
        heightUnit: newUnit,
        height: heightInCm.toFixed(2),
      });
    }
  };

  // Function to pass daily values to ProductScreen
  const getDailyNutritionValues = () => ({
    carbs: carbs,
    protein: protein,
    fats: fats,
    maxSaturatedFat: nutritionThresholds.saturatedFat.max,
    maxSugar: nutritionThresholds.sugar.max,
    minFiber: nutritionThresholds.fiber.min
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Edit Button and Header */}
        <View style={styles.editContainer}>
          <TouchableOpacity
            onPress={() => setIsEditable(!isEditable)}
            style={[styles.editButton, isEditable && styles.editButtonActive]}
          >
            <MaterialIcons
              name="edit"
              size={20}
              color={isEditable ? "#FFF" : "#6200EE"}
            />
            <Text style={[styles.editText, isEditable && styles.editTextActive]}>
              {isEditable ? "Editing" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {isEditable && (
          <Text style={styles.editingMessage}>Editing Mode is ON</Text>
        )}

        <Text style={styles.title}>Profile & Nutrition</Text>

        {/* User Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Details</Text>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.inputDisabled]}
              value={user.age}
              onChangeText={(text) => setUser({ ...user, age: text })}
              keyboardType="numeric"
              editable={isEditable}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={[styles.input, !isEditable && styles.inputDisabled]}
              value={user.weight}
              onChangeText={(text) => setUser({ ...user, weight: text })}
              keyboardType="numeric"
              editable={isEditable}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Height</Text>
            {user.heightUnit === "cm" ? (
              <TextInput
                style={[styles.input, !isEditable && styles.inputDisabled]}
                value={user.height}
                onChangeText={(text) => setUser({ ...user, height: text })}
                keyboardType="numeric"
                editable={isEditable}
              />
            ) : (
              <View style={styles.heightInputContainer}>
                <TextInput
                  style={[styles.input, styles.heightInput, !isEditable && styles.inputDisabled]}
                  value={user.feet}
                  onChangeText={(text) => setUser({ ...user, feet: text })}
                  keyboardType="numeric"
                  placeholder="Feet"
                  editable={isEditable}
                />
                <TextInput
                  style={[styles.input, styles.heightInput, !isEditable && styles.inputDisabled]}
                  value={user.inches}
                  onChangeText={(text) => setUser({ ...user, inches: text })}
                  keyboardType="numeric"
                  placeholder="Inches"
                  editable={isEditable}
                />
              </View>
            )}
            <TouchableOpacity onPress={toggleHeightUnit} style={styles.unitButton}>
              <Text style={styles.unitText}>{user.heightUnit}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Gender</Text>
            <View style={[styles.chip, { backgroundColor: user.gender === "Male" ? "#6200EE" : "#FF6F61" }]}>
              <Picker
                selectedValue={user.gender}
                onValueChange={(itemValue) => setUser({ ...user, gender: itemValue })}
                style={styles.picker}
                dropdownIconColor="#FFF"
                enabled={isEditable}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
              </Picker>
            </View>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Activity Level</Text>
            <View
              style={[
                styles.chip,
                {
                  backgroundColor:
                    user.activityLevel === "Sedentary"
                      ? "#A9A9A9"
                      : user.activityLevel === "Light"
                      ? "#FFD700"
                      : user.activityLevel === "Moderate"
                      ? "#32CD32"
                      : user.activityLevel === "Active"
                      ? "#1E90FF"
                      : "#FF4500",
                },
              ]}
            >
              <Picker
                selectedValue={user.activityLevel}
                onValueChange={(itemValue) => setUser({ ...user, activityLevel: itemValue })}
                style={styles.picker}
                dropdownIconColor="#FFF"
                enabled={isEditable}
              >
                <Picker.Item label="Sedentary" value="Sedentary" />
                <Picker.Item label="Light" value="Light" />
                <Picker.Item label="Moderate" value="Moderate" />
                <Picker.Item label="Active" value="Active" />
                <Picker.Item label="Very Active" value="VeryActive" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Enhanced Nutrition Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Nutrition Targets</Text>
          
          <View style={styles.nutritionGrid}>
            {/* Energy */}
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionCardTitle}>Energy</Text>
              <Text style={styles.nutritionCardValue}>{tdee.toFixed(0)} kcal</Text>
              <Text style={styles.nutritionCardSubtitle}>Based on your activity</Text>
            </View>

            {/* Carbs */}
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionCardTitle}>Carbs</Text>
              <Text style={styles.nutritionCardValue}>{carbs.toFixed(0)} g</Text>
              <Text style={styles.nutritionCardSubtitle}>{nutritionThresholds.carbs.percentage}% of calories</Text>
            </View>

            {/* Protein */}
            <View style={[styles.nutritionCard, styles.goodNutrient]}>
              <Text style={styles.nutritionCardTitle}>Protein</Text>
              <Text style={styles.nutritionCardValue}>{protein.toFixed(0)} g</Text>
              <Text style={styles.nutritionCardSubtitle}>{nutritionThresholds.protein.percentage}% of calories</Text>
            </View>

            {/* Fats */}
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionCardTitle}>Fats</Text>
              <Text style={styles.nutritionCardValue}>{fats.toFixed(0)} g</Text>
              <Text style={styles.nutritionCardSubtitle}>{nutritionThresholds.fats.percentage}% of calories</Text>
            </View>

            {/* Fiber */}
            <View style={[styles.nutritionCard, styles.goodNutrient]}>
              <Text style={styles.nutritionCardTitle}>Fiber</Text>
              <Text style={styles.nutritionCardValue}>{nutritionThresholds.fiber.min}+ g</Text>
              <Text style={styles.nutritionCardSubtitle}>Minimum daily</Text>
            </View>

            {/* Sugar Warning */}
            <View style={[styles.nutritionCard, styles.badNutrient]}>
              <Text style={styles.nutritionCardTitle}>Added Sugar</Text>
              <Text style={styles.nutritionCardValue}>{nutritionThresholds.sugar.max} g max</Text>
              <Text style={styles.nutritionCardSubtitle}>Limit intake</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    padding: 20,
  },
  editContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#6200EE",
  },
  editButtonActive: {
    backgroundColor: "#6200EE",
  },
  editText: {
    marginLeft: 5,
    color: "#6200EE",
    fontSize: 16,
  },
  editTextActive: {
    color: "#FFF",
  },
  editingMessage: {
    textAlign: "center",
    color: "#6200EE",
    fontSize: 16,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 15,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  goodNutrient: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  badNutrient: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  nutritionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  nutritionCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 4,
  },
  nutritionCardSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: "#777",
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#DDD",
    color: "#999",
  },
  heightInputContainer: {
    flex: 2,
    flexDirection: "row",
    gap: 10,
  },
  heightInput: {
    flex: 1,
  },
  unitButton: {
    padding: 10,
    backgroundColor: "#6200EE",
    borderRadius: 5,
    marginLeft: 10,
  },
  unitText: {
    color: "#FFF",
    fontSize: 16,
  },
  chip: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    padding: 5,
  },
  picker: {
    flex: 1,
    color: "#FFF",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: "#777",
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },

});