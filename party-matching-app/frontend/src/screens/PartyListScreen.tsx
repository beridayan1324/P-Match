import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../services/api';

export default function PartyListScreen({ navigation }: any) {
  const [parties, setParties] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadParties = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/party');
      setParties(res.data || []);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to load parties');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadParties();
  }, []);

  const onLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parties</Text>
        <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      </View>

      <FlatList
        data={parties}
        keyExtractor={(i) => i.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadParties} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('PartyDetails', { party: item })}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardText}>📍 {item.location}</Text>
            <Text style={styles.cardText}>📅 {new Date(item.date).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No parties available</Text>}
      />

      <Button title="Logout" color="red" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700' },
  card: { backgroundColor: '#fff', margin: 12, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#666', marginBottom: 4 },
  empty: { textAlign: 'center', marginTop: 32, color: '#999' }
});