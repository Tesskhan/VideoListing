import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CategoryList from '../filterCategories'; 
import { db } from '../firebaseConfig'; // Importar la configuración de Firebase
import { collection, getDocs } from 'firebase/firestore'; // Importamos getDocs para obtener posts
import FSection from '../FSection';
import HSection from '../HSection';

const YourLists = ({ onPress,navigation }) => {
  const [isCategoryListVisible, setCategoryListVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [posts, setPosts] = useState([]); // Estado para almacenar los posts obtenidos
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

  // Obtener los posts desde Firestore cuando el componente se monte
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData); // Almacenamos los posts obtenidos en el estado
        console.log("Posts obtenidos: ", postsData); // Verifica la estructura y valores de los posts
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };
    fetchPosts();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const toggleCategoryList = () => {
    setCategoryListVisible(!isCategoryListVisible);
  };

  return (


<View style={{ flex: 1 }}>
    {/* Sección superior: ocupa el 10% */}
    <View style={{ flex: 1 }}>
      <HSection currentSection={2} onPress={handleHPress} />
    </View>

    {/* Sección central: ocupa el 80% y todo el ancho */}
    <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
    <View style={styles.screenContainer}>
      {/* Barra de búsqueda y botón de filtro */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={toggleCategoryList}>
          <AntDesign name="filter" size={24} color="#fff" style={styles.filterIcon} />
        </TouchableOpacity>
        <TextInput placeholder="Search..." placeholderTextColor="#aaa" style={styles.searchBar} />
      </View>

      {/* Mostrar categorías seleccionadas */}
      <View style={styles.selectedCategoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedCategoriesRow}>
          {selectedCategories.map((category, index) => (
            <View key={category.id} style={styles.categoryContainer}>
              <Text style={styles.selectedCategoryText}>{category.name}</Text>
              {index < selectedCategories.length - 1 && <Text style={styles.separator}> | </Text>}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Mostrar los posts obtenidos de Firestore */}
      <ScrollView>
        {posts.map((post) => {
          // Verifica la URL de la imagen en el post
          console.log("Post: ", post); // Verifica la estructura completa del post
          console.log("Imagen URL: ", post.imageUrl); // Verifica la URL de la imagen

          return (
            <View key={post.id} style={styles.container}>
              {/* Usamos la URL de la imagen del post */}
              {post.imageUrl ? (
                <Image source={{ uri: post.imageUrl }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}

              <View style={styles.textContainer}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.coordinates}>{post.description}</Text>
                <Text style={styles.coordinates}>Posted {post.timestamp?.toDate()?.toLocaleDateString()}</Text>
              </View>

              <TouchableOpacity style={styles.button} onPress={onPress}>
                <Icon name="chevron-forward" size={24} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.heartButton} onPress={() => console.log('Heart clicked!')}>
                <AntDesign name="hearto" size={24} />
                <Text style={styles.heartText}>1000</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Componente de lista de categorías */}
      <CategoryList 
        isVisible={isCategoryListVisible} 
        onClose={toggleCategoryList} 
        onSelectCategory={(categories) => {
          setSelectedCategories(categories);
          toggleCategoryList(); 
        }} 
      />
    </View>
    </View>

    {/* Sección inferior: ocupa el 10% */}
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
  },
  filterIcon: {
    marginRight: 10, // Separación entre el ícono y la barra de búsqueda
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 25, // Bordes redondeados para estilo de cilindro
    paddingHorizontal: 15,
    fontSize: 16,
  },
  selectedCategoriesContainer: {
    marginTop: -5, 
    marginBottom: 6,
  },
  selectedCategoriesRow: {
    flexDirection: 'row', // Dirección horizontal
  },
  categoryContainer: {
    flexDirection: 'row', // Para que el texto y el separador estén en la misma línea
    alignItems: 'center', // Alinear verticalmente
  },
  selectedCategoryText: {
    color: '#fff', // Color de texto para las categorías seleccionadas
    fontSize: 16,
  },
  separator: {
    color: '#fff', // Puedes cambiar el color del separador si lo deseas
    fontSize: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    marginVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    position: 'relative', // Necesario para el posicionamiento absoluto del ícono de corazón
  },
  image: {
    width: '30%',
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: '30%',
    height: 100,
    marginRight: 10,
    backgroundColor: '#ccc', // Color gris para la imagen vacía
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#fff',
    fontWeight: 'bold',
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
    position: 'absolute', // Cambiar a posición absoluta
    top: 10, // Ajusta la distancia desde la parte superior
    right: 10, // Ajusta la distancia desde la derecha
  },
  heartButton: {
    flexDirection: 'row', // Alinear icono y texto en fila
    alignItems: 'center', // Centrar verticalmente
    position: 'absolute', // Permite posicionar el ícono de corazón en la esquina inferior derecha
    bottom: 10,
    right: 10,
  },
  heartText: {
    color: '#000', // Puedes personalizar el color del texto si lo deseas
    marginLeft: 5, // Espacio entre el icono y el texto
    fontWeight: 'bold',
  },
});

export default YourLists;
