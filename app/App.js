import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import formScreen from "./src/views/screens/formScreen";
import ResultScreen from "./src/views/screens/resultScreen";
import ResultScreenBackup from "./src/backups/resultScreenBackup";

const Stack = createNativeStackNavigator();

/**
 * The main page of the application
 * calls the formScreen and ResultScreen
 * formScreen --> user input the relevant details such as the address
 * ResultScreen --> the screeen that output the predicted value
 */

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="formScreen" component={formScreen} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
