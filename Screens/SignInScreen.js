import React, { useState } from 'react';
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation
import { initializeApp } from 'firebase/app'; // Importar inicialización de Firebase
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Importar autenticación
import { getFirestore, setDoc, doc } from 'firebase/firestore'; // Importar Firestore

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCSDKIqEWXfqQVnuHBL8r09knEA91HNfT4",
    authDomain: "to-do-list-app-97ecf.firebaseapp.com",
    projectId: "to-do-list-app-97ecf",
    storageBucket: "to-do-list-app-97ecf.firebasestorage.app",
    messagingSenderId: "11228058009",
    appId: "1:11228058009:web:a5e5bc7e07101b8f338308",
    measurementId: "G-FHB92DZSVP"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Inicializar autenticación
const db = getFirestore(app); // Inicializar Firestore

export default function SignInScreen() {
    const navigation = useNavigation(); // Usar el hook useNavigation
    const [email, setEmail] = useState(""); // Cambiar username a email
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Nuevo estado para confirmar contraseña

    const handleRegister = () => {
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match!"); // Mensaje si las contraseñas no coinciden
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Usuario registrado
                const user = userCredential.user;

                // Guardar información adicional en Firestore (opcional)
                await setDoc(doc(db, "users", user.uid), {
                    username: username,
                    email: email,
                });

                Alert.alert("User registered successfully!");
                navigation.navigate("LogInScreen"); // Redirigir a la pantalla de inicio de sesión
            })
            .catch((error) => {
                const errorMessage = error.message;
                Alert.alert("Error", errorMessage); // Mostrar mensaje de error
            });
    };

    return (
        <View style={styles.container}> 
            <Text style={styles.title}>Register</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    placeholder='Email'
                    value={email} // Cambiar a email
                    onChangeText={setEmail}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Username'
                    value={username}
                    onChangeText={setUsername}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Confirm Password'
                    secureTextEntry
                    value={confirmPassword} // Cambiar a confirmPassword
                    onChangeText={setConfirmPassword}
                    autoCorrect={false}
                    autoCapitalize='none'
                />
                <Text>Must be between 8-12 characters, contain a number and a capital letter.</Text>
            </View>

            {/* Login Button */}
            <View style={styles.buttonView}>
                <Button
                    title="Sign Up"
                    onPress={handleRegister} // Cambiar la acción aquí
                    color="red"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingTop: 70,  
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "center",
        paddingVertical: 40,
        color: "red"
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 40,
        marginBottom: 5
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: "red",
        borderWidth: 1,
        borderRadius: 7
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 50,
        marginTop: 20,
    },
    signUpView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    footerText: {
        color: "black",
        fontSize: 13,
    },
    signUpText: {
        color: "red",
        fontSize: 13,
        marginLeft: 5,
    },
});
