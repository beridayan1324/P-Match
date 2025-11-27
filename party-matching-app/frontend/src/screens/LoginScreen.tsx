import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../theme/theme';
import { authAPI } from '../services/api';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // TEMPORARY: Clear storage function
  const clearStorage = async () => {
    await AsyncStorage.clear();
    Alert.alert('Storage Cleared', 'Please login again');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login(email, password);

      console.log('Login response:', response);
      console.log('User data:', response.user);
      console.log('isAdmin:', response.user.isAdmin);

      navigation.replace('PartyList');
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* TEMPORARY DEBUG BUTTON - REMOVE LATER */}
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: 'red', margin: 10 }}
        onPress={clearStorage}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Clear Storage (Debug)</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.form}>
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

            <PrimaryButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}>
                Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    padding: theme.spacing.lg,
    justifyContent: 'center',
    minHeight: '100%',
  },
  content: {
    flex: 1,
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
  loginButton: {
    marginTop: theme.spacing.md,
  },
  signupText: {
    textAlign: 'center',
    color: theme.colors.textLight,
    marginTop: theme.spacing.lg,
  },
  signupLink: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});