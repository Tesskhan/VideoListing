import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert('Success', 'Account created successfully!');
        console.log('User:', user);
        navigation.navigate('YourLists'); // Navigate to the YourLists screen
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert('Error', errorMessage);
        console.log('Error:', error.code, errorMessage);
      });
  };

  return (
    <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Text style={styles.toggleButtonText}>
                {isPasswordVisible ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('LogInScreen')}>
            <Text style={styles.registerButtonText}>Log in</Text>
          </TouchableOpacity>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    color: '#333',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#333',
  },
  toggleButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#555',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 10,
  },
  registerButtonText: {
    color: '#555',
    fontSize: 16,
  },
});

export default RegisterScreen;
