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
          renderItem={({ item }: any) => {
            const isMe = item.senderId === currentUserId;
            const timeString = new Date(item.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            });

            return (
              <View style={[
                styles.messageWrapper,
                isMe ? styles.myWrapper : styles.theirWrapper
              ]}>
                <View style={[
                  styles.messageBubble,
                  isMe ? styles.myMessage : styles.theirMessage
                ]}>
                  <Text style={isMe ? styles.myText : styles.theirText}>
                    {item.text}
                  </Text>
                  <Text style={[styles.timestamp, isMe ? styles.myTimestamp : styles.theirTimestamp]}>
                    {timeString}
                  </Text>
                </View>
              </View>
            );
          }}
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
  container: { flex: 1, backgroundColor: '#f0f2f5' }, // Slightly darker bg to make white bubbles pop
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 15, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', elevation: 2 },
  backButton: { color: '#007AFF', fontSize: 16, marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  
  // --- UPDATED MESSAGE STYLES ---
  
  messageWrapper: { 
    width: '100%', 
    flexDirection: 'row', 
    marginBottom: 10,
    paddingHorizontal: 10
  },
  
  // YOU (Sender) -> Left side
  myWrapper: { 
    justifyContent: 'flex-start' 
  },
  
  // THEM (Receiver) -> Right side
  theirWrapper: { 
    justifyContent: 'flex-end' 
  },
  
  messageBubble: { 
    padding: 12, 
    borderRadius: 15, 
    maxWidth: '75%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  
  // YOU -> Blue
  myMessage: { 
    backgroundColor: '#007AFF', 
    borderTopLeftRadius: 2 
  },
  
  // THEM -> White
  theirMessage: { 
    backgroundColor: '#FFFFFF', 
    borderTopRightRadius: 2
  },
  
  // Text Colors
  myText: { color: 'white', fontSize: 16 },
  theirText: { color: 'black', fontSize: 16 },
  
  // Timestamps
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  myTimestamp: { color: 'rgba(255,255,255, 0.7)' },
  theirTimestamp: { color: '#999' },

  // --- INPUT STYLES ---
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: 'white', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, maxHeight: 100 },
  sendButton: { justifyContent: 'center', paddingHorizontal: 15 },
  sendText: { color: '#007AFF', fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' }
});