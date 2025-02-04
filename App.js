import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogInScreen from "./Screens/LogInScreen"
import RegisterScreen from "./Screens/RegisterScreen"
import YourFavourites from "./Screens/YourFavourites";
import YourLists from "./Screens/YourLists"; // Import YourLists screen
import YourProfile from "./Screens/YourProfile"; // Import YourProfile screen
import ListVideos from "./Screens/ListVideos";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogInScreen">
        {/* Define each screen separately */}
        <Stack.Screen
          name="LogInScreen"
          component={LogInScreen}
          options={{ headerShown: false }} // Hide the header for this screen
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false }} // Hide the header for this screen
        />
        <Stack.Screen
          name="YourFavourites"
          component={YourFavourites}
          options={{ headerShown: false }} // Hide the header for this screen
        />
        <Stack.Screen
          name="YourLists"
          component={YourLists}
          options={{ headerShown: false }} // Hide the header for this screen
        />
        <Stack.Screen
          name="YourProfile"
          component={YourProfile}
          options={{ headerShown: false }} // Hide the header for this screen
        />
        <Stack.Screen
          name="ListVideos"
          component={ListVideos}
          options={{ headerShown: false }} // Hide the header for this screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
