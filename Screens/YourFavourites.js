import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { WebView } from "react-native-webview";
import FSection from "../Components/FSection";
import { db, auth } from '../firebaseConfig'; 
import { collection, getDocs, updateDoc, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const YourFavourites = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [isSelected, setIsSelected] = useState(false);
  const [seenVideos, setSeenVideos] = useState({});
  const [likedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      const user = auth.currentUser;
      if (user) {
        const likedVideosQuery = collection(db, "users", user.uid, "likedVideos");
        const querySnapshot = await getDocs(likedVideosQuery);
        const videos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setLikedVideos(videos);
        console.log("Fetched liked videos:", videos); // Debugging log

        const initialSeenState = videos.reduce((acc, video) => {
          acc[video.id] = video.seen || false;
          return acc;
        }, {});
        setSeenVideos(initialSeenState);
      }
    };

    fetchLikedVideos();
  }, []);

  const handlePress = (id) => {
    if (id === 1) navigation.navigate("YourFavourites");
    else if (id === 2) navigation.navigate("YourLists");
    else if (id === 3) navigation.navigate("YourProfile");
  };

  const handleSeenToggle = async (videoId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const videoRef = doc(db, "users", user.uid, "likedVideos", videoId);
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

  const handleLikeToggle = async (videoId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const videoRef = doc(db, "users", user.uid, "likedVideos", videoId);
        const liked = !likedVideos.some(video => video.id === videoId);

        if (liked) {
          const videoSnapshot = await getDoc(videoRef);
          if (videoSnapshot.exists()) {
            const videoData = videoSnapshot.data();
            await setDoc(videoRef, { ...videoData, liked: true });
            console.log("Video added to likedVideos collection:", videoData);
          } else {
            console.error("Video data not found for videoId:", videoId);
          }
        } else {
          await deleteDoc(videoRef);
          console.log("Video removed from likedVideos collection:", videoId);
        }

        setLikedVideos((prev) => {
          if (liked) {
            return [...prev, { id: videoId, liked: true }];
          } else {
            return prev.filter(video => video.id !== videoId);
          }
        });
      }
    } catch (error) {
      console.error("Error updating liked status: ", error);
      alert("Failed to update the like status. Please try again.");
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
    const liked = likedVideos.some(video => video.id === item.id);

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
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
            <TouchableOpacity onPress={() => handleLikeToggle(item.id)} style={styles.button}>
              <Icon
                name={liked ? "heart" : "heart-o"}
                size={20}
                color="red"
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
        <Text style={styles.title}>Your Favourites</Text>
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
        data={likedVideos.filter((video) => {
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
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
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
    paddingVertical: 8,
    backgroundColor: "#EEE",
    borderRadius: 8,
  },
  button: {
    marginHorizontal: 30,
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
