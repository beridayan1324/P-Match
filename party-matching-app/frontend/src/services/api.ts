import axios from 'axios';

const API_URL = 'http://your-backend-url.com/api'; // Replace with your backend URL

// User Authentication
export const signup = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
    return response.data;
};

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
};

// User Profile
export const getUserProfile = async (token) => {
    const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateUserProfile = async (token, profileData) => {
    const response = await axios.put(`${API_URL}/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Party Management
export const listParties = async () => {
    const response = await axios.get(`${API_URL}/parties`);
    return response.data;
};

export const joinParty = async (token, partyId) => {
    const response = await axios.post(`${API_URL}/parties/join`, { partyId }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const toggleOptIn = async (token, partyId) => {
    const response = await axios.post(`${API_URL}/parties/toggle-opt-in`, { partyId }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Match Handling
export const getMatchPreview = async (token) => {
    const response = await axios.get(`${API_URL}/matches/preview`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updateMatchStatus = async (token, matchId, status) => {
    const response = await axios.put(`${API_URL}/matches/${matchId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};