import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../theme/theme';

const API_URL = 'http://10.0.0.15:5000';

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting signup with:', { email, name, gender });
      console.log('URL:', `${API_URL}/api/auth/register`);
      
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        name,
        gender,
      });

      console.log('Signup response:', response.data);

      if (response.data.token && response.data.user) {
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      navigation.replace('PartyList');
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      Alert.alert('Error', error?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the party!</Text>

        <View style={styles.form}>
          <InputField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            icon="person"
          />

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            icon="lock-closed"
          />

          <View style={styles.genderContainer}>
            <Text style={styles.genderLabel}>Gender</Text>
            <View style={styles.genderButtons}>
              {['male', 'female', 'other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderButton, gender === g && styles.genderButtonActive]}
                  onPress={() => setGender(g as any)}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <PrimaryButton
            title="Sign Up"
            onPress={handleSignup}
            loading={loading}
            style={styles.signupButton}
          />

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </TouchableOpacity>
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
  content: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xxl,
  },
  form: {
    gap: theme.spacing.md,
  },
  genderContainer: {
    marginVertical: theme.spacing.sm,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  genderText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  genderTextActive: {
    color: theme.colors.white,
  },
  signupButton: {
    marginTop: theme.spacing.md,
  },
  loginText: {
    textAlign: 'center',
    color: theme.colors.textLight,
    marginTop: theme.spacing.lg,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});