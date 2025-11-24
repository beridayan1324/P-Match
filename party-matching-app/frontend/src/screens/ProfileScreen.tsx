import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../services/firebase';
import { getUserProfile, updateUserProfile } from '../services/api';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [preferences, setPreferences] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile();
      setName(profile.name);
      setGender(profile.gender);
      setProfileImage(profile.profileImage);
      setPreferences(profile.preferences);
    };

    fetchProfile();
  }, []);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const uploadedImageUrl = await uploadImage(result.uri);
      setProfileImage(uploadedImageUrl);
    }
  };

  const handleSaveProfile = async () => {
    await updateUserProfile({ name, gender, profileImage, preferences });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Image source={{ uri: profileImage }} style={styles.image} />
      <Button title="Pick an image from camera roll" onPress={handleImagePicker} />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Preferences"
        value={preferences}
        onChangeText={setPreferences}
      />
      <Button title="Save Profile" onPress={handleSaveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ProfileScreen;