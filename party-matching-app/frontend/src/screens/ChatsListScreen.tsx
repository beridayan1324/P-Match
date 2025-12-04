import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { chatAPI } from '../services/api';
import { useIsFocused } from '@react-navigation/native';

export default function ChatsListScreen({ navigation }: any) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState('');
  const isFocused = useIsFocused(); // Reloads when screen comes into focus

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (isFocused && currentUserId) {
      loadChats();
    }
  }, [isFocused, currentUserId]);

  const loadCurrentUser = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUserId(user.id);
    }
  };

  const loadChats = async () => {
    try {
      const response = await chatAPI.getChats();
      setChats(response.data.chats || []);
    } catch (error) {
      console.error('Failed to load chats', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChat = ({ item }: any) => {
    // Determine which user is "the other person"
    const otherUser = item.user1Id === currentUserId ? item.user2 : item.user1;
    const lastMessage = item.messages && item.messages.length > 0 ? item.messages[0] : null;

    return (
      <TouchableOpacity 
        style={styles.chatCard}
        onPress={() => navigation.navigate('Chat', { 
          matchId: item.id, 
          otherUser: otherUser 
        })}
      >
        <Image 
          source={{ uri: otherUser?.profileImage || 'https://via.placeholder.com/60' }}
          style={styles.avatar}
        />
        <View style={styles.chatInfo}>
          <View style={styles.topRow}>
            <Text style={styles.chatName}>{otherUser?.name || 'Unknown'}</Text>
            {lastMessage && (
              <Text style={styles.timeText}>
                {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>
          
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessage ? lastMessage.text : 'התחל שיחה!'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>הודעות</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChat}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>אין הודעות עדיין</Text>
              <Text style={styles.emptySubtext}>הצטרף למסיבות כדי למצוא התאמות!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  list: { padding: 16 },
  chatCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#eee' },
  chatInfo: { flex: 1, marginRight: 8 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'right' },
  timeText: { fontSize: 12, color: '#999' },
  lastMessage: { fontSize: 14, color: '#666', textAlign: 'right' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 8 },
});