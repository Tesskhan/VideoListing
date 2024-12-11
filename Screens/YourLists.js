import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import FSection from '../Components/FSection';
import Icon from 'react-native-vector-icons/FontAwesome';

const YourLists = () => {
  const navigation = useNavigation();
  const [lists, setLists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [pressedItems, setPressedItems] = useState({});

  const handlePress = (id) => {
    if (id === 1) navigation.navigate("YourFavourites");
    else if (id === 2) navigation.navigate("YourLists");
    else if (id === 3) navigation.navigate("YourProfile");
  };

  const handleAddList = () => {
    if (newListName.trim() && newListDescription.trim()) {
      setLists([...lists, { title: newListName, description: newListDescription }]);
      setNewListName("");
      setNewListDescription("");
      setModalVisible(false);
    }
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
      <Text style={styles.title}>Your Lists</Text>

      <TouchableOpacity style={styles.filterButton}>
        <Icon name="filter" size={20} color="white" />
        <Text style={styles.filterText}>Filter</Text>
      </TouchableOpacity>

      <FlatList
        data={lists}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No lists yet. Create one!</Text>
          </View>
        }
      />

      {/* Add and Bin buttons */}
      <View style={styles.extraButtonsRow}>
        <TouchableOpacity style={styles.extraButton} onPress={() => console.log("Bin Pressed")}>
          <Icon name="trash" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraButton} onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Add List Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New list</Text>

            <TextInput
              style={styles.inputName}
              placeholder="Name the list"
              placeholderTextColor="#444"
              value={newListName}
              onChangeText={setNewListName}
            />
            <TextInput
              style={styles.inputDescription}
              placeholder="Describe"
              placeholderTextColor="#444"
              value={newListDescription}
              onChangeText={setNewListDescription}
              multiline
            />

            <View style={styles.modalButtons}>
              {/* Cancel Button */}
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Confirm Button */}
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddList}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.footerContainer}>
        <FSection currentSection={2} onPress={handlePress} />
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
  extraButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 90,
    left: 15,
    right: 15,
  },
  extraButton: {
    backgroundColor: '#777',
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  footerContainer: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 1 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#444',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { 
    fontSize: 20, 
    color: 'white',
    fontWeight: 'bold', 
    marginBottom: 15, 
  },
  inputName: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#888',
  },
  inputDescription: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#888',
    height: 90,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    width: '45%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#B00',  // Red color for Cancel button
  },
  confirmButton: {
    backgroundColor: '#3B0',  // Green color for Confirm button
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },  
});

export default YourLists;
