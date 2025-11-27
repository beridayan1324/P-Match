import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';

export default function PartyDetailsScreen({ route, navigation }: any) {
  const { party } = route.params;
  const [participants, setParticipants] = useState<any[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [hasJoined, setHasJoined] = useState(party.hasJoined || false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    loadParticipants();
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadParticipants = async () => {
    try {
      const response = await partyAPI.getParticipants(party.id);
      setParticipants(response.data.participants.slice(0, 3)); // Only first 3
      setTotalParticipants(response.data.total);
    } catch (error) {
      console.error('Failed to load participants', error);
    }
  };

  const updateCountdown = () => {
    if (!party.matchingStartTime) return;

    const now = new Date().getTime();
    const matchingStart = new Date(party.matchingStartTime).getTime();
    const partyStart = new Date(party.date).getTime();

    if (now < matchingStart) {
      // Before matching starts
      const distance = matchingStart - now;
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown(`Matching starts in ${hours}h ${minutes}m`);
    } else if (now >= matchingStart && now < partyStart) {
      // Matching active
      setCountdown('Matching active - View your matches!');
    } else {
      // Party ended
      setCountdown('Party ended');
    }
  };

  const handleJoinParty = async () => {
    try {
      setLoading(true);
      await partyAPI.joinParty(party.id);
      setHasJoined(true);
      loadParticipants(); // Refresh participant list
      Alert.alert('Success', 'You joined the party! Matching will start 24h before the event.');
    } catch (error: any) {
      console.error('Failed to join party', error);
      
      if (error.response?.status === 400) {
        const message = error.response.data.message;
        if (message.includes('Profile incomplete')) {
          Alert.alert(
            'Complete Your Profile',
            'Please complete your profile before joining a party.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Complete Profile', onPress: () => navigation.navigate('Profile') },
            ]
          );
        } else {
          Alert.alert('Error', message);
        }
      } else {
        Alert.alert('Error', 'Failed to join party');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatches = () => {
    navigation.navigate('MatchesList', { partyId: party.id }); // Changed from 'Matches' to 'MatchesList'
  };

  const isMatchingActive = party.matchingStarted;
  const now = new Date().getTime();
  const matchingStart = new Date(party.matchingStartTime).getTime();
  const canViewMatches = isMatchingActive || now >= matchingStart;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Party Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Party Image */}
        <Image 
          source={{ uri: party.image || 'https://via.placeholder.com/400x200' }}
          style={styles.partyImage}
        />

        {/* Party Info */}
        <View style={styles.infoCard}>
          <Text style={styles.partyName}>{party.name}</Text>

          <View style={styles.detailRow}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Text style={styles.detailText}>{party.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary} />
            <Text style={styles.detailText}>
              {new Date(party.date).toLocaleString()}
            </Text>
          </View>

          {party.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>About</Text>
              <Text style={styles.descriptionText}>{party.description}</Text>
            </View>
          )}
        </View>

        {/* Countdown */}
        <View style={styles.countdownCard}>
          <Ionicons 
            name={isMatchingActive ? "checkmark-circle" : "timer"} 
            size={24} 
            color={isMatchingActive ? theme.colors.success : theme.colors.primary} 
          />
          <Text style={[
            styles.countdownText,
            isMatchingActive && styles.countdownTextActive
          ]}>
            {countdown}
          </Text>
        </View>

        {/* Participants */}
        <View style={styles.participantsCard}>
          <Text style={styles.sectionTitle}>
            {totalParticipants} {totalParticipants === 1 ? 'Person' : 'People'} Joined
          </Text>
          
          {totalParticipants >= 6 ? (
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.statusText}>Ready for matching!</Text>
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.statusBadgeWarning]}>
              <Ionicons name="alert-circle" size={16} color={theme.colors.warning} />
              <Text style={[styles.statusText, styles.statusTextWarning]}>
                Need {6 - totalParticipants} more for matching
              </Text>
            </View>
          )}

          {participants.length > 0 && (
            <View style={styles.participantsList}>
              {participants.map((participant, index) => (
                <View key={participant.id} style={styles.participantItem}>
                  {participant.profileImage ? (
                    <Image 
                      source={{ uri: participant.profileImage }} 
                      style={styles.participantAvatar}
                    />
                  ) : (
                    <View style={styles.participantAvatarPlaceholder}>
                      <Ionicons name="person" size={24} color={theme.colors.textLight} />
                    </View>
                  )}
                  <Text style={styles.participantName}>{participant.name}</Text>
                </View>
              ))}
              
              {totalParticipants > 3 && (
                <View style={styles.participantItem}>
                  <View style={styles.participantAvatarMore}>
                    <Text style={styles.participantMoreText}>+{totalParticipants - 3}</Text>
                  </View>
                  <Text style={styles.participantName}>more</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!hasJoined ? (
            <PrimaryButton
              title="Join Matching"
              onPress={handleJoinParty}
              loading={loading}
              icon="add-circle"
            />
          ) : (
            <>
              <View style={styles.joinedBadge}>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                <Text style={styles.joinedText}>You've joined this party!</Text>
              </View>
              
              {canViewMatches && (
                <PrimaryButton
                  title="View Matches"
                  onPress={handleViewMatches}
                  icon="people"
                  style={styles.matchesButton}
                />
              )}
            </>
          )}
        </View>
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
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  partyImage: {
    width: '100%',
    height: 250,
    backgroundColor: theme.colors.bg,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    marginTop: -theme.spacing.lg,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
  partyName: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  descriptionContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  descriptionText: {
    fontSize: 15,
    color: theme.colors.textLight,
    lineHeight: 22,
  },
  countdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  countdownText: {
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    flex: 1,
  },
  countdownTextActive: {
    color: theme.colors.success,
  },
  participantsCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F5',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  statusBadgeWarning: {
    backgroundColor: '#FFF3CD',
  },
  statusText: {
    marginLeft: theme.spacing.xs,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.success,
  },
  statusTextWarning: {
    color: '#856404',
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  participantItem: {
    alignItems: 'center',
    width: 70,
  },
  participantAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.bg,
    marginBottom: theme.spacing.xs,
  },
  participantAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  participantAvatarMore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  participantMoreText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.white,
  },
  participantName: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: theme.spacing.lg,
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F8F5',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  joinedText: {
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.success,
  },
  matchesButton: {
    marginTop: theme.spacing.sm,
  },
});