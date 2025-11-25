import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function PartyDetailsScreen({ route, navigation }: any) {
  const party = route.params?.party;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{party?.name}</Text>
      <Text>{party?.location} — {new Date(party?.date).toLocaleString()}</Text>
      <View style={{ marginTop: 24 }}>
        <Button title="Join Party" onPress={() => alert('Joined!')} />
        <View style={{ height: 12 }} />
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 }
});