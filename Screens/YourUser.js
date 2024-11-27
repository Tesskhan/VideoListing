import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RedButton from '../redButton';
import GrayButton from '../grayButton';
import SignOutModal from '../SignOutModal';
import FSection from '../FSection';
import HSection from '../HSection';

export default function YourUser() {
    const navigation = useNavigation();
    const username = "User 1";
    const [modalVisible, setModalVisible] = useState(false);
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

    const handleSignOut = () => {
        console.log("Sign out confirmed");
        navigation.navigate('loginScreen');
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Sección superior: ocupa el 10% */}
            <View style={{ flex: 1, }}>
                <HSection currentSection={1} onPress={handleHPress} />
            </View>

            {/* Sección central: ocupa el 80% y todo el ancho */}
            <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <GrayButton 
                        title="Edit" 
                        onPress={() => navigation.navigate('editUserScreen')}
                        />
                        <RedButton 
                        title="Sign Out" 
                        onPress={() => setModalVisible(true)} // Abre el modal al presionar el botón
                        />
                    </View>
                    <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.avatar}/>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.posts}>Posts</Text>
                    <Text style={styles.number}>4</Text>

                    {/* Implementación del modal */}
                    <SignOutModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onConfirm={handleSignOut}
                    />
                </View>
            </View>

            {/* Sección inferior: ocupa el 10% */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                <FSection currentSection={3} onPress={handlePress} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        top: 20,
        paddingHorizontal: 20,
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 25,
        marginTop: 70,
    },
    username: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 25,
    },
    posts: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    number: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 25,
    },
});
