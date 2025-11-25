import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.post('/api/auth/login', { email, password });
      await AsyncStorage.setItem('authToken', res.data.token);
      navigation.replace('PartyList');
    } catch (e: any) {
      Alert.alert('Login Error', e?.response?.data?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput placeholder="you@example.com" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />

      <Text style={styles.label}>Password</Text>
      <TextInput placeholder="••••••" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <Button title={loading ? 'Logging in...' : 'Login'} onPress={onLogin} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Don't have an account? Sign Up" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  label: { marginTop: 12, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 8 }
});