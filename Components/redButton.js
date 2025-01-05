import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const RedButton = ({ title, onPress }) => {
    return (
        <View style={styles.centeredContainer}>  {/* Container to center the button */}
            <TouchableOpacity onPress={onPress} style={styles.button}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,  // Take up full screen spaces
        marginTop: 50,
        alignItems: 'center',  // Center horizontally
        padding: 20,  // Add some padding
    },
    button: {
        backgroundColor: 'red', // Red background
        paddingVertical: 15, // Increased vertical padding for a bigger button
        paddingHorizontal: 30, // Increased horizontal padding for a bigger button
        borderRadius: 10, // Slightly more rounded corners
        alignItems: 'center', // Center text inside the button
        shadowColor: '#000', 
    },
    shadowOffset: {
        width: 0, // No horizontal shadow offset
        height: 5, // Increased vertical shadow offset
        shadowOpacity: 0.25,
        shadowRadius: 5, // Bigger shadow radius
        elevation: 10, // Increased elevation for Android
    },
    buttonText: {
        color: 'white', // White text
        fontSize: 20, // Larger font size for a bigger button
        fontWeight: 'bold', // Bold text
    },
});

export default RedButton;
