import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface Props {
  party: any;
  onPress: () => void;
  index: number;
}

export default function PartyCard({ party, onPress }: Props) {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.9}>
        <Image
          source={{ uri: party.image || 'https://via.placeholder.com/400x200' }}
          style={styles.image}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{party.name}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="location" size={16} color={theme.colors.primary} />
            <Text style={styles.infoText}>{party.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={16} color={theme.colors.primary} />
            <Text style={styles.infoText}>{new Date(party.date).toLocaleDateString()}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarStack}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={[styles.avatar, { marginLeft: i > 1 ? -8 : 0 }]}>
                    <Ionicons name="person" size={12} color={theme.colors.white} />
                  </View>
                ))}
              </View>
              <Text style={styles.attendees}>24+ attending</Text>
            </View>
            
            <View style={styles.joinButton}>
              <Text style={styles.joinText}>Join</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.colors.white} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.card,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: theme.colors.bg,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    marginLeft: theme.spacing.sm,
    fontSize: 14,
    color: theme.colors.textLight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  attendees: {
    marginLeft: theme.spacing.sm,
    fontSize: 12,
    color: theme.colors.textLight,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.lg,
  },
  joinText: {
    color: theme.colors.white,
    fontWeight: '600',
    marginRight: 4,
  },
});