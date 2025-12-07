import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';

export default function ManagerDashboardScreen({ navigation }: any) {
  const [parties, setParties] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadParties();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadParties();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadParties = async () => {
    try {
      const response = await partyAPI.getManagerParties();
      setParties(response.data);
    } catch (error) {
      console.error('Failed to load manager parties', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadParties();
    setRefreshing(false);
  };

  const renderParty = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.partyCard}
      onPress={() => navigation.navigate('ManagerPartyDetails', { party: item })}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/400x200' }}
        style={styles.partyImage}
      />
      <View style={styles.partyInfo}>
        <Text style={styles.partyName}>{item.name}</Text>
        <Text style={styles.partyDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.partyLocation}>{item.location}</Text>
        
        <View style={styles.statsRow}>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Ticket Price</Text>
                <Text style={styles.statValue}>₪{item.ticketPrice || 0}</Text>
            </View>
            <View style={styles.statItem}>
                <Text style={styles.statLabel}>Expenses</Text>
                <Text style={styles.statValue}>₪{item.expenses || 0}</Text>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AdminPanel')}>
            <Ionicons name="add-circle-outline" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={parties}
        renderItem={renderParty}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No events created yet</Text>
            <Text style={styles.emptySubtext}>Tap + to create your first event</Text>
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
    ...theme.shadows.card,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  partyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  partyImage: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.bg,
  },
  partyInfo: {
    padding: theme.spacing.md,
  },
  partyName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  partyDate: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  partyLocation: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing.sm,
  },
  statItem: {
      alignItems: 'center',
  },
  statLabel: {
      fontSize: 12,
      color: theme.colors.textLight,
  },
  statValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
});
