import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

const MatchPreviewScreen = ({ route, navigation }) => {
    const { matchDetails } = route.params;

    const handleAccept = () => {
        // Call API to accept the match
    };

    const handleDecline = () => {
        // Call API to decline the match
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: matchDetails.profileImage }} style={styles.image} />
            <Text style={styles.name}>{matchDetails.name}</Text>
            <Text style={styles.details}>Gender: {matchDetails.gender}</Text>
            <Text style={styles.details}>Preferences: {matchDetails.preferences}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Accept" onPress={handleAccept} />
                <Button title="Decline" onPress={handleDecline} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    details: {
        fontSize: 16,
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
});

export default MatchPreviewScreen;