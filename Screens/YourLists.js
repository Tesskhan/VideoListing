import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import FSection from '../Components/FSection';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, auth } from '../firebaseConfig'; // Import Firestore and Auth
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const YourLists = () => {
  const navigation = useNavigation();
  const [lists, setLists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [isBinActive, setIsBinActive] = useState(false);
  const [selectedLists, setSelectedLists] = useState({});

  useEffect(() => {
    // Fetch lists from Firestore when the component mounts
    const fetchLists = async () => {
      const user = auth.currentUser;
      if (user) {
        const querySnapshot = await getDocs(collection(db, "users", user.uid, "lists"));
        const fetchedLists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLists(fetchedLists);
      }
    };

    fetchLists();
  }, []);

  const handlePress = (id) => {
    if (id === 1) navigation.navigate("YourFavourites");
    else if (id === 2) navigation.navigate("YourLists");
    else if (id === 3) navigation.navigate("YourProfile");
  };

  const handleAddList = async () => {
    if (newListName.trim() && newListDescription.trim()) {
      const user = auth.currentUser;
      if (user) {
        const docRef = await addDoc(collection(db, "users", user.uid, "lists"), {
          title: newListName,
          description: newListDescription,
        });
        setLists([...lists, { id: docRef.id, title: newListName, description: newListDescription }]);
        setNewListName("");
        setNewListDescription("");
        setModalVisible(false);
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (isBinActive) {
      const user = auth.currentUser;
      if (user) {
        const filteredLists = lists.filter((list, index) => {
          if (selectedLists[index]) {
            deleteDoc(doc(db, "users", user.uid, "lists", list.id));
            return false;
          }
          return true;
        });
        setLists(filteredLists);
        setSelectedLists({});
        setIsBinActive(false);
      }
    } else {
      setIsBinActive(true);
    }
  };

  const handleCancelDelete = () => {
    setIsBinActive(false);
    setSelectedLists({});
  };

  const toggleSelection = (index) => {
    setSelectedLists((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderListItem = ({ item, index }) => {
    const isSelected = !!selectedLists[index];

    return (
      <TouchableOpacity
        style={[
          styles.card,
        ]}
        onPress={() => {
          if (isBinActive) {
            toggleSelection(index);
          } else {
            navigation.navigate('ListVideos', { list: item });
          }
        }}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
        {isBinActive && (
          <Icon
            name={isSelected ? "check" : "times"}
            size={20}
            color={isSelected ? "green" : "red"}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Lists</Text>

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

      <View style={styles.extraButtonsRow}>
        <TouchableOpacity
          style={[styles.extraButton, isBinActive ? styles.binActiveButton : null]}
          onPress={handleDeleteSelected}
        >
          <Icon
            name={isBinActive ? "check" : "trash"}
            size={30}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.extraButton, isBinActive ? styles.addActiveButton : null]}
          onPress={() => {
            if (isBinActive) {
              setIsBinActive(false);
            } else {
              setModalVisible(true);
            }
          }}
        >
          <Icon
            name={isBinActive ? "times" : "plus"}
            size={30}
            color="white"
          />
        </TouchableOpacity>
      </View>

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
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>

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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
  card: {
    backgroundColor: "#CCC",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    minHeight: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
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
    lineHeight: 18,
  },
  arrowSymbol: {
    fontSize: 20,
    color: "#444",
    padding: 10,
  },
  extraButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 90,
    left: 15,
    right: 15,
  },
  extraButton: {
    backgroundColor: "#777",
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  binActiveButton: {
    backgroundColor: "#3B0",
  },
  addActiveButton: {
    backgroundColor: "#B00",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#444",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputName: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#888",
  },
  inputDescription: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#888",
    height: 90,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    width: "45%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#B00",
  },
  confirmButton: {
    backgroundColor: "#3B0",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Footer styles
  footerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});


export default YourLists;
