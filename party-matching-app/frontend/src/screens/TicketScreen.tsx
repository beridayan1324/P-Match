import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export default function TicketScreen({ route, navigation }: any) {
  const { ticketCode, partyName, partyDate, location } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={30} color={theme.colors.white} />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>{partyName}</Text>
        <Text style={styles.date}>{new Date(partyDate).toLocaleDateString()}</Text>
        <Text style={styles.location}>{location}</Text>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={ticketCode}
            size={200}
          />
        </View>
        
        <Text style={styles.code}>{ticketCode}</Text>
        <Text style={styles.instruction}>Show this code at the entrance</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    ...theme.shadows.card,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginBottom: 30,
  },
  qrContainer: {
    marginBottom: 30,
  },
  code: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  instruction: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
});
