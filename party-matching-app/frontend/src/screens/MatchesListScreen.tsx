import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function MatchesListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matches</Text>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={<Text style={styles.empty}>No matches yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  empty: { textAlign: 'center', marginTop: 32, color: '#999' }
});