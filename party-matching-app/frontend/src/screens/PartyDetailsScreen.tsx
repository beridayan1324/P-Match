import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../theme/theme';
import { apiClient } from '../services/api';

export default function PartyDetailsScreen({ route, navigation }: any) {
  const { party } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [joined, setJoined] = React.useState(false);

  const onJoin = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      await apiClient.post(
        `/api/party/${party.id}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJoined(true);
      Alert.alert('Success', 'You joined the party!');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image
            source={{ uri: party.image || 'https://via.placeholder.com/400x300' }}
            style={styles.headerImage}
          />
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{party.name}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={24} color={theme.colors.primary} />
              <Text style={styles.infoText}>{party.location}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={24} color={theme.colors.secondary} />
              <Text style={styles.infoText}>{new Date(party.date).toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attendees</Text>
            <View style={styles.avatarRow}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} style={styles.attendeeAvatar}>
                  <Ionicons name="person" size={16} color={theme.colors.white} />
                </View>
              ))}
              <View style={styles.moreAvatars}>
                <Text style={styles.moreText}>+18</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              Join us for an amazing night of music, dancing, and meeting new people. This is the
              perfect opportunity to make new friends and potentially find your perfect match!
            </Text>
          </View>

          <PrimaryButton
            title={joined ? 'Joined ✓' : 'Join Party'}
            onPress={onJoin}
            loading={loading}
            disabled={joined}
          />
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
  headerImage: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.bg,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  moreAvatars: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: theme.colors.textLight,
    lineHeight: 22,
  },
});