import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FButton from './FButton'; // Assuming this component takes care of rendering the icons
import Icon from 'react-native-vector-icons/FontAwesome'; // Correct import for FontAwesome icons

export default function FSection({ currentSection, onPress }) {
  return (
    <View style={styles.container}>
      {/* Section for buttons at the bottom */}
      <View style={styles.buttonRow}>
        {/* Heart button */}
        <View style={styles.buttonContainer}>
          <FButton 
            selectedIcon="heart"        // FontAwesome 'heart' (filled)
            unselectedIcon="heart-o"    // FontAwesome 'heart-o' (outline)
            id={1} 
            onPress={onPress} 
            isSelected={currentSection == 1} 
          />
        </View>

        {/* List button */}
        <View style={styles.buttonContainer}>
          <FButton 
            selectedIcon="align-justify"  // FontAwesome 'list' (filled)
            unselectedIcon="align-left"  // FontAwesome 'list-ul' (outline)
            id={2} 
            onPress={onPress} 
            isSelected={currentSection == 2} 
          />
        </View>

        {/* User button */}
        <View style={styles.buttonContainer}>
          <FButton 
            selectedIcon="user"        // FontAwesome 'user' (filled)
            unselectedIcon="user-o"    // FontAwesome 'user-o' (outline)
            id={3} 
            onPress={onPress} 
            isSelected={currentSection == 3} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take full available height
    justifyContent: 'flex-end', // Push content to the bottom
    width: '100%', // Ensure it takes full width
    position: 'absolute', // Position the container absolutely
    bottom: 0, // Align it to the bottom of the screen
    left: 0, // Align it to the left edge of the screen
    right: 0, // Align it to the right edge of the screen
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',  // Distribute the buttons evenly
    alignItems: 'center',
    width: '100%',
    height: 80,  // Set the height of the buttons row
    backgroundColor: '#777',  // Set background color for the button row
    borderTopLeftRadius: 25,  // Round the top-left corner
    borderTopRightRadius: 25, // Round the top-right corner
    paddingVertical: 10, // Add some vertical padding for spacing
  },
  buttonContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    flex: 1,  // Ensure buttons take enough space
  },  
});
