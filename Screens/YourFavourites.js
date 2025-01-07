import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { WebView } from "react-native-webview";
import FSection from "../Components/FSection";
import { db, auth } from '../firebaseConfig'; 
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const YourFavourites = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Set fallback in case list is undefined
  const list = route.params?.list || { id: null, content: [], title: "", description: "" };
  const listId = list.id;

  const [isSelected, setIsSelected] = useState(false);
  const [seenVideos, setSeenVideos] = useState({});
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
        const videos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setUpdatedList((prev) => ({
          ...prev,
          content: videos,
        }));

        const initialSeenState = videos.reduce((acc, video) => {
          acc[video.id] = video.seen || false;
          return acc;
        }, {});
        setSeenVideos(initialSeenState);
      }
    };

    fetchVideos();
  }, [listId]);

  const handlePress = (id) => {
    if (id === 1) navigation.navigate("YourFavourites");
    else if (id === 2) navigation.navigate("YourLists");
    else if (id === 3) navigation.navigate("YourProfile");
  };

  const handleSeenToggle = async (videoId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const videoRef = doc(db, "users", user.uid, "lists", listId, "videos", videoId);
        const seen = !seenVideos[videoId];

        await updateDoc(videoRef, { seen });

        setSeenVideos((prev) => ({
          ...prev,
          [videoId]: seen,
        }));
      }
    } catch (error) {
      console.error("Error updating seen status: ", error);
    }
  };

  const renderListItem = ({ item }) => {
    let embedURL = item.url;

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

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => handleSeenToggle(item.id)} style={styles.button}>
              <Icon
                name={seen ? "eye" : "eye-slash"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{updatedList.title}</Text>
        <Text style={styles.description}>{updatedList.description}</Text>
      </View>

      <TouchableOpacity style={styles.filterButton} onPress={() => setIsSelected(!isSelected)}>
        <Icon
          name={isSelected ? "eye" : "eye-slash"}
          size={20}
          color="white"
        />
        <Text style={styles.filterText}>{isSelected ? "Seen" : "Not Seen"}</Text>
      </TouchableOpacity>

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

      <View style={styles.footerContainer}>
        <FSection currentSection={4} onPress={handlePress} />
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
  header: {
    marginBottom: 20,
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
  card: {
    backgroundColor: "#CCC",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  button: {
    marginHorizontal: 10,
  },
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
  footerContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  youtubeVideoPlayer: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default YourFavourites;
