# Party Matching App

## Overview
The Party Matching App is a mobile application built with React Native and Expo for the frontend, and Node.js with Express for the backend. The app allows users to create profiles, join parties, and find matches based on their preferences.

## Features
- User authentication (signup and login)
- User profiles with image upload and preferences
- Party management (create, join, and view parties)
- Matching algorithm to connect users
- Accept/decline match functionality
- Push notifications for match updates

## Tech Stack
- **Frontend**: React Native, Expo
- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **Storage**: Firebase Storage for profile images
- **Notifications**: Firebase Cloud Messaging (FCM)

## Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account
- Firebase account for storage and notifications

### Installation

#### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the Expo development server:
   ```
   npm start
   ```

#### Backend
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example` and fill in your MongoDB and Firebase credentials.
4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints
- **Auth**
  - `POST /api/auth/signup`: Create a new user
  - `POST /api/auth/login`: Authenticate a user

- **Profile**
  - `GET /api/profile`: Get user profile
  - `PUT /api/profile`: Update user profile

- **Party**
  - `GET /api/party`: List all parties
  - `POST /api/party`: Create a new party
  - `POST /api/party/join`: Join a party

- **Match**
  - `GET /api/match`: Get match previews
  - `POST /api/match/accept`: Accept a match
  - `POST /api/match/decline`: Decline a match

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.