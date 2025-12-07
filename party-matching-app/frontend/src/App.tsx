import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from './screens/WelcomeScreen';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import PartyListScreen from './screens/PartyListScreen';
import PartyDetailsScreen from './screens/PartyDetailsScreen';
import MatchPreviewScreen from './screens/MatchPreviewScreen';
import MatchesListScreen from './screens/MatchesListScreen';
import AdminPanelScreen from './screens/AdminPanelScreen';
import ChatsListScreen from './screens/ChatsListScreen';
import ChatScreen from './screens/ChatScreen';
import TicketScreen from './screens/TicketScreen';
import ScannerScreen from './screens/ScannerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('App component rendering - checking routes'); // Debug log
  const [initialRoute, setInitialRoute] = React.useState<string>('Welcome');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setInitialRoute(token ? 'PartyList' : 'Welcome');
      } catch (e) {
        console.warn('Auth check failed', e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            {/* Auth Screens */}
            <Stack.Group>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Group>

            {/* Main App Screens - Updated */}
            <Stack.Group>
              <Stack.Screen name="PartyList" component={PartyListScreen} />
              <Stack.Screen name="PartyDetails" component={PartyDetailsScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="MatchPreview" component={MatchPreviewScreen} />
              <Stack.Screen name="MatchesList" component={MatchesListScreen} />
              <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
              <Stack.Screen name="ChatsList" component={ChatsListScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="TicketScreen" component={TicketScreen} />
              <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}