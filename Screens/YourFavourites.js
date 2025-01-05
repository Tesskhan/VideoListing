import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import FSection from '../Components/FSection'; // Assuming this is your custom footer section
import Icon from 'react-native-vector-icons/FontAwesome';

const YourFavourites = () => {
  const navigation = useNavigation();
  const [lists, setLists] = useState([]); // Placeholder for list data
  const [pressedItems, setPressedItems] = useState({});

  const handlePress = (id) => {
    if (id === 1) navigation.navigate("YourFavourites");
    else if (id === 2) navigation.navigate("YourLists");
    else if (id === 3) navigation.navigate("YourProfile");
  };

  const handlePressIn = (index) => {
    setPressedItems((prevState) => ({ ...prevState, [index]: true }));
  };

  const handlePressOut = (index) => {
    setPressedItems((prevState) => ({ ...prevState, [index]: false }));
  };

  const renderListItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[styles.card, pressedItems[index] && { backgroundColor: '#DDD' }]} // Adjust background color when pressed
        onPressIn={() => handlePressIn(index)}
        onPressOut={() => handlePressOut(index)}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
        <Icon name="chevron-right" style={styles.arrowSymbol} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Your Favourites</Text>

      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton}>
        <Icon name="filter" size={20} color="white" />
        <Text style={styles.filterText}>Filter</Text>
      </TouchableOpacity>

      {/* Lists */}
      <FlatList
        data={lists}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favourite videos yet.</Text>
          </View>
        }
      />

      {/* Footer section */}
      <View style={styles.footerContainer}>
        <FSection currentSection={1} onPress={handlePress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#222", 
    paddingHorizontal: 20, 
    paddingTop: 30, 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#FFF", 
    textAlign: "center", 
    margin: 30, 
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#777',
    width: 110,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  filterText: { 
    marginLeft: 8, 
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  card: {
    backgroundColor: "#EEE",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    minHeight: 100, // Ensure the card is high enough for two lines of description
    flexDirection: "row", // Align text and arrow side by side
    justifyContent: "space-between", // Place the arrow on the right
    alignItems: "center", // Align the content vertically
  },
  cardContent: {
    flex: 1, // Make sure the text takes up the available space
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    lineHeight: 18, // Ensure two lines of description fit comfortably
  },
  arrowSymbol: {
    fontSize: 20,
    color: "#444", // Set the color of the arrow
    padding: 10, // Add space between text and the arrow
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    marginTop: 50, 
  },
  emptyText: { 
    fontSize: 16, 
    color: "#999", 
  },
  footerContainer: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 0, 
    zIndex: 1 
  },
});

export default YourFavourites;
