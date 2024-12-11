import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'; // Importa el icono de cierre
import { db } from './firebaseConfig'; // Importa la configuración de Firebase
import { doc, getDoc } from 'firebase/firestore'; // Importa la función para obtener un solo documento

const CategoryList = ({ isVisible, onSelectCategory, onClose }) => {
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías
  const [selectedCategories, setSelectedCategories] = useState([]); // Estado para las categorías seleccionadas
  const [expandedCategory, setExpandedCategory] = useState(null); // Estado para manejar la categoría expandida
  const [loading, setLoading] = useState(true); // Estado para la carga
  const [error, setError] = useState(null); // Estado para manejar posibles errores

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Obtén el documento con el ID específico
        const docRef = doc(db, 'categories', '8OKKrwetKWepuZ9QqhQ8'); // Documento con el ID proporcionado
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data(); // Obtén los datos del documento
          console.log('Fetched categories data:', data); // Verifica los datos en la consola

          if (data.categoryList) { // Verifica que el campo `categoryList` exista
            // Extraer categorías y subcategorías
            const categoriesArray = Object.entries(data.categoryList).map(([categoryName, subcategories]) => {
              return {
                id: categoryName,  // Usamos el nombre de la categoría como ID
                name: categoryName,  // Nombre de la categoría
                subcategories: subcategories, // Array de subcategorías
                expanded: false, // Añadimos un estado para saber si está expandido o no
              };
            });
            setCategories(categoriesArray);
          } else {
            setError('No categoryList field found in the document.');
          }
        } else {
          setError('No categories document found.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories: ', error);
        setError('Error fetching categories');
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchCategories(); // Carga las categorías solo cuando el modal está visible
    }
  }, [isVisible]);

  // Función para alternar el estado de expansión de la categoría
  const handleCategoryPress = (category) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === category.id
          ? { ...cat, expanded: !cat.expanded } // Cambia el estado de 'expanded'
          : cat
      )
    );
  };

  // Función para manejar la selección de una subcategoría
  const handleSubcategoryPress = (categoryId, subcategory) => {
    const category = categories.find((cat) => cat.id === categoryId);

    if (!category) return;

    const isSelected = selectedCategories.includes(subcategory);
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter((item) => item !== subcategory)); // Deseleccionar
    } else {
      setSelectedCategories([...selectedCategories, subcategory]); // Seleccionar
    }
  };

  // Función para aplicar la selección de categorías/subcategorías
  const applySelections = () => {
    if (onSelectCategory) {
      // Filtra las categorías seleccionadas
      const selected = categories
        .map((category) => {
          const selectedSubcategories = category.subcategories.filter((subcategory) =>
            selectedCategories.includes(subcategory)
          );
          if (selectedSubcategories.length > 0) {
            return { category: category.name, subcategories: selectedSubcategories };
          }
          return null;
        })
        .filter(Boolean);

      onSelectCategory(selected); // Pasa las categorías y subcategorías seleccionadas al componente principal
    }
    onClose(); // Cierra el modal después de aplicar las selecciones
  };

  const renderCategoryItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedCategories.includes(item.id) ? styles.selectedCategoryButton : styles.defaultCategoryButton,
        ]}
        onPress={() => handleCategoryPress(item)}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategories.includes(item.id) ? styles.selectedCategoryText : styles.defaultCategoryText,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>

      {/* Mostrar subcategorías si la categoría está expandida */}
      {item.expanded && (
        <FlatList
          data={item.subcategories}
          renderItem={({ item: subcategory }) => (
            <TouchableOpacity
              style={[
                styles.subcategoryButton,
                selectedCategories.includes(subcategory) ? styles.selectedSubcategoryButton : styles.defaultSubcategoryButton,
              ]}
              onPress={() => handleSubcategoryPress(item.id, subcategory)}
            >
              <Text
                style={[
                  styles.subcategoryText,
                  selectedCategories.includes(subcategory) ? styles.selectedSubcategoryText : styles.defaultSubcategoryText,
                ]}
              >
                {subcategory}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.subcategoryListContent}
        />
      )}
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose} // Cierra el modal en la acción de retroceso
    >
      <View style={styles.modalContainer}>
        {/* Contenedor para los botones del encabezado */}
        <View style={styles.headerContainer}>
          {/* Botón de cierre (X) */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <AntDesign name="closecircle" size={30} color="#000" />
          </TouchableOpacity>

          {/* Botón de aplicar */}
          <TouchableOpacity style={styles.applyButton} onPress={applySelections}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Mostrar las categorías */}
        {loading ? (
          <Text>Loading categories...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  listContent: {
    flexGrow: 1,
  },
  categoryButton: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  defaultCategoryButton: {
    backgroundColor: '#000',
  },
  selectedCategoryButton: {
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: 16,
  },
  defaultCategoryText: {
    color: '#fff',
  },
  selectedCategoryText: {
    color: '#000',
    fontWeight: 'bold',
  },
  subcategoryButton: {
    paddingVertical: 10,
    paddingLeft: 40,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  defaultSubcategoryButton: {
    backgroundColor: '#f5f5f5',
  },
  selectedSubcategoryButton: {
    backgroundColor: '#e1e1e1',
  },
  subcategoryText: {
    fontSize: 14,
  },
  defaultSubcategoryText: {
    color: '#000',
  },
  selectedSubcategoryText: {
    color: '#03b6ef',
    fontWeight: 'bold',
  },
  closeButton: {},
  applyButton: {
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  applyButtonText: {
    color: '#03b6ef',
    fontSize: 18,
  },
});

export default CategoryList;
