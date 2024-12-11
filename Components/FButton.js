import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

export default function FButton({ 
    selectedIcon,
    unselectedIcon,
    id,
    isSelected,
    onPress 
}) {

    return (
        <TouchableOpacity onPress={() => onPress(id)} style={styles.buttonContainer}>
            <View style={styles.iconContainer}>
                <Icon
                    name={isSelected ? selectedIcon : unselectedIcon} // Use the selected/unselected icons
                    size={40} // Smaller size for the icon
                    color="white"  // White color for the icons, change if needed
                    style={styles.icon}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center', // Centers the buttons horizontally
        justifyContent: 'center', // Centers the button vertically
    },
    iconContainer: {
        alignItems: 'center', // Centers the icon within the container
        justifyContent: 'center', // Ensure the icon is centered
        height: 50, // Adjusted height to fit smaller icons
        width: 50,  // Adjusted width to fit smaller icons
    },
    icon: {
        margin: 0,  // Set the margin to 0 to avoid cutting off
    },
});
