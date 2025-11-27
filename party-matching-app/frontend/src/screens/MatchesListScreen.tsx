import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';

export default function MatchesListScreen({ route, navigation }: any) {
  const { partyId } = route.params;
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await partyAPI.getMatches(partyId);
      setMatches(response.data.matches);
    } catch (error) {
      console.error('Failed to load matches', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMatch = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.matchCard}
      onPress={() => navigation.navigate('MatchPreview', { match: item })}
    >
      <Image 
        source={{ uri: item.profileImage || 'https://via.placeholder.com/80' }}
        style={styles.matchImage}
      />
      <View style={styles.matchInfo}>
        <Text style={styles.matchName}>{item.name}</Text>
        {item.bio && (
          <Text style={styles.matchBio} numberOfLines={2}>{item.bio}</Text>
        )}
        {item.interests && item.interests.length > 0 && (
          <View style={styles.interestsContainer}>
            {item.interests.slice(0, 3).map((interest: string, index: number) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Matches</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading your matches...</Text>
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={80} color={theme.colors.textLight} />
          <Text style={styles.emptyTitle}>No Matches Yet</Text>
          <Text style={styles.emptyText}>
            Matching hasn't started yet or there weren't enough participants.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.banner}>
            <Ionicons name="people" size={24} color={theme.colors.primary} />
            <Text style={styles.bannerText}>
              You have {matches.length} {matches.length === 1 ? 'match' : 'matches'}!
            </Text>
          </View>
          
          <FlatList
            data={matches}
            renderItem={renderMatch}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.card,
  },
  matchImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.bg,
  },
  matchInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  matchName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  matchBio: {
    fontSize: 14,
    color: theme.colors.textLight,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  interestTag: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
  },
  interestText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});