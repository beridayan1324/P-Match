import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../theme/theme';
import { apiClient } from '../services/api';

export default function ProfileScreen({ navigation }: any) {
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [preferences, setPreferences] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState<string>('');
  const [additionalImages, setAdditionalImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await apiClient.get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName(res.data.name || '');
      setGender(res.data.gender || '');
      setPreferences(res.data.preferences || '');
      setProfileImage(res.data.profileImage || '');
      setAdditionalImages(res.data.additionalImages || []);
    } catch (e) {
      console.warn('Failed to load profile', e);
    }
  };

  const pickImage = async (isProfile: boolean = true) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
      
      if (isProfile) {
        setProfileImage(imageUri);
      } else {
        if (additionalImages.length < 5) {
          setAdditionalImages([...additionalImages, imageUri]);
        } else {
          Alert.alert('Limit Reached', 'You can only add up to 5 additional photos');
        }
      }
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index));
  };

  const onSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      
      await apiClient.put(
        '/api/profile',
        { 
          name, 
          gender, 
          preferences, 
          profileImage,
          additionalImages 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Alert.alert('Success', 'Profile updated successfully');
      await loadProfile();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.replace('Welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: profileImage || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton} onPress={() => pickImage(true)}>
              <Ionicons name="camera" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Photos ({additionalImages.length}/5)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGrid}>
            {additionalImages.map((uri, index) => (
              <View key={index} style={styles.additionalImageContainer}>
                <Image source={{ uri }} style={styles.additionalImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeAdditionalImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            {additionalImages.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={() => pickImage(false)}>
                <Ionicons name="add" size={32} color={theme.colors.textLight} />
                <Text style={styles.addImageText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        <View style={styles.formContainer}>
          <InputField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            icon="person"
          />

          <View style={styles.genderContainer}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderButtons}>
              {['male', 'female', 'other'].map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={[styles.genderButton, gender === g && styles.genderButtonActive]}
                >
                  <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <InputField
            label="Preferences"
            value={preferences}
            onChangeText={setPreferences}
            placeholder="What are you looking for?"
            icon="heart"
          />

          <PrimaryButton title="Save Changes" onPress={onSave} loading={loading} />

          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.bg,
    borderWidth: 4,
    borderColor: theme.colors.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  imageGrid: {
    flexDirection: 'row',
  },
  additionalImageContainer: {
    position: 'relative',
    marginRight: theme.spacing.sm,
  },
  additionalImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.bg,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.textLight,
  },
  addImageText: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  formContainer: {
    gap: theme.spacing.md,
  },
  genderContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.card,
  },
  genderButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  genderText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  genderTextActive: {
    color: theme.colors.white,
  },
  logoutButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  logoutText: {
    color: theme.colors.error,
    fontWeight: '600',
    fontSize: 16,
  },
});