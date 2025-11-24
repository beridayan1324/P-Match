export interface User {
    id: string;
    email: string;
    name: string;
    gender: 'male' | 'female' | 'other';
    profileImage: string;
    preferences: string[];
}

export interface Party {
    id: string;
    name: string;
    date: Date;
    location: string;
    participants: string[];
}

export interface Match {
    id: string;
    userId1: string;
    userId2: string;
    status: 'pending' | 'accepted' | 'declined';
}