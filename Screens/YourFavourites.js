import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import DeleteConfirmationModal from '../DeleteConfirmationModal';  // Importar el componente
import FSection from '../FSection';
import HSection from '../HSection';


const defaultImage = require('../../assets/images/default_image_square.jpg');

const YourFavourites = ({ onPress, navigation }) => {

  const [isEditMode, setIsEditMode] = useState(false);
  const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => i + 1));
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const handlePress = (id) => {
    console.log("Han clicat al botó " + id);
    if (id == 1){
      navigation.navigate("mapScreen");
    }else if (id == 2){
      navigation.navigate("FavouritesScreen");
    }else if (id == 3){
      navigation.navigate("userScreen");
    }
  };
  const handleHPress = () => {
    
  }

  const handleEditPress = () => {
    setIsEditMode(!isEditMode);
  };

  const handleDeletePress = (itemId) => {
    setSelectedItem(itemId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    setItems((prevItems) => prevItems.filter((item) => item !== selectedItem));
    setDeleteModalVisible(false); 
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false); 
    setSelectedItem(null);
  };

  return (
    <View style={{ flex: 1 , backgroundColor: '#1a1a1a',}}>

      <View style={{ flex: 1 }}>
        <HSection currentSection={2} onPress={handleHPress} />
      </View>


      <View style={{ flex: 8, width: '100%' }}>
        <View style={{ marginTop: 20, flex: 1 }}>
          <View style={styles.screenContainer}>
            <View style={styles.headerContainer}>
              <TextInput
                placeholder="Search..."
                placeholderTextColor="#aaa"
                style={styles.searchBar}
              />
              <TouchableOpacity style={styles.editIcon} onPress={handleEditPress}>
                <Feather name="edit" size={30} color="#fff" />
              </TouchableOpacity>
            </View>

            <DeleteConfirmationModal 
              visible={deleteModalVisible} 
              onConfirm={confirmDelete} 
              onCancel={cancelDelete} 
            />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
              {items.map((item) => (
                <View key={item} style={[styles.container, isEditMode && styles.containerEditMode]}>
                  <Image source={defaultImage} style={styles.image} />
                  <View style={styles.textContainer}>
                    <Text style={styles.title}>Title {item}</Text>
                    <Text style={styles.coordinates}>Description for item {item}</Text>
                    <Text style={styles.coordinates}>1 Day Ago</Text>
                  </View>
                  {isEditMode && (
                    <TouchableOpacity style={styles.trashButton} onPress={() => handleDeletePress(item)}>
                      <Icon name="trash" size={24} color="#000" />
                    </TouchableOpacity>
                  )}
                  {!isEditMode && (
                    <TouchableOpacity style={styles.button} onPress={onPress}>
                      <Icon name="chevron-forward" size={24} color="#000" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>


      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 0 }}>
        <FSection currentSection={2} onPress={handlePress} />
      </View>
    </View>

);

};  

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    width: '100%', // Asegura que ocupe todo el ancho disponible
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 10, // Agregado para asegurar márgenes
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  editIcon: {
    marginLeft: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#333',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    position: 'relative',
  },
  containerEditMode: {
    borderColor: '#8B0000',
  },
  image: {
    width: '30%',
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  coordinates: {
    fontSize: 14,
    color: '#777',
  },
  button: {
    position: 'absolute',
    top: 50,
    right: 10,
  },
  trashButton: {
    position: 'absolute',
    top: 47,
    right: 10,
  },
});


export default YourFavourites;
