import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';

export default function MatchPreviewScreen({ route, navigation }: any) {
  const { match, partyId, onMatchUpdate } = route.params;
  const [loading, setLoading] = useState(false);
  const [myStatus, setMyStatus] = useState(match.myStatus);
  const [mutualMatch, setMutualMatch] = useState(match.mutualMatch);

  const user = match.user;

  // Parse interests if it's a string
  let userInterests: string[] = [];
  if (user.interests) {
    if (typeof user.interests === 'string') {
      try {
        userInterests = JSON.parse(user.interests);
      } catch (e) {
        userInterests = [];
      }
    } else if (Array.isArray(user.interests)) {
      userInterests = user.interests;
    }
  }

  const handleRespond = async (action: 'accept' | 'reject') => {
    try {
      setLoading(true);
      const response = await partyAPI.respondToMatch(match.matchId, action);
      
      setMyStatus(action === 'accept' ? 'accepted' : 'rejected');
      setMutualMatch(response.data.mutualMatch);
      
      // Notify parent to refresh matches list
      if (onMatchUpdate) {
        onMatchUpdate();
      }
      
      if (response.data.mutualMatch) {
        Alert.alert(
          '🎉 It\'s a Match!',
          `You and ${user.name} both accepted! You can now chat.`,
          [
            { 
              text: 'Start Chatting', 
              onPress: () => {
                navigation.navigate('Chat', { matchId: match.matchId, otherUser: user });
              }
            },
            { 
              text: 'Later', 
              style: 'cancel', 
              onPress: () => {
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Success', 
          action === 'accept' ? 'Match accepted! Waiting for their response.' : 'Match declined',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Respond error:', error);
      Alert.alert('Error', 'Failed to respond to match');
    } finally {
      setLoading(false);
    }
  };

  // Don't show accept/reject buttons if already responded or mutual match
  const showActionButtons = myStatus === 'pending' && !mutualMatch;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Image */}
        <Image 
          source={{ uri: user.profileImage || 'https://via.placeholder.com/300' }}
          style={styles.profileImage}
        />

        {/* Name & Age */}
        <Text style={styles.name}>{user.name}</Text>
        {user.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={theme.colors.textLight} />
            <Text style={styles.location}>{user.location}</Text>
          </View>
        )}

        {/* Bio */}
        {user.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>
        )}

        {/* Interests */}
        {userInterests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {userInterests.map((interest: string, index: number) => (
                <View key={`interest-${index}`} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Status Badges */}
        {mutualMatch && (
          <View style={styles.mutualBadge}>
            <Ionicons name="heart" size={24} color={theme.colors.white} />
            <Text style={styles.mutualText}>It's a Match! 🎉</Text>
          </View>
        )}

        {myStatus === 'accepted' && !mutualMatch && (
          <View style={styles.waitingBadge}>
            <Ionicons name="time" size={20} color={theme.colors.warning} />
            <Text style={styles.waitingText}>Waiting for {user.name}'s response</Text>
          </View>
        )}

        {myStatus === 'rejected' && (
          <View style={styles.rejectedBadge}>
            <Ionicons name="close-circle" size={20} color={theme.colors.error} />
            <Text style={styles.rejectedText}>You declined this match</Text>
          </View>
        )}

        {/* Action Buttons */}
        {showActionButtons && (
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.rejectButton}
              onPress={() => handleRespond('reject')}
              disabled={loading}
            >
              <Ionicons name="close-circle" size={32} color={theme.colors.error} />
              <Text style={styles.rejectText}>Pass</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.acceptButton}
              onPress={() => handleRespond('accept')}
              disabled={loading}
            >
              <Ionicons name="heart-circle" size={32} color={theme.colors.white} />
              <Text style={styles.acceptText}>Like</Text>
            </TouchableOpacity>
          </View>
        )}

        {mutualMatch && (
          <PrimaryButton
            title="Start Chatting"
            onPress={() => navigation.navigate('Chat', { matchId: match.matchId, otherUser: user })}
            icon="chatbubbles"
            style={styles.chatButton}
          />
        )}
      </ScrollView>
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
  content: {
    padding: theme.spacing.lg,
  },
  profileImage: {
    width: '100%',
    height: 400,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.bg,
    marginBottom: theme.spacing.lg,
  },
  name: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  location: {
    marginLeft: theme.spacing.xs,
    fontSize: 16,
    color: theme.colors.textLight,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  bio: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  interestTag: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  interestText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  mutualBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  mutualText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  waitingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3CD',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  waitingText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8D7DA',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  rejectedText: {
    color: '#721C24',
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  rejectButton: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.card,
  },
  rejectText: {
    marginTop: theme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
  },
  acceptButton: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.card,
  },
  acceptText: {
    marginTop: theme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
  chatButton: {
    marginTop: theme.spacing.lg,
  },
});