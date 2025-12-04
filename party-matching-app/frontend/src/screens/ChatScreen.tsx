import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { chatAPI } from '../services/api'; // <--- Import the helper object
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen({ route, navigation }: any) {
  const { matchId, otherUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      await loadUser();
      // Initial load
      await loadMessages();
    };
    init();

    // Polling loop
    const interval = setInterval(() => {
      if (isMounted) loadMessages(true); // true = silent load (no loading spinner)
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem('userData');
    if (userData) setCurrentUserId(JSON.parse(userData).id);
  };

  const loadMessages = async (silent = false) => {
    if (!silent && messages.length === 0) setLoading(true);
    try {
      // FIX: Use the helper method, not .get()
      const res = await chatAPI.getMessages(matchId);
      setMessages(res.data.messages);
    } catch (error) {
      console.log('Chat load error:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const textToSend = inputText;
    setInputText(''); // Clear immediately for better UX

    try {
      // FIX: Use the helper method, not .post()
      await chatAPI.sendMessage(matchId, textToSend);
      loadMessages(true); // Reload messages to see the new one
    } catch (error) {
      console.error('Send error:', error);
      alert('Failed to send message');
      setInputText(textToSend); // Put text back if failed
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{otherUser.name}</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item: any) => item.id}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          renderItem={({ item }: any) => (
            <View style={[
              styles.messageBubble,
              item.senderId === currentUserId ? styles.myMessage : styles.theirMessage
            ]}>
              <Text style={item.senderId === currentUserId ? styles.myText : styles.theirText}>
                {item.text}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No messages yet. Say hi!</Text>
          }
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 15, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', elevation: 2 },
  backButton: { color: '#007AFF', fontSize: 16, marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  messageBubble: { padding: 10, borderRadius: 15, margin: 5, maxWidth: '80%' },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#007AFF' },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#E5E5EA' },
  myText: { color: 'white' },
  theirText: { color: 'black' },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: 'white' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10 },
  sendButton: { justifyContent: 'center', paddingHorizontal: 15 },
  sendText: { color: '#007AFF', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});