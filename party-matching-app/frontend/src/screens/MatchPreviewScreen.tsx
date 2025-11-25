import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MatchCard from '../components/MatchCard';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function MatchPreviewScreen({ navigation }: any) {
  const [users, setUsers] = React.useState([
    { id: 1, name: 'Sarah', profileImage: null },
    { id: 2, name: 'Emma', profileImage: null },
    { id: 3, name: 'Jessica', profileImage: null },
  ]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleSwipeLeft = () => {
    console.log('Skipped');
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    console.log('Liked');
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (currentIndex >= users.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>That's everyone for now!</Text>
          <Text style={styles.emptyText}>Check back later for more matches</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.cardContainer}>
        <MatchCard
          key={users[currentIndex].id}
          user={users[currentIndex]}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSwipeLeft} style={[styles.button, styles.skipButton]}>
          <Ionicons name="close" size={32} color={theme.colors.error} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSwipeRight} style={[styles.button, styles.likeButton]}>
          <Ionicons name="heart" size={32} color={theme.colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.superButton]}>
          <Ionicons name="star" size={28} color={theme.colors.secondary} />
        </TouchableOpacity>
      </View>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.button,
  },
  skipButton: {
    backgroundColor: theme.colors.white,
  },
  likeButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.primary,
  },
  superButton: {
    backgroundColor: theme.colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});