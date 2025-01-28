import React from "react";
import { View, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

const Searchpage = () => {
    return (
        <NativeViewGestureHandler>
            <SafeAreaView style = {styles.container}>
                <TextInput 
                    style = {styles.searchInput} 
                    placeholder = "Search for a product" 
                    />
            </SafeAreaView>
        </NativeViewGestureHandler>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    searchInput: {
        width: '100%',
        height: 40,
        borderBlockColor: '#333333',
        borderWidth: 1,
        paddingLeft: 10,
    },
})

export default Searchpage;