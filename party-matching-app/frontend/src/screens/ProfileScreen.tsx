import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../theme/theme';
import { profileAPI } from '../services/api';

export default function ProfileScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [genderPreference, setGenderPreference] = useState<'male' | 'female' | 'other' | 'any'>('any');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      const user = response.data;
      setName(user.name || '');
      setGender(user.gender || 'male');
      setGenderPreference(user.genderPreference || 'any');
      setBio(user.bio || '');
      setProfileImage(user.profileImage || '');
      setInterests(user.interests?.join(', ') || '');
      setLocation(user.location || '');
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSave = async () => {
    if (!name || !gender || !genderPreference || !bio || bio.length < 20) {
      Alert.alert('Incomplete Profile', 'Please fill all required fields. Bio must be at least 20 characters.');
      return;
    }

    if (!profileImage) {
      Alert.alert('Profile Image Required', 'Please upload a profile image.');
      return;
    }

    try {
      setLoading(true);
      const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i);
      
      await profileAPI.updateProfile({
        name,
        gender,
        genderPreference,
        bio,
        profileImage,
        interests: interestsArray,
        location,
      });

      // Update local storage
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        user.name = name;
        user.gender = gender;
        user.genderPreference = genderPreference;
        user.bio = bio;
        user.profileImage = profileImage;
        await AsyncStorage.setItem('userData', JSON.stringify(user));
      }

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to update profile', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Welcome');
  };

  const isProfileComplete = name && gender && genderPreference && profileImage && bio && bio.length >= 20;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Completion Banner */}
        {!isProfileComplete && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={20} color={theme.colors.warning} />
            <Text style={styles.warningText}>
              Complete your profile to join parties and find matches!
            </Text>
          </View>
        )}

        {/* Profile Image */}
        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color={theme.colors.textLight} />
              <Text style={styles.imagePlaceholderText}>Add Photo *</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Name */}
        <InputField
          label="Name *"
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          icon="person"
        />

        {/* Gender */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Gender *</Text>
          <View style={styles.buttonGroup}>
            {['male', 'female', 'other'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.optionButton, gender === g && styles.optionButtonActive]}
                onPress={() => setGender(g as any)}
              >
                <Text style={[styles.optionText, gender === g && styles.optionTextActive]}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Gender Preference */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Looking for *</Text>
          <View style={styles.buttonGroup}>
            {[
              { value: 'male', label: 'Men' },
              { value: 'female', label: 'Women' },
              { value: 'other', label: 'Other' },
              { value: 'any', label: 'Anyone' },
            ].map((pref) => (
              <TouchableOpacity
                key={pref.value}
                style={[styles.optionButton, genderPreference === pref.value && styles.optionButtonActive]}
                onPress={() => setGenderPreference(pref.value as any)}
              >
                <Text style={[styles.optionText, genderPreference === pref.value && styles.optionTextActive]}>
                  {pref.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bio */}
        <InputField
          label="Bio * (min 20 characters)"
          value={bio}
          onChangeText={setBio}
          placeholder="Tell others about yourself..."
          multiline
          numberOfLines={4}
          icon="document-text"
        />
        <Text style={styles.charCount}>{bio.length}/20 characters</Text>

        {/* Interests */}
        <InputField
          label="Interests (comma separated)"
          value={interests}
          onChangeText={setInterests}
          placeholder="e.g., Music, Sports, Travel"
          icon="star"
        />

        {/* Location */}
        <InputField
          label="Location"
          value={location}
          onChangeText={setLocation}
          placeholder="Your city"
          icon="location"
        />

        <PrimaryButton
          title="Save Profile"
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    fontWeight: '600',
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: theme.spacing.xl,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.bg,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    color: theme.colors.textLight,
  },
  fieldContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  optionButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  optionTextActive: {
    color: theme.colors.white,
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
    textAlign: 'right',
  },
  saveButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
});