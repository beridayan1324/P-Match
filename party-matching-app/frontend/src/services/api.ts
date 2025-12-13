import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.0.16:5000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Log responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('API Error:', error.message);
    console.log('Error details:', error.response?.data);
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (email: string, password: string, name: string, gender: string) => {
    const response = await apiClient.post('/api/auth/register', { email, password, name, gender });
    
    if (response.data.token && response.data.user) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    
    if (response.data.token && response.data.user) {
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    return response.data;
  },
};

export const profileAPI = {
  getProfile: () => apiClient.get('/api/profile'),
  updateProfile: (data: any) => apiClient.put('/api/profile', data),
};

export const partyAPI = {
  getAllParties: () => apiClient.get('/api/party'),
  getPartyDetails: (partyId: string) => apiClient.get(`/api/party/${partyId}`),
  getPublicPartyDetails: (partyId: string) => apiClient.get(`/api/party/${partyId}/public`),
  createParty: (data: any) => apiClient.post('/api/party', data),
  joinParty: (partyId: string) => apiClient.post(`/api/party/${partyId}/join`),
  joinPartyPublic: (partyId: string, name: string, email: string) => 
    apiClient.post(`/api/party/${partyId}/join-public`, { name, email }),
  getParticipants: (partyId: string, optInOnly?: boolean) => apiClient.get(`/api/party/${partyId}/participants`, { params: { optInOnly } }),
  getMatches: (partyId: string) => apiClient.get(`/api/party/${partyId}/matches`),
  respondToMatch: (matchId: string, action: 'accept' | 'reject') => 
    apiClient.post(`/api/party/match/${matchId}/respond`, { action }),
  
  // Manager APIs
  getManagerParties: () => apiClient.get('/api/party/manager/my-parties'),
  getPartyStats: (partyId: string) => apiClient.get(`/api/party/${partyId}/stats`),
  updateParticipantStatus: (partyId: string, userId: string, status: string) => 
    apiClient.post(`/api/party/${partyId}/participants/${userId}/status`, { status }),
  scanTicket: (partyId: string, ticketCode: string) => 
    apiClient.post(`/api/party/${partyId}/scan`, { ticketCode }),
  toggleMatchingStatus: (partyId: string, optIn: boolean) => 
    apiClient.post(`/api/party/${partyId}/matching-status`, { optIn }),
};

export const chatAPI = {
  getChats: () => apiClient.get('/api/chat'),
  getMessages: (matchId: string) => apiClient.get(`/api/chat/${matchId}/messages`),
  sendMessage: (matchId: string, text: string) => apiClient.post(`/api/chat/${matchId}/send`, { text }),
};