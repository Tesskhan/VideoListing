import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RedButton from '../redButton';
import { auth } from '../firebaseConfig'; // Importar la configuración de Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';


export default function LogInScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [bgAnim] = useState(new Animated.Value(0));
    const [resetEmail, setResetEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar la pantalla de carga
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("SignInScreen");
    };

    const handleForgotPassword = () => {
        setModalVisible(true);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(bgAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handleCloseModal = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(bgAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setModalVisible(false);
            setResetEmail("");
        });
    };

    const handleLogin = () => {
        if (username && password) {
            setIsLoading(true); // Mostrar pantalla de carga
            signInWithEmailAndPassword(auth, username, password)
                .then(() => {
                    setIsLoading(false); // Ocultar pantalla de carga
                    navigation.navigate("YourLists", { username: username });
                })
                .catch((error) => {
                    setIsLoading(false); // Ocultar pantalla de carga
                    const errorCode = error.code;
                    if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                        Alert.alert("Invalid Username or Password!");
                    } else {
                        Alert.alert("Invalid Username or Password!");
                    }
                });
        } else {
            Alert.alert("Username or Password missing!");
        }
    };

    const handleSendResetLink = () => {
        if (resetEmail) {
            sendPasswordResetEmail(auth, resetEmail)
                .then(() => {
                    Alert.alert("Reset link sent to your email!");
                    handleCloseModal();
                })
                .catch((error) => {
                    const errorCode = error.code;
                    if (errorCode === 'auth/invalid-email') {
                        Alert.alert("Invalid email address. Please check and try again.");
                    } else if (errorCode === 'auth/user-not-found') {
                        Alert.alert("No user found with this email address.");
                    } else {
                        Alert.alert("Error sending reset link. Please try again.");
                    }
                });
        } else {
            Alert.alert("Please enter your email address.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.input}
                    placeholder='Email or Username'
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
            </View>

            <View style={styles.forgotPasswordView}>
                <Pressable onPress={handleForgotPassword}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </Pressable>
            </View>

            <View style={styles.buttonView}>
                <RedButton
                    title="LOGIN"
                    onPress={handleLogin}
                    color="red"
                />
            </View>

            <View style={styles.signUpView}>
                <Text style={styles.footerText}>Don't Have an Account? </Text>
                <Pressable onPress={handlePress}>
                    <Text style={styles.signUpText}>Sign Up</Text>
                </Pressable>
            </View>

            {/* Indicador de carga */}
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="red" />
                    <Text style={styles.loadingText}>Logging in...</Text>
                </View>
            )}

            {/* Modal para Olvido de Contraseña */}
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <Animated.View style={[styles.modalOverlay, { opacity: bgAnim }]}>
                    <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Forgot Password</Text>
                            <Text>Please enter your email to reset your password.</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder='Email'
                                value={resetEmail}
                                onChangeText={setResetEmail}
                                autoCapitalize='none'
                            />
                            <Pressable style={styles.modalButton} onPress={handleSendResetLink}>
                                <Text style={styles.modalButtonText}>Send Reset Link</Text>
                            </Pressable>
                            <Pressable onPress={handleCloseModal}>
                                <Text style={styles.closeModalText}>Close</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </Animated.View>
            </Modal>
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
    forgotPasswordView: {
        width: "100%",
        alignItems: "flex-end",
        paddingHorizontal: 40,
        marginBottom: 15,
    },
    forgotText: {
        fontSize: 13,
        color: "red"
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 50,
        marginBottom: 20,
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
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // fondo semi-transparente
    },
    modalContainer: {
        width: "80%",
        borderRadius: 10,
        elevation: 5,
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    modalInput: {
        height: 40,
        paddingHorizontal: 10,
        borderColor: "red",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
    modalButton: {
        backgroundColor: "red",
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    modalButtonText: {
        color: "white",
        textAlign: "center",
    },
    closeModalText: {
        color: "blue",
        textAlign: "center",
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: 'red',
        fontSize: 16,
    },
});
