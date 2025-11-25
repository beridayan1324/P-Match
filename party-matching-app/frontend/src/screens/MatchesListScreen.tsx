import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export default function MatchesListScreen({ navigation }: any) {
  const matches = [
    { id: 1, name: 'Sarah Johnson', lastMessage: 'Hey! Looking forward to the party 🎉', time: '2m ago', unread: true },
    { id: 2, name: 'Emma Davis', lastMessage: 'That sounds great!', time: '1h ago', unread: false },
    { id: 3, name: 'Jessica Wilson', lastMessage: 'See you there! 😊', time: '3h ago', unread: false },
  ];

  const renderMatch = ({ item, index }: any) => (
    <View>
      <TouchableOpacity style={styles.matchCard} activeOpacity={0.7}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/60' }}
            style={styles.avatar}
          />
          {item.unread && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.matchInfo}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchName}>{item.name}</Text>
            <Text style={styles.matchTime}>{item.time}</Text>
          </View>
          <Text style={[styles.matchMessage, item.unread && styles.unreadMessage]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={theme.colors.textLight} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Matches</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMatch}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>💔</Text>
            <Text style={styles.emptyTitle}>No matches yet</Text>
            <Text style={styles.emptyText}>Start swiping to find your perfect match!</Text>
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.card,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.bg,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  matchTime: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  matchMessage: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  unreadMessage: {
    fontWeight: '600',
    color: theme.colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});