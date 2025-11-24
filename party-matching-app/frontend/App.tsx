import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import { apiClient } from './src/services/api';

const Stack = createNativeStackNavigator();

function SignupScreen({ navigation }: any) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const res = await apiClient.post('/api/auth/signup', { email, password });
      // for now just navigate to PartyList
      navigation.replace('PartyList', { token: res.data.token });
    } catch (e: any) {
      alert(e?.response?.data?.message || String(e));
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>P‑Match (minimal)</Text>

      <TextInput placeholder="email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <Button title={loading ? 'Working...' : 'Sign up'} onPress={onSignup} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Go to Parties" onPress={() => navigation.navigate('PartyList')} />
    </View>
  );
}

function PartyListScreen({ route }: any) {
  const [parties, setParties] = React.useState<any[]>([]);
  const load = async () => {
    try {
      const res = await apiClient.get('/api/party');
      setParties(res.data || []);
    } catch (e: any) {
      alert('fetch failed: ' + (e?.message || String(e)));
    }
  };
  React.useEffect(() => { load(); }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parties</Text>
      <FlatList
        data={parties}
        keyExtractor={(i) => i.id || i.name || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.party}>
            <Text style={{ fontWeight: '700' }}>{item.name}</Text>
            <Text>{item.location} — {item.date ? new Date(item.date).toLocaleString() : ''}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No parties yet</Text>}
      />
      <Button title="Refresh" onPress={load} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Signup">
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="PartyList" component={PartyListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 48 },
  title: { fontSize: 18, marginBottom: 12 },
  input: { borderWidth: 1, padding: 8, marginBottom: 8, borderRadius: 4 },
  party: { padding: 10, borderWidth: 1, marginTop: 8, borderRadius: 4 }
});