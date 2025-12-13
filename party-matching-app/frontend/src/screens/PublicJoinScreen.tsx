import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';
import PrimaryButton from '../components/PrimaryButton';
import InputField from '../components/InputField';
import { Ionicons } from '@expo/vector-icons';

export default function PublicJoinScreen({ route, navigation }: any) {
  const { partyId } = route.params || {}; // Should be passed via deep link or navigation
  const [party, setParty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [inputPartyId, setInputPartyId] = useState('');

  useEffect(() => {
    if (partyId) {
      setLoading(true);
      loadParty(partyId);
    }
  }, [partyId]);

  const loadParty = async (id: string) => {
    try {
      const response = await partyAPI.getPublicPartyDetails(id);
      setParty(response.data);
    } catch (error) {
      console.error('Failed to load party', error);
      Alert.alert('Error', 'Failed to load party details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      await partyAPI.joinPartyPublic(partyId, name, email);
      setSuccess(true);
    } catch (error: any) {
      console.error('Join failed', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to join party');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!partyId && !party) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.formTitle}>Enter Party ID</Text>
          <Text style={styles.formSubtitle}>Enter the ID from your invite link</Text>
          
          <InputField 
            label="Party ID"
            value={inputPartyId}
            onChangeText={setInputPartyId}
            placeholder="e.g. 123e4567-e89b..."
            icon="key-outline"
            style={styles.largeInput}
          />
          
          <PrimaryButton 
            title="Load Party" 
            onPress={() => {
                if (inputPartyId) {
                    navigation.setParams({ partyId: inputPartyId });
                }
            }} 
            style={{ width: '100%' }}
          />
          
          <PrimaryButton 
            title="Go Back" 
            onPress={() => navigation.goBack()} 
            style={{ marginTop: 10, backgroundColor: theme.colors.secondary, width: '100%' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!party && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>Party not found</Text>
          <PrimaryButton title="Try Again" onPress={() => navigation.setParams({ partyId: null })} />
        </View>
      </SafeAreaView>
    );
  }

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
          <Text style={styles.successTitle}>Ticket Sent!</Text>
          <Text style={styles.successText}>
            We've sent your ticket to {email}. Please check your inbox.
          </Text>
          <PrimaryButton 
            title="Done" 
            onPress={() => navigation.navigate('Welcome')} 
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {party.imageUrl && (
          <Image source={{ uri: party.imageUrl }} style={styles.image} resizeMode="cover" />
        )}
        
        <View style={styles.card}>
          <Text style={styles.partyName}>{party.name}</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={theme.colors.textLight} />
            <Text style={styles.infoText}>
              {new Date(party.date).toLocaleDateString()} at {new Date(party.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={theme.colors.textLight} />
            <Text style={styles.infoText}>{party.location}</Text>
          </View>

          <Text style={styles.description}>{party.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.formTitle}>Get Your Ticket</Text>
          <Text style={styles.formSubtitle}>No account required</Text>

          <InputField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            icon="person-outline"
            style={styles.largeInput}
          />

          <InputField
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            style={styles.largeInput}
          />

          <PrimaryButton
            title={submitting ? "Sending Ticket..." : "Get Ticket"}
            onPress={handleJoin}
            disabled={submitting}
            style={{ marginTop: 20 }}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 200,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
    minHeight: 500,
    ...theme.shadows.card,
  },
  partyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.textLight,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 5,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.error,
    marginBottom: 20,
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.success,
    marginTop: 20,
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  largeInput: {
    paddingVertical: 18,
    fontSize: 18,
  },
});
