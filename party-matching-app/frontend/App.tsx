import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from './src/screens/WelcomeScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PartyListScreen from './src/screens/PartyListScreen';
import PartyDetailsScreen from './src/screens/PartyDetailsScreen';
import MatchPreviewScreen from './src/screens/MatchPreviewScreen';
import MatchesListScreen from './src/screens/MatchesListScreen';
import AdminPanelScreen from './src/screens/AdminPanelScreen';
import ManageManagersScreen from './src/screens/ManageManagersScreen';
import ManagerDashboardScreen from './src/screens/ManagerDashboardScreen';
import ManagerPartyDetailsScreen from './src/screens/ManagerPartyDetailsScreen';
import ChatScreen from './src/screens/ChatScreen'; // Import the screen
import ChatsListScreen from './src/screens/ChatsListScreen';
import TicketScreen from './src/screens/TicketScreen';
import ScannerScreen from './src/screens/ScannerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = React.useState<string>('Welcome');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setInitialRoute(token ? 'PartyList' : 'Welcome');
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Group>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Group>

          <Stack.Group>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PartyList" component={PartyListScreen} />
            <Stack.Screen name="PartyDetails" component={PartyDetailsScreen} />
            <Stack.Screen name="MatchPreview" component={MatchPreviewScreen} />
            <Stack.Screen name="MatchesList" component={MatchesListScreen} />
            <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
            <Stack.Screen name="ManageManagers" component={ManageManagersScreen} />
            <Stack.Screen name="ManagerDashboard" component={ManagerDashboardScreen} />
            <Stack.Screen name="ManagerPartyDetails" component={ManagerPartyDetailsScreen} />
            <Stack.Screen 
              name="ChatsList" 
              component={ChatsListScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Chat" 
              component={ChatScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen name="TicketScreen" component={TicketScreen} />
            <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}