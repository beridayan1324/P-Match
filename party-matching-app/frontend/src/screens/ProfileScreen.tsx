import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';

export default function ProfileScreen({ navigation }: any) {
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [preferences, setPreferences] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;
        const res = await apiClient.get('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
        setName(res.data.name || '');
        setGender(res.data.gender || '');
        setPreferences(res.data.preferences || '');
      } catch (e) {
        console.warn('load profile error', e);
      }
    };
    loadProfile();
  }, []);

  const onSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      await apiClient.put('/api/profile', { name, gender, preferences }, { headers: { Authorization: `Bearer ${token}` } });
      Alert.alert('Success', 'Profile updated');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput placeholder="Your name" value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.genderRow}>
        <Button title="M" onPress={() => setGender('male')} color={gender === 'male' ? '#007AFF' : '#ccc'} />
        <Button title="F" onPress={() => setGender('female')} color={gender === 'female' ? '#007AFF' : '#ccc'} />
        <Button title="O" onPress={() => setGender('other')} color={gender === 'other' ? '#007AFF' : '#ccc'} />
      </View>

      <Text style={styles.label}>Preferences</Text>
      <TextInput placeholder="What are you looking for?" value={preferences} onChangeText={setPreferences} style={styles.input} multiline />

      <Button title={loading ? 'Saving...' : 'Save Profile'} onPress={onSave} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24 },
  label: { marginTop: 12, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 8 },
  genderRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }
});