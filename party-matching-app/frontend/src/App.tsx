import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import PartyListScreen from './screens/PartyListScreen';
import MatchPreviewScreen from './screens/MatchPreviewScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PartyList" component={PartyListScreen} />
        <Stack.Screen name="MatchPreview" component={MatchPreviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;