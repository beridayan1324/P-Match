export interface UserProfile {
    id: string;
    name: string;
    gender: 'male' | 'female' | 'other';
    profileImage: string;
    preferences: string[];
}

export interface Party {
    id: string;
    name: string;
    date: string;
    location: string;
    participants: string[];
}

export interface Match {
    id: string;
    userId1: string;
    userId2: string;
    status: 'pending' | 'accepted' | 'declined';
}

export interface AuthResponse {
    token: string;
    user: UserProfile;
}

export interface PartyListResponse {
    parties: Party[];
}

export interface MatchPreview {
    match: Match;
    userProfile: UserProfile;
}