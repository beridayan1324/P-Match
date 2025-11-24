import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { fetchParties, joinParty } from '../services/api';

const PartyListScreen = () => {
  const [parties, setParties] = useState([]);

  useEffect(() => {
    const getParties = async () => {
      const data = await fetchParties();
      setParties(data);
    };

    getParties();
  }, []);

  const handleJoinParty = async (partyId) => {
    await joinParty(partyId);
    // Optionally refresh the party list or show a success message
  };

  const renderPartyItem = ({ item }) => (
    <View style={styles.partyItem}>
      <Text style={styles.partyName}>{item.name}</Text>
      <Text>{item.date}</Text>
      <Text>{item.location}</Text>
      <Button title="Join Party" onPress={() => handleJoinParty(item._id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Parties</Text>
      <FlatList
        data={parties}
        renderItem={renderPartyItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  partyItem: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  partyName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PartyListScreen;