import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { WebView } from "react-native-webview";
import FSection from "../Components/FSection";
import { db, auth } from '../firebaseConfig'; // Import Firestore and Auth
import { collection, addDoc, getDocs, getDoc, updateDoc, setDoc, deleteDoc, doc } from 'firebase/firestore';

const ListVideos = () => {
  const { params: { list } } = useRoute();  // Ensure `list` exists in the route
  const listId = list.id; // Get list ID from route param
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [newVideoURL, setNewVideoURL] = useState("");
  const [currentVideoURL, setCurrentVideoURL] = useState("");
  const [isBinActive, setIsBinActive] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState({});
  const [isSelected, setIsSelected] = useState(false);
  const [seenVideos, setSeenVideos] = useState({});
  const [likedVideos, setLikedVideos] = useState({});
  const [updatedList, setUpdatedList] = useState({
    ...list,
    content: list.content || [],
  });

  useEffect(() => {
    const fetchVideos = async () => {
      const user = auth.currentUser;
      if (user && listId) {
        const videosQuery = collection(db, "users", user.uid, "lists", listId, "videos");
        const querySnapshot = await getDocs(videosQuery);
        const videos = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
        setUpdatedList((prev) => ({
          ...prev,
          content: videos,
        }));
  
        // Extract initial seen and liked states from Firestore
        const initialSeenState = videos.reduce((acc, video) => {
          acc[video.id] = video.seen || false; // Default to false if not present
          return acc;
        }, {});
  
        const initialLikedState = videos.reduce((acc, video) => {
          acc[video.id] = video.liked || false; // Default to false if not present
          return acc;
        }, {});
  
        setSeenVideos(initialSeenState);
        setLikedVideos(initialLikedState); // Initialize likedVideos state
      }
    };
  
    fetchVideos();
  }, [listId]);  
  
  const handlePress = (id) => {
    if (id === 1) navigation.navigate("YourFavourites");
    else if (id === 2) navigation.navigate("YourLists");
    else if (id === 3) navigation.navigate("YourProfile");
  };

  const handleSelectVideo = (videoId) => {
    setSelectedVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId], // Toggle selection
    }));
  };

  const handleAddList = async () => {
    if (!isValidVideoURL(newVideoURL)) {
      alert("Please provide a valid YouTube or Instagram video URL.");
      return;
    }
    const user = auth.currentUser;
    if (user) {
      const docRef = await addDoc(collection(db, "users", user.uid, "lists", listId, "videos"), {
        url: newVideoURL,
        title: newListName,
        description: newListDescription,
      });
  
      // Append to the list content immediately
      const newVideo = {
        id: docRef.id,
        url: newVideoURL,
        title: newListName,
        description: newListDescription,
      };
  
      setUpdatedList((prev) => ({
        ...prev,
        content: [...prev.content, newVideo],
      }));
  
      setNewListName("");
      setNewListDescription("");
      setModalVisible(false);
    }
  };  
  
  const handleDeleteSelected = async () => {
    if (isBinActive) {
      const videosToDelete = Object.keys(selectedVideos).filter((key) => selectedVideos[key]); // Gets selected videos
      const filteredContent = updatedList.content.filter(
        (video) => !selectedVideos[video.id] // Excludes selected videos from the list
      );
  
      const user = auth.currentUser;
      if (user) {
        for (const videoId of videosToDelete) {
          await deleteDoc(doc(db, "users", user.uid, "lists", listId, "videos", videoId)); // Deletes selected videos
        }
      }
  
      setUpdatedList((prevList) => ({ ...prevList, content: filteredContent })); // Updates local state
      setSelectedVideos({});
      setIsBinActive(false); // Exits "delete mode"
    } else {
      setIsBinActive(true); // Activates "delete mode"
    }
  };
  
  
  const handleCancelDelete = () => {
    // Cancel the deletion action and reset bin state
    setIsBinActive(false);
    setSelectedVideos({}); // Reset selected videos
  };

  const isValidVideoURL = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be") || url.includes("instagram.com/p");
  };

  const handleVideoPlay = (url) => {
    let embedURL = url;

    if (url.includes("youtube.com/watch")) {
      embedURL = `https://www.youtube.com/embed/${url.split("v=")[1].split("&")[0]}`;
    } else if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop();
      embedURL = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("instagram.com/p")) {
      const postId = url.split("/p/")[1].split("/")[0];
      embedURL = `https://www.instagram.com/p/${postId}/embed`;
    } else if (url.includes("instagram.com/reel")) {
      const reelId = url.split("/reel/")[1].split("/")[0];
      embedURL = `https://www.instagram.com/reel/${reelId}/embed`;
    }

    setCurrentVideoURL(embedURL);
  };

  const handleSeenToggle = async (videoId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const videoRef = doc(db, "users", user.uid, "lists", listId, "videos", videoId);
        const seen = !seenVideos[videoId]; // Toggle local seen state
  
        // Update the Firestore document
        await updateDoc(videoRef, { seen });
  
        // Update local state
        setSeenVideos((prev) => ({
          ...prev,
          [videoId]: seen,
        }));
      }
    } catch (error) {
      console.error("Error updating seen status: ", error);
      alert("Failed to update the seen status. Please try again.");
    }
  };  

  const handleLikeToggle = async (videoId) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const videoRef = doc(db, "users", user.uid, "lists", listId, "videos", videoId);
      const liked = !likedVideos[videoId]; // Toggle local liked state

      // Update the Firestore document
      await updateDoc(videoRef, { liked });

      // Update local state
      setLikedVideos((prev) => ({
        ...prev,
        [videoId]: liked,
      }));

      // Add or remove the video from the likedVideos collection
      const likedVideoRef = doc(db, "users", user.uid, "likedVideos", videoId);
      if (liked) {
        // Fetch the video data
        const videoSnapshot = await getDoc(videoRef);
        if (videoSnapshot.exists()) {
          const videoData = videoSnapshot.data();
          // Add to likedVideos collection with seen set to false
          await setDoc(likedVideoRef, { ...videoData, liked: true, seen: false });
          console.log("Video added to likedVideos collection:", videoData);
        } else {
          console.error("Video data not found for videoId:", videoId);
        }
      } else {
        // Remove from likedVideos collection
        await deleteDoc(likedVideoRef);
        console.log("Video removed from likedVideos collection:", videoId);
      }
    }
  } catch (error) {
    console.error("Error updating liked status: ", error);
    alert("Failed to update the like status. Please try again.");
  }
};


  const renderListItem = ({ item }) => {
    let embedURL = item.url;
  
    // Handle video URL embedding for YouTube and Instagram
    if (item.url.includes("youtube.com/watch")) {
      embedURL = `https://www.youtube.com/embed/${item.url.split("v=")[1].split("&")[0]}`;
    } else if (item.url.includes("youtu.be")) {
      const videoId = item.url.split("/").pop();
      embedURL = `https://www.youtube.com/embed/${videoId}`;
    } else if (item.url.includes("instagram.com/p")) {
      const postId = item.url.split("/p/")[1].split("/")[0];
      embedURL = `https://www.instagram.com/p/${postId}/embed`;
    } else if (item.url.includes("instagram.com/reel")) {
      const reelId = item.url.split("/reel/")[1].split("/")[0];
      embedURL = `https://www.instagram.com/reel/${reelId}/embed`;
    }
  
    const seen = seenVideos[item.id] || false;
    const liked = likedVideos[item.id] || false;
    const isSelected = selectedVideos[item.id] || false;
  
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
  
          <WebView
            source={{ uri: embedURL }}
            style={styles.youtubeVideoPlayer}
            allowsFullscreenVideo={true}
            originWhitelist={["*"]}
          />
  
          {/* Bottom buttons under the video */}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => handleSeenToggle(item.id)} style={styles.button}>
              <Icon
                name={seen ? "eye" : "eye-slash"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
  
            <TouchableOpacity onPress={() => handleLikeToggle(item.id)} style={styles.button}>
              <Icon
                name={liked ? "heart" : "heart-o"}
                size={20}
                color={liked ? "red" : "gray"}
              />
            </TouchableOpacity>
  
            {/* Show the bin icon for selection if the bin is active */}
            {isBinActive && (
              <TouchableOpacity onPress={() => handleSelectVideo(item.id)} style={styles.button}>
                <Icon
                  name={isSelected ? "check" : "times"}
                  size={20}
                  color={isSelected ? "green" : "red"}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{updatedList.title}</Text>
        <Text style={styles.description}>{updatedList.description}</Text>
      </View>
  
      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton} onPress={() => setIsSelected(!isSelected)}>
        <Icon
          name={isSelected ? "eye" : "eye-slash"}
          size={20}
          color="white"
        />
        <Text style={styles.filterText}>{isSelected ? "Seen" : "Not Seen"}</Text>
      </TouchableOpacity>
  
      {/* Video List */}
      <FlatList
        data={updatedList.content.filter((video) => {
          const isSeen = seenVideos[video.id] || false;
          return isSelected ? isSeen : !isSeen;
        })}
        keyExtractor={(item) => item.id}
        renderItem={renderListItem}
        ListEmptyComponent={<Text style={styles.noContentText}>No content available for this filter.</Text>}
        contentContainerStyle={{ paddingBottom: 125 }}
      />

      {/* Extra buttons */}
      <View style={styles.extraButtonsRow}>
        {/* Bin Button */}
        <TouchableOpacity 
          style={[styles.extraButton, isBinActive ? styles.binActiveButton : null]} 
          onPress={handleDeleteSelected}  // This now handles both activation and deletion
        >
          <Icon 
            name={isBinActive ? "check" : "trash"}  // 'check' for confirmation, 'trash' for initial state
            size={30} 
            color="white" 
          />
        </TouchableOpacity>

        {/* Add / Cross Button */}
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

      {/* Footer Section */}
      <View style={styles.footerContainer}>
        <FSection currentSection={4} onPress={handlePress} />
      </View>
  
      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Video</Text>
            <TextInput
              style={styles.inputURL}
              placeholder="Video URL (YouTube or Instagram)"
              placeholderTextColor="#444"
              value={newVideoURL}
              onChangeText={setNewVideoURL}
            />
            <TextInput
              style={styles.inputName}
              placeholder="Name the video"
              placeholderTextColor="#444"
              value={newListName}
              onChangeText={setNewListName}
            />
            <TextInput
              style={styles.inputDescription}
              placeholder="Describe the video"
              placeholderTextColor="#444"
              value={newListDescription}
              onChangeText={setNewListDescription}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleAddList}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container and Layout
  container: {
    flex: 1,
    backgroundColor: "#222",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#BBB",
    textAlign: "center",
    marginTop: 10,
  },

  // Video List
  card: {
    backgroundColor: "#CCC",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    minHeight: 500,
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
    color: "#000",
  },
  cardDescription: {
    fontSize: 14,
    color: "#444",
    marginTop: 5,
  },
  noContentText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
  },

  // Button Layouts
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: "#EEE",
    borderRadius: 8,
  },
  button: {
    marginHorizontal: 30,
  },

  // Filter Button
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#777',
    width: 110,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  filterText: {
    marginLeft: 8,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Modal Styles
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
  inputURL: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#888",
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
    padding: 15,
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

  // Extra Buttons (Bin, Add/Cross)
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
    backgroundColor: "#3B0", // Red background when bin is active
  },
  addActiveButton: {
    backgroundColor: "#B00", // Red background for add when bin is active
  },

  // Footer
  footerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  // Video Players
  youtubeVideoPlayer: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  instagramVideoPlayer: {
    width: "100%",
    height: 425,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default ListVideos; 
