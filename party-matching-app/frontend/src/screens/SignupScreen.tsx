import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      const res = await apiClient.post('/api/auth/signup', { email, password, name, gender });
      await AsyncStorage.setItem('authToken', res.data.token);
      navigation.replace('PartyList');
    } catch (e: any) {
      Alert.alert('Signup Error', e?.response?.data?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput placeholder="Your name" value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Email</Text>
      <TextInput placeholder="you@example.com" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />

      <Text style={styles.label}>Password</Text>
      <TextInput placeholder="••••••" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        <Button title="Male" onPress={() => setGender('male')} color={gender === 'male' ? '#007AFF' : '#ccc'} />
        <Button title="Female" onPress={() => setGender('female')} color={gender === 'female' ? '#007AFF' : '#ccc'} />
        <Button title="Other" onPress={() => setGender('other')} color={gender === 'other' ? '#007AFF' : '#ccc'} />
      </View>

      <Button title={loading ? 'Creating...' : 'Sign Up'} onPress={onSignup} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Already have an account? Login" onPress={() => navigation.navigate('Login')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  label: { marginTop: 12, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 8 },
  genderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }
});