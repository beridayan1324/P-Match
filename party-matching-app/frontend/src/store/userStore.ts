import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

class UserStore {
  private user: User | null = null;
  private token: string | null = null;

  async loadUser() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        this.token = token;
        this.user = JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }

  async setUser(userData: User, token: string) {
    this.user = userData;
    this.token = token;
    
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
  }

  async clearUser() {
    this.user = null;
    this.token = null;
    
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  isAdmin() {
    return this.user?.isAdmin || false;
  }
}

export default new UserStore();