import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';

export default function PartyListScreen({ navigation }: any) {
  const [parties, setParties] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [canCreateParty, setCanCreateParty] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'joined'

  useEffect(() => {
    loadUserData();
    loadParties();
    
    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadParties();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        const isManager = user.role === 'manager' && user.isApproved;
        const isAdminUser = user.isAdmin || user.role === 'admin';
        setCanCreateParty(isAdminUser || isManager);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadParties = async () => {
    try {
      const response = await partyAPI.getAllParties();
      setParties(response.data);
    } catch (error) {
      console.error('Failed to load parties', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadParties();
    setRefreshing(false);
  };

  const filteredParties = parties.filter((party: any) => {
    const matchesSearch = party.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          party.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filter === 'joined') return party.hasJoined;
    if (filter === 'upcoming') return new Date(party.date) > new Date();
    
    return true;
  });

  const renderParty = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.partyCard}
      onPress={() => navigation.navigate('PartyDetails', { party: item })}
    >
      {item.hasJoined && (
        <View style={styles.joinedBadge}>
          <Ionicons name="checkmark-circle" size={16} color={theme.colors.white} />
          <Text style={styles.joinedBadgeText}>רשום</Text>
        </View>
      )}
      
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/400x200' }}
        style={styles.partyImage}
      />
      <View style={styles.partyInfo}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.partyName}>{item.name}</Text>
            <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                {item.ticketPrice > 0 ? `₪${item.ticketPrice}` : 'Free'}
            </Text>
        </View>
        <Text style={styles.partyDate}>{new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.partyLocation}>{item.location}</Text>
        {item.timeUntilMatching && (
          <View style={styles.countdown}>
            <Ionicons name="timer-outline" size={16} color={theme.colors.primary} />
            <Text style={styles.countdownText}>
              Matching in {Math.floor(item.timeUntilMatching / (1000 * 60 * 60))}h
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- START OF HEADER --- */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {canCreateParty && (
            <TouchableOpacity 
              style={{ marginRight: 15, padding: 5 }} 
              onPress={() => navigation.navigate('AdminPanel')}
            >
              <Ionicons name="add-circle-outline" size={30} color={theme.colors.primary} />
            </TouchableOpacity>
          )}

          {/* Buttons moved to LEFT side for RTL feel, or keep right if preferred */}
          <TouchableOpacity 
            style={{ marginRight: 15, padding: 5 }} 
            onPress={() => navigation.navigate('ChatsList')}
          >
            <Ionicons name="chatbubbles-outline" size={26} color={theme.colors.text} />
          </TouchableOpacity>

          {/* PROFILE BUTTON */}
          <TouchableOpacity 
            style={{ padding: 5 }}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={30} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <View>
          <Text style={styles.headerTitle}>מסיבות</Text>
          <Text style={styles.headerSubtitle}>מצא את האירוע הבא שלך</Text>
        </View>
      </View>
      {/* --- END OF HEADER --- */}

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.colors.textLight} style={{ marginRight: 8 }} />
            <TextInput 
                style={styles.searchInput}
                placeholder="Search parties..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
        <View style={styles.filterContainer}>
            <TouchableOpacity 
                style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                onPress={() => setFilter('all')}
            >
                <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.filterButton, filter === 'upcoming' && styles.filterButtonActive]}
                onPress={() => setFilter('upcoming')}
            >
                <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>Upcoming</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.filterButton, filter === 'joined' && styles.filterButtonActive]}
                onPress={() => setFilter('joined')}
            >
                <Text style={[styles.filterText, filter === 'joined' && styles.filterTextActive]}>Joined</Text>
            </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredParties}
        renderItem={renderParty}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>No parties found</Text>
            {canCreateParty && (
              <Text style={styles.emptySubtext}>Tap + to create one</Text>
            )}
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
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    ...theme.shadows.card,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: 4,
    textAlign: 'right',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  adminButton: {
    marginRight: theme.spacing.xs,
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
    position: 'relative',
  },
  joinedBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: '#FF1493',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    zIndex: 10,
    gap: theme.spacing.xs,
  },
  joinedBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  partyImage: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.bg,
  },
  partyInfo: {
    padding: theme.spacing.md,
  },
  partyName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'right',
  },
  partyDate: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
  partyLocation: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
  partyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  partyDetailText: {
    marginLeft: theme.spacing.xs,
    fontSize: 14,
    color: theme.colors.textLight,
  },
  countdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  countdownText: {
    marginLeft: theme.spacing.xs,
    fontSize: 12,
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
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.bg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    ...theme.shadows.card,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  filterTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },
});