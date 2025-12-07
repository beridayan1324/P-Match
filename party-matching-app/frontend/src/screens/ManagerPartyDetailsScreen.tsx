import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';

export default function ManagerPartyDetailsScreen({ route, navigation }: any) {
  const { party } = route.params;
  const [activeTab, setActiveTab] = useState('Main');
  const [stats, setStats] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, participantsRes] = await Promise.all([
        partyAPI.getPartyStats(party.id),
        partyAPI.getParticipants(party.id)
      ]);
      setStats(statsRes.data);
      setParticipants(participantsRes.data.participants);
    } catch (error) {
      console.error('Failed to load party details', error);
      Alert.alert('Error', 'Failed to load party details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, status: string) => {
    try {
      await partyAPI.updateParticipantStatus(party.id, userId, status);
      // Refresh data
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const renderMainTab = () => (
    <ScrollView contentContainerStyle={styles.tabContent}>
      {/* Status Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>Accepted</Text>
          <Text style={styles.statCardValue}>{stats?.accepted || 0}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
          <Text style={[styles.statCardLabel, { color: '#F57C00' }]}>Pending</Text>
          <Text style={[styles.statCardValue, { color: '#F57C00' }]}>{stats?.pending || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>Rejected</Text>
          <Text style={styles.statCardValue}>{stats?.rejected || 0}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>Abandoned</Text>
          <Text style={styles.statCardValue}>{stats?.abandoned || 0}</Text>
        </View>
      </View>

      {/* Financials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financials</Text>
        <View style={styles.financialCard}>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Incomes</Text>
            <Text style={[styles.financialValue, { color: theme.colors.success }]}>₪{stats?.totalIncome || 0}</Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Expenses</Text>
            <Text style={styles.financialValue}>₪{stats?.expenses || 0}</Text>
          </View>
          <View style={[styles.financialRow, { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10, marginTop: 5 }]}>
            <Text style={[styles.financialLabel, { fontWeight: '700' }]}>Gross revenue</Text>
            <Text style={[styles.financialValue, { fontWeight: '700' }]}>₪{stats?.grossRevenue || 0}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="qr-code-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.actionText}>Scanner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setActiveTab('Users')}>
                <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.actionText}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderUsersTab = () => {
    const filteredParticipants = participants.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <View style={styles.tabContent}>
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={theme.colors.textLight} />
            <TextInput 
                style={styles.searchInput}
                placeholder="Search for participant..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>

        <FlatList 
            data={filteredParticipants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.userCard}>
                    <View style={styles.userInfo}>
                        <Image 
                            source={{ uri: item.profileImage || 'https://via.placeholder.com/50' }} 
                            style={styles.userAvatar} 
                        />
                        <View>
                            <Text style={styles.userName}>{item.name}</Text>
                            <Text style={styles.userDetails}>{item.gender} | {item.status}</Text>
                        </View>
                    </View>
                    
                    {item.status === 'pending' && (
                        <View style={styles.userActions}>
                            <TouchableOpacity 
                                style={[styles.actionBtn, { backgroundColor: theme.colors.success }]}
                                onPress={() => handleStatusUpdate(item.userId, 'accepted')}
                            >
                                <Text style={styles.actionBtnText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.actionBtn, { backgroundColor: theme.colors.error }]}
                                onPress={() => handleStatusUpdate(item.userId, 'rejected')}
                            >
                                <Text style={styles.actionBtnText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {item.status !== 'pending' && (
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                        </View>
                    )}
                </View>
            )}
        />
      </View>
    );
  };

  const renderInsightsTab = () => (
      <ScrollView contentContainerStyle={styles.tabContent}>
          <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gender Distribution</Text>
              <View style={styles.chartContainer}>
                  <View style={styles.chartRow}>
                      <View style={[styles.chartBar, { backgroundColor: '#0D47A1', flex: stats?.genderStats?.male || 1 }]} />
                      <View style={[styles.chartBar, { backgroundColor: '#E91E63', flex: stats?.genderStats?.female || 1 }]} />
                  </View>
                  <View style={styles.legendContainer}>
                      <View style={styles.legendItem}>
                          <View style={[styles.dot, { backgroundColor: '#0D47A1' }]} />
                          <Text>Males ({stats?.genderStats?.male})</Text>
                      </View>
                      <View style={styles.legendItem}>
                          <View style={[styles.dot, { backgroundColor: '#E91E63' }]} />
                          <Text>Females ({stats?.genderStats?.female})</Text>
                      </View>
                  </View>
              </View>
          </View>
      </ScrollView>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{party.name}</Text>
            <Text style={styles.headerSubtitle}>{new Date(party.date).toLocaleDateString()}</Text>
        </View>
        <TouchableOpacity>
            <Ionicons name="share-social-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Background Image Overlay */}
      <Image 
        source={{ uri: party.image || 'https://via.placeholder.com/400x200' }} 
        style={styles.headerBg} 
        blurRadius={5} 
      />
      <View style={styles.headerOverlay} />

      {/* Tabs */}
      <View style={styles.tabs}>
        {['Main', 'Insights', 'Users'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {activeTab === 'Main' && renderMainTab()}
        {activeTab === 'Users' && renderUsersTab()}
        {activeTab === 'Insights' && renderInsightsTab()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    zIndex: 10,
  },
  headerInfo: {
      alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  headerSubtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 12,
  },
  headerBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 150,
      zIndex: 0,
  },
  headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 150,
      backgroundColor: 'rgba(0,0,0,0.4)',
      zIndex: 1,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 60, // Space for header
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  statCardLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  financialCard: {
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.card,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  financialLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  actionGrid: {
      flexDirection: 'row',
      gap: theme.spacing.md,
  },
  actionButton: {
      flex: 1,
      backgroundColor: 'white',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      ...theme.shadows.card,
  },
  actionText: {
      marginTop: theme.spacing.xs,
      fontSize: 12,
      color: theme.colors.text,
  },
  searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
  },
  searchInput: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      marginLeft: theme.spacing.sm,
  },
  userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      ...theme.shadows.card,
  },
  userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: theme.spacing.md,
  },
  userInfo: {
      flex: 1,
  },
  userName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
  },
  userDetails: {
      fontSize: 12,
      color: theme.colors.textLight,
  },
  userActions: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
  },
  actionBtn: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
  },
  actionBtnText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
  },
  statusBadge: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: theme.colors.bg,
      borderRadius: 4,
  },
  statusText: {
      fontSize: 10,
      color: theme.colors.textLight,
      fontWeight: '700',
  },
  chartContainer: {
      backgroundColor: 'white',
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.card,
  },
  chartRow: {
      flexDirection: 'row',
      height: 20,
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: theme.spacing.md,
  },
  chartBar: {
      height: '100%',
  },
  legendContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
  },
  legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
  },
  dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
  },
});
