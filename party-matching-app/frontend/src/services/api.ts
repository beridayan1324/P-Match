import axios from 'axios';
import Constants from 'expo-constants';

const cfg: any = Constants.expoConfig ?? {};
const extraApi = cfg.extra?.apiUrl;
const API_URL = process.env.EXPO_PUBLIC_API_URL || extraApi || 'http://10.0.0.15:5000';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default apiClient;

// User Authentication
export const signup = async (email, password) => {
    const response = await apiClient.post(`/auth/signup`, { email, password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await apiClient.post(`/auth/login`, { email, password });
    return response.data;
};

// User Profile
export const getUserProfile = async (token) => {
    const response = await apiClient.get(`/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateUserProfile = async (token, profileData) => {
    const response = await apiClient.put(`/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Party Management
export const listParties = async () => {
    const response = await apiClient.get(`/parties`);
    return response.data;
};

export const joinParty = async (token, partyId) => {
    const response = await apiClient.post(`/parties/join`, { partyId }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const toggleOptIn = async (token, partyId) => {
    const response = await apiClient.post(`/parties/toggle-opt-in`, { partyId }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Match Handling
export const getMatchPreview = async (token) => {
    const response = await apiClient.get(`/matches/preview`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateMatchStatus = async (token, matchId, status) => {
    const response = await apiClient.put(`/matches/${matchId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};