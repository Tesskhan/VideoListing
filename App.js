import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import Button from './components/Button'; 

import SignInScreen from "./components/Screens/SignInScreen";
import LogInScreen from "./components/Screens/LogInScreen";
import YourUser from "./components/Screens/YourUser";
import YourLists from "./components/Screens/YourLists";
import YourFavourites from "./components/Screens/YourFavourites";
import { styles } from "./components/Styles";
import { useRef } from 'react';
import React from 'react';

// Importa las dependencias de navegación
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Define el stack de navegación
const Stack = createNativeStackNavigator();

// App principal
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="">
        <Stack.Screen name="YourFavourites" component={YourFavourites} options = {{animation: 'none', headerShown: false}}/>
        <Stack.Screen name="LogInScreen" component={LogInScreen} options = {{animation: 'none', headerShown: false}}/>
        <Stack.Screen name="SignInScreen" component={SignInScreen} options = {{animation: 'none', headerShown: false}}/>
        <Stack.Screen name="YourUser" component={YourUser} options = {{animation: 'none', headerShown: false}}/>
        <Stack.Screen name="YourLists" component={YourLists} options = {{animation: 'none', headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}