import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';

export default function ScannerScreen({ route, navigation }: any) {
  const { partyId } = route.params;
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleTicketValidation = async (code: string) => {
    setScanned(true);
    try {
        // Call backend to validate ticket
        const response = await partyAPI.scanTicket(partyId, code);
        
        let message = response.data.message || 'Ticket verified successfully!';
        if (response.data.user) {
            message += `\n\nGuest: ${response.data.user.name || 'Guest'}\nEmail: ${response.data.user.email || 'N/A'}`;
        }

        Alert.alert('Success', message, [
            { text: 'OK', onPress: () => { setScanned(false); setManualCode(''); } }
        ]);
    } catch (error: any) {
        Alert.alert('Error', error.response?.data?.message || 'Invalid ticket', [
            { text: 'OK', onPress: () => setScanned(false) }
        ]);
    }
  };

  const handleBarCodeScanned = ({ type, data }: any) => {
      handleTicketValidation(data);
  };

  const handleManualSubmit = () => {
      if (!manualCode.trim()) return;
      handleTicketValidation(manualCode.trim());
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
    >
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      {scanned && (
        <View style={styles.rescanContainer}>
            <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
        </View>
      )}
      
      <View style={styles.manualEntryContainer}>
        <Text style={styles.overlayText}>Scan QR or Enter Code:</Text>
        <View style={styles.inputRow}>
            <TextInput 
                style={styles.input}
                placeholder="Enter Ticket Code"
                placeholderTextColor="#999"
                value={manualCode}
                onChangeText={setManualCode}
                autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.verifyButton} onPress={handleManualSubmit}>
                <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rescanContainer: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 20,
    borderRadius: 10,
  },
  manualEntryContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  verifyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
});
