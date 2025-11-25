import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../theme/theme';
import { apiClient } from '../services/api';

export default function SignupScreen({ navigation }: any) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post('/api/auth/signup', { name, email, password, gender });
      await AsyncStorage.setItem('authToken', res.data.token);
      navigation.replace('PartyList');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the best party matching platform</Text>
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            icon="person"
          />

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            icon="mail"
            keyboardType="email-address"
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            icon="lock-closed"
            secureTextEntry
          />

          <View style={styles.genderContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderButtons}>
              {['male', 'female', 'other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={[styles.genderButton, gender === g && styles.genderButtonActive]}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <PrimaryButton title="Sign Up" onPress={onSignup} loading={loading} />

          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              Login
            </Text>
          </Text>
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
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xl,
  },
  formContainer: {
    gap: theme.spacing.md,
  },
  genderContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
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
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  genderButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  genderText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  genderTextActive: {
    color: theme.colors.white,
  },
  loginText: {
    textAlign: 'center',
    color: theme.colors.textLight,
    marginTop: theme.spacing.md,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});