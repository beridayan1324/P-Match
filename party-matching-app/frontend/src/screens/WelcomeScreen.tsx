import React from 'react';
import { View, Text, Button, StyleSheet, ImageBackground } from 'react-native';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>💕 P-Match</Text>
        <Text style={styles.tagline}>Find your perfect party match</Text>
      </View>
      <View style={styles.buttons}>
        <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
        <View style={{ height: 12 }} />
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', padding: 24, backgroundColor: '#f8f8f8' },
  content: { alignItems: 'center', marginTop: 60 },
  logo: { fontSize: 48, marginBottom: 16 },
  tagline: { fontSize: 18, color: '#666', textAlign: 'center' },
  buttons: { marginBottom: 32 }
});