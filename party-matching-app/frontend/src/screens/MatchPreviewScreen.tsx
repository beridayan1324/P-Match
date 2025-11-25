import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MatchPreviewScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Match Preview</Text>
      <View style={styles.card}>
        <Text>👤 Match Profile</Text>
      </View>
      <View style={styles.buttons}>
        <Button title="❤️ Accept" onPress={() => alert('Accepted!')} />
        <View style={{ width: 12 }} />
        <Button title="✕ Skip" onPress={() => alert('Skipped')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  card: { backgroundColor: '#f0f0f0', padding: 24, borderRadius: 12, marginBottom: 24, alignItems: 'center' },
  buttons: { flexDirection: 'row', justifyContent: 'space-around' }
});