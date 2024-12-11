// Header.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Importar el hook
import HButton from './HButton';
import {useRoute} from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();  // Usamos el hook para obtener la función de navegación
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const route = useRoute();
  const { username } = route.params; // Acceder al usuario pasado como parámetro

  const toggleMenu = () => setMenuVisible(!menuVisible);
  const toggleNotifications = () => setNotificationsVisible(!notificationsVisible);


  return (
    <LinearGradient
      colors={['#000000', '#0A0A0A', '#1C1C1C']}  
      style={styles.gradientBackground}
    >
      <View style={styles.headerContainer}>
        <HButton icon="menu" onPress={toggleMenu} />
        <Text style={styles.headerText}>ToDoPlease</Text>
        <HButton icon="bell-outline" onPress={toggleNotifications} />
      </View>

      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainerMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ForumScreen",{username:username})}>
              <Text style={styles.menuText}>Forum</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ContactScreen")}>
              <Text style={styles.menuText}>Contacte</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        transparent={true}
        visible={notificationsVisible}
        animationType="fade"
        onRequestClose={() => setNotificationsVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setNotificationsVisible(false)}>
          <View style={styles.menuContainerNotifications}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setNotificationsVisible(false); }}>
              <Text style={styles.menuText}>Notificación 1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setNotificationsVisible(false); }}>
              <Text style={styles.menuText}>Notificación 2</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    height: 95,  
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',  
  },
  headerContainer: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
  },
  headerText: {
    fontSize: 24,  
    color: 'white',
    fontWeight: 'bold', 
    marginLeft: 40, 
    marginRight: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 61,
  },
  menuContainerMenu: {
    backgroundColor: 'white',
    padding: 10,
    width: 150, 
  },
  menuContainerNotifications: {
    backgroundColor: 'white',
    padding: 10,
    width: 150,
    marginLeft: 250,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: 'black',
  },
});
