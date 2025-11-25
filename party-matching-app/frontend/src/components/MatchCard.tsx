import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  user: any;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function MatchCard({ user }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: user.profileImage || 'https://via.placeholder.com/400' }}
        style={styles.image}
      />
      <View style={styles.overlay}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{user.name}, 25</Text>
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Ionicons name="musical-notes" size={12} color={theme.colors.white} />
              <Text style={styles.tagText}>Music Lover</Text>
            </View>
            <View style={styles.tag}>
              <Ionicons name="beer" size={12} color={theme.colors.white} />
              <Text style={styles.tagText}>Party Animal</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - 40,
    height: 500,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.card,
    backgroundColor: theme.colors.white,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  infoContainer: {
    gap: theme.spacing.sm,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.white,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.lg,
    gap: 4,
  },
  tagText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
});