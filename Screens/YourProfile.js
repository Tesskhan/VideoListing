import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RedButton from '../Components/redButton'; // Assuming this is your custom button component
import SignOutModal from '../Components/SignOutModal'; // Assuming this is your custom modal component
import FSection from '../Components/FSection'; // Assuming this is your custom footer section

export default function YourProfile() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    // Handle the sign-out process
    const handleSignOut = () => {
        console.log("Sign out confirmed");
        navigation.navigate('LogInScreen'); // Navigate to login screen
    };

    // Handle footer navigation
    const handlePress = (id) => {
        console.log("Pressed button with id: " + id);
        if (id === 1) {
            navigation.navigate("YourFavourites"); // Navigate to Favourites screen
        } else if (id === 2) {
            navigation.navigate("YourLists"); // Navigate to Lists screen
        } else if (id === 3) {
            navigation.navigate("YourProfile"); // Navigate to User screen
        }
    };

    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>Your User</Text>

            {/* Sign Out Button */}
            <RedButton
                title="Log Out"
                onPress={() => setModalVisible(true)} // Open sign-out modal
            />

            {/* Sign-out modal */}
            <SignOutModal
                visible={modalVisible || false} // Default to false if null
                onClose={() => setModalVisible(false)}
                onConfirm={handleSignOut}
            />

            {/* Footer section */}
            <View style={styles.footerContainer}>
                <FSection
                    currentSection={3}  // Ensuring this value is always set
                    onPress={handlePress || (() => {})}  // Safeguard: default empty function if null
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#222", // Dark background color
        paddingHorizontal: 20,
        paddingTop: 30, // Added space on top
    },
    title: { 
        fontSize: 28, 
        fontWeight: "bold", 
        color: "#FFF", 
        textAlign: "center", 
        marginTop: 30, 
    },
    footerContainer: {
        position: 'absolute', // Fixes the footer to the bottom
        left: 0,
        right: 0,
        bottom: 0,  // Ensures it stays at the bottom of the screen
        zIndex: 1,  // Makes sure it's above other content
    },
});
