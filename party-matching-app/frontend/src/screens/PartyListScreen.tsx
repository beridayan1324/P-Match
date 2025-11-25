import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PartyCard from '../components/PartyCard';
import { theme } from '../theme/theme';
import { apiClient } from '../services/api';

export default function PartyListScreen({ navigation }: any) {
  const [parties, setParties] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadParties = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/party');
      setParties(res.data || []);
    } catch (e) {
      console.warn('Failed to load parties', e);
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MatchesList')} style={styles.iconButton}>
            <Ionicons name="heart-circle-outline" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={parties}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PartyCard
            party={item}
            index={index}
            onPress={() => navigation.navigate('PartyDetails', { party: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadParties} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No parties yet</Text>
            <Text style={styles.emptySubtext}>Check back soon for upcoming events!</Text>
          </View>
        }
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
});