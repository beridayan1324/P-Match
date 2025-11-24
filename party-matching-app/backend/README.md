# Backend Documentation

## Overview

This backend service is built using Node.js and Express, providing APIs for user authentication, profile management, party management, and match handling for the Party Matching App.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB Atlas account
- Firebase account (for image storage)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd party-matching-app/backend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the backend directory and add the following environment variables:
   ```
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   FIREBASE_CONFIG=<your_firebase_config>
   ```

### Running the Application

To start the server, run:
```
npm start
```

The server will be running on `http://localhost:5000` by default.

## API Endpoints

### Authentication

- **POST /api/auth/signup**: Create a new user account.
- **POST /api/auth/login**: Authenticate a user and return a JWT.

### User Profiles

- **GET /api/profile**: Retrieve the authenticated user's profile.
- **PUT /api/profile**: Update the authenticated user's profile.

### Party Management

- **GET /api/parties**: List all available parties.
- **POST /api/parties**: Create a new party.
- **POST /api/parties/join**: Join a specific party.
- **POST /api/parties/toggle-opt-in**: Toggle matching opt-in status.

### Matching

- **GET /api/matches**: View match previews.
- **POST /api/matches/accept**: Accept a match.
- **POST /api/matches/decline**: Decline a match.

## Technologies Used

- Node.js
- Express
- MongoDB (with Mongoose)
- Firebase Storage
- JSON Web Tokens (JWT)

## License

This project is licensed under the MIT License. See the LICENSE file for details.