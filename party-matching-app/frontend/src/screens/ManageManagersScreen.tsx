import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';

const API_URL = 'http://16.171.54.43:5000';

export default function ManageManagersScreen({ navigation }: any) {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadManagers();
  }, []);

  const loadManagers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/api/admin/managers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setManagers(response.data);
    } catch (error) {
      console.error('Error loading managers:', error);
      Alert.alert('Error', 'Failed to load managers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.post(`${API_URL}/api/admin/managers/${userId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Manager approved');
      loadManagers();
    } catch (error) {
      console.error('Error approving manager:', error);
      Alert.alert('Error', 'Failed to approve manager');
    }
  };

  const handleDelete = async (userId: string) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this user?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Delete', 
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('authToken');
            await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            Alert.alert('Success', 'User deleted');
            loadManagers();
          } catch (error) {
            console.error('Error deleting user:', error);
            Alert.alert('Error', 'Failed to delete user');
          }
        }
      }
    ]);
  };

  const renderManager = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={[styles.status, item.isApproved ? styles.approved : styles.pending]}>
          {item.isApproved ? 'Approved' : 'Pending Approval'}
        </Text>
      </View>
      <View style={styles.actions}>
        {!item.isApproved && (
          <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.id)}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Managers</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={managers}
        renderItem={renderManager}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={loadManagers}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    ...theme.shadows.card,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  list: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.card,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  email: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  status: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  approved: {
    color: 'green',
  },
  pending: {
    color: 'orange',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveButton: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 8,
  },
});
