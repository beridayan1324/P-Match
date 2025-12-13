import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';

export default function PartyDetailsScreen({ route, navigation }: any) {
  const { party } = route.params;
  const [participants, setParticipants] = useState<any[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [hasJoined, setHasJoined] = useState(party.hasJoined || false);
  const [isOptedIn, setIsOptedIn] = useState(party.isOptedIn || false);
  const [ticketCode, setTicketCode] = useState(party.ticketCode || null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    loadPartyDetails();
    loadParticipants();
    loadUserData();
    updateCountdown();
    
    const countdownInterval = setInterval(updateCountdown, 1000);
    const dataInterval = setInterval(loadParticipants, 5000); // Refresh participants every 5 seconds

    return () => {
      clearInterval(countdownInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const loadPartyDetails = async () => {
    try {
      const response = await partyAPI.getPartyDetails(party.id);
      const updatedParty = response.data;
      setHasJoined(updatedParty.hasJoined);
      setIsOptedIn(updatedParty.isOptedIn);
      setTicketCode(updatedParty.ticketCode);
    } catch (error) {
      console.error('Failed to load party details', error);
    }
  };

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      console.log('User Data:', userData); // Debug log
      if (userData) {
        const user = JSON.parse(userData);
        const isManagerUser = user.role === 'manager' || user.role === 'admin';
        console.log('Is Manager:', isManagerUser); // Debug log
        setIsManager(isManagerUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setRoleLoaded(true);
    }
  };

  const loadParticipants = async () => {
    try {
      const response = await partyAPI.getParticipants(party.id, true);
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
      setCountdown(`השידוכים מתחילים בעוד ${hours} שעות ו-${minutes} דקות`);
    } else if (now >= matchingStart && now < partyStart) {
      // Matching active
      setCountdown('השידוכים פעילים - צפה בהתאמות שלך!');
    } else {
      // Party ended
      setCountdown('המסיבה הסתיימה');
    }
  };

  const handleJoinParty = async () => {
    try {
      setLoading(true);
      const response = await partyAPI.joinParty(party.id);
      setHasJoined(true);
      setTicketCode(response.data.participant.ticketCode);
      loadParticipants(); // Refresh participant list
      Alert.alert('Success', 'Ticket purchased successfully!');
    } catch (error: any) {
      console.error('Failed to join party', error);
      
      if (error.response?.status === 400) {
        const message = error.response.data.message;
        if (message.includes('Profile incomplete')) {
          Alert.alert(
            'Complete Profile',
            'Please complete your profile before joining.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Go to Profile', onPress: () => navigation.navigate('Profile') },
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

  const handleToggleMatching = async () => {
    try {
        setLoading(true);
        const newStatus = !isOptedIn;
        await partyAPI.toggleMatchingStatus(party.id, newStatus);
        setIsOptedIn(newStatus);
        // Small delay to ensure DB update is propagated
        setTimeout(() => loadParticipants(), 200);
        Alert.alert('Success', newStatus ? 'You have joined the matching pool!' : 'You have left the matching pool.');
    } catch (error: any) {
        Alert.alert('Error', error.response?.data?.message || 'Failed to update matching status');
    } finally {
        setLoading(false);
    }
  };

  const handleViewMatches = () => {
    navigation.navigate('MatchesList', { partyId: party.id });
  };

  const isMatchingActive = party.matchingStarted;
  const now = new Date().getTime();
  const matchingStart = new Date(party.matchingStartTime).getTime();
  const canViewMatches = isMatchingActive || now >= matchingStart;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>פרטי מסיבה</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-forward" size={24} color={theme.colors.text} />
        </TouchableOpacity>
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
            <Text style={styles.detailText}>{party.location}</Text>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailText}>
              {new Date(party.date).toLocaleString('he-IL')}
            </Text>
            <Ionicons name="calendar" size={20} color={theme.colors.primary} />
          </View>

          {party.ticketPrice !== undefined && (
            <View style={styles.detailRow}>
                <Text style={[styles.detailText, { fontWeight: 'bold', color: theme.colors.primary }]}>
                    {party.ticketPrice > 0 ? `₪${party.ticketPrice}` : 'Free'}
                </Text>
                <Ionicons name="pricetag" size={20} color={theme.colors.primary} />
            </View>
          )}

          {party.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>אודות</Text>
              <Text style={styles.descriptionText}>{party.description}</Text>
            </View>
          )}
        </View>

        {/* Countdown */}
        <View style={styles.countdownCard}>
          <Text style={[
            styles.countdownText,
            isMatchingActive && styles.countdownTextActive
          ]}>
            {countdown}
          </Text>
          <Ionicons 
            name={isMatchingActive ? "checkmark-circle" : "timer"} 
            size={24} 
            color={isMatchingActive ? theme.colors.success : theme.colors.primary} 
          />
        </View>

        {/* Participants */}
        <View style={styles.participantsCard}>
          <Text style={styles.sectionTitle}>
            {totalParticipants} {totalParticipants === 1 ? 'אדם' : 'אנשים'} הצטרפו
          </Text>
          
          {totalParticipants >= 6 ? (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>מוכן לשידוכים!</Text>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
            </View>
          ) : (
            <View style={[styles.statusBadge, styles.statusBadgeWarning]}>
              <Text style={[styles.statusText, styles.statusTextWarning]}>
                צריך עוד {6 - totalParticipants} לשידוכים
              </Text>
              <Ionicons name="alert-circle" size={16} color={theme.colors.warning} />
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
                  <Text style={styles.participantName}>עוד</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!roleLoaded ? (
             <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : !isManager && !hasJoined ? (
            <PrimaryButton
              title={`Buy Ticket ${party.ticketPrice > 0 ? `(₪${party.ticketPrice})` : '(Free)'}`}
              onPress={handleJoinParty}
              loading={loading}
              icon="card-outline"
            />
          ) : !isManager && hasJoined ? (
            <>
              <View style={styles.joinedBadge}>
                <Text style={styles.joinedText}>You have a ticket!</Text>
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
              </View>
              
              <PrimaryButton
                title={isOptedIn ? "Leave Matching Pool" : "Join Matching Pool"}
                onPress={handleToggleMatching}
                loading={loading}
                icon={isOptedIn ? "close-circle-outline" : "heart-outline"}
                style={{ marginTop: 10, backgroundColor: isOptedIn ? theme.colors.textLight : theme.colors.primary }}
              />

              {canViewMatches && isOptedIn && (
                <PrimaryButton
                  title="View Matches"
                  onPress={handleViewMatches}
                  icon="people"
                  style={styles.matchesButton}
                />
              )}

              <PrimaryButton
                title="View Ticket"
                onPress={() => navigation.navigate('TicketScreen', { 
                    ticketCode: ticketCode || party.ticketCode, 
                    partyName: party.name,
                    partyDate: party.date,
                    location: party.location
                })}
                style={{ marginTop: 10, backgroundColor: theme.colors.secondary }}
                icon="qr-code-outline"
              />
            </>
          ) : null}

          {isManager && (
            <PrimaryButton
              title="Scan Tickets"
              onPress={() => navigation.navigate('ScannerScreen', { partyId: party.id })}
              style={{ marginTop: 10, backgroundColor: theme.colors.text }}
              icon="scan-outline"
            />
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
    textAlign: 'right', // RTL
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // RTL
    marginBottom: theme.spacing.sm,
  },
  detailText: {
    marginRight: theme.spacing.sm, // Changed from marginLeft
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
    textAlign: 'right', // RTL
  },
  descriptionText: {
    fontSize: 15,
    color: theme.colors.textLight,
    lineHeight: 22,
    textAlign: 'right', // RTL
  },
  countdownCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // RTL
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  countdownText: {
    marginRight: theme.spacing.sm, // Changed from marginLeft
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    flex: 1,
    textAlign: 'right', // RTL
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
    textAlign: 'right', // RTL
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // RTL
    backgroundColor: '#E8F8F5',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-end', // RTL
    marginBottom: theme.spacing.md,
  },
  statusBadgeWarning: {
    backgroundColor: '#FFF3CD',
  },
  statusText: {
    marginRight: theme.spacing.xs, // Changed from marginLeft
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.success,
  },
  statusTextWarning: {
    color: '#856404',
  },
  participantsList: {
    flexDirection: 'row-reverse', // RTL
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
    marginRight: theme.spacing.sm, // Changed from marginLeft
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.success,
  },
  matchesButton: {
    marginTop: theme.spacing.sm,
  },
});