import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>💕</Text>
          <Text style={styles.title}>P-Match</Text>
          <Text style={styles.subtitle}>Find your perfect party match</Text>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Get Started"
            onPress={() => navigation.navigate('Signup')}
            style={styles.button}
          />
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              Login
            </Text>
          </Text>
        </View>

        <View style={[styles.shape, styles.shape1]} />
        <View style={[styles.shape, styles.shape2]} />
        <View style={[styles.shape, styles.shape3]} />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: theme.spacing.lg,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.white,
  },
  loginText: {
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: 14,
  },
  loginLink: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  shape: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: theme.borderRadius.full,
  },
  shape1: {
    width: 100,
    height: 100,
    top: 100,
    left: -30,
  },
  shape2: {
    width: 150,
    height: 150,
    top: 200,
    right: -50,
  },
  shape3: {
    width: 80,
    height: 80,
    bottom: 150,
    left: 50,
  },
});