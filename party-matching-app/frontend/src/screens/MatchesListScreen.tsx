import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';

export default function MatchesListScreen({ route, navigation }: any) {
  const { partyId } = route.params;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await partyAPI.getMatches(partyId);
      
      // Parse interests for each match
      const matchesWithParsedInterests = response.data.matches.map((match: any) => {
        if (match.user && typeof match.user.interests === 'string') {
          try {
            match.user.interests = JSON.parse(match.user.interests);
          } catch (e) {
            match.user.interests = [];
          }
        }
        return match;
      });
      
      setMatches(matchesWithParsedInterests);
    } catch (error) {
      console.error('Failed to load matches', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMatches();
  };

  const renderMatch = ({ item }: any) => {
    const statusIcon = item.mutualMatch 
      ? 'heart' 
      : item.myStatus === 'accepted' 
        ? 'time' 
        : item.myStatus === 'rejected'
          ? 'close-circle'
          : 'help-circle';
    
    const statusColor = item.mutualMatch 
      ? theme.colors.success 
      : item.myStatus === 'accepted' 
        ? theme.colors.warning 
        : item.myStatus === 'rejected'
          ? theme.colors.error
          : theme.colors.textLight;

    const statusText = item.mutualMatch 
      ? 'התאמה הדדית!' 
      : item.myStatus === 'accepted' 
        ? 'ממתין לתגובה' 
        : item.myStatus === 'rejected'
          ? 'נדחה'
          : 'התאמה חדשה';

    return (
      <TouchableOpacity 
        style={styles.matchCard}
        onPress={() => navigation.navigate('MatchPreview', { 
          match: item, 
          partyId,
          onMatchUpdate: loadMatches // Pass the refresh function
        })}
      >
        <Image 
          source={{ uri: item.user.profileImage || 'https://via.placeholder.com/80' }}
          style={styles.matchImage}
        />
        <View style={styles.matchInfo}>
          <Text style={styles.matchName}>{item.user.name}</Text>
          {item.user.bio && (
            <Text style={styles.matchBio} numberOfLines={2}>{item.user.bio}</Text>
          )}
          
          {/* Interests */}
          {item.user.interests && Array.isArray(item.user.interests) && item.user.interests.length > 0 && (
            <View style={styles.interestsContainer}>
              {item.user.interests.slice(0, 3).map((interest: string, index: number) => (
                <View key={`match-${item.matchId}-interest-${index}`} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.statusRow}>
            <Ionicons name={statusIcon} size={16} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {statusText}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-back" size={24} color={theme.colors.textLight} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>טוען התאמות...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>ההתאמות שלך</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item: any) => item.matchId}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={64} color={theme.colors.textLight} />
            <Text style={styles.emptyText}>אין התאמות עדיין</Text>
            <Text style={styles.emptySubtext}>חזור לבדוק מאוחר יותר!</Text>
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
  list: {
    padding: theme.spacing.lg,
  },
  matchCard: {
    flexDirection: 'row-reverse', // RTL: Image on right
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  matchImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginLeft: theme.spacing.md, // Changed from marginRight
    backgroundColor: theme.colors.bg,
  },
  matchInfo: {
    flex: 1,
    alignItems: 'flex-end', // Align text to right
  },
  matchName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
  matchBio: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
  },
  interestsContainer: {
    flexDirection: 'row-reverse', // RTL
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  interestTag: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 2,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  interestText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    fontSize: 16,
    color: theme.colors.textLight,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xxl * 2,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
});