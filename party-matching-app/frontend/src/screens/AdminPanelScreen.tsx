import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../theme/theme';
import { partyAPI } from '../services/api';

export default function AdminPanelScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [expenses, setExpenses] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setImage(imageUri);
    }
  };

  const handleCreateParty = async () => {
    if (!name || !location || !date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await partyAPI.createParty({
        name,
        location,
        description,
        date: date.toISOString(),
        image,
        ticketPrice: parseFloat(ticketPrice) || 0,
        expenses: parseFloat(expenses) || 0,
      });
      
      Alert.alert('Success', 'Party created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
      // Reset form
      setName('');
      setLocation('');
      setDescription('');
      setDate(new Date());
      setImage('');
    } catch (error: any) {
      console.error('Create party error:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to create party');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Party</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageSection}>
          <Text style={styles.label}>Party Image</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={48} color={theme.colors.textLight} />
                <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <InputField
          label="Party Name *"
          value={name}
          onChangeText={setName}
          placeholder="e.g., Summer Beach Party"
          icon="calendar"
        />

        <InputField
          label="Location *"
          value={location}
          onChangeText={setLocation}
          placeholder="e.g., Miami Beach"
          icon="location"
        />

        <View style={styles.dateSection}>
          <Text style={styles.label}>Date & Time *</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.dateText}>
              {date.toLocaleString('en-US', { 
                dateStyle: 'medium', 
                timeStyle: 'short' 
              })}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
            minimumDate={new Date()}
          />
        )}

        <InputField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Tell people about this party..."
          icon="document-text"
          multiline
          numberOfLines={4}
        />

        <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
                <InputField
                    label="Ticket Price (₪)"
                    value={ticketPrice}
                    onChangeText={setTicketPrice}
                    placeholder="0"
                    keyboardType="numeric"
                />
            </View>
            <View style={{ flex: 1 }}>
                <InputField
                    label="Expenses (₪)"
                    value={expenses}
                    onChangeText={setExpenses}
                    placeholder="0"
                    keyboardType="numeric"
                />
            </View>
        </View>

        <PrimaryButton 
          title="Create Party" 
          onPress={handleCreateParty} 
          loading={loading}
          style={styles.createButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    ...theme.shadows.card,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  imageSection: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
    ...theme.shadows.card,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.bg,
  },
  imagePlaceholderText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textLight,
    fontSize: 14,
  },
  dateSection: {
    marginBottom: theme.spacing.md,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.card,
  },
  dateText: {
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  createButton: {
    marginTop: theme.spacing.lg,
  },
});