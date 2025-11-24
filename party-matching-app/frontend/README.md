# Party Matching App - Frontend

This is the frontend part of the Party Matching App, built using React Native and Expo. The application allows users to sign up, log in, manage their profiles, view parties, and participate in a matching system.

## Features

- **User Authentication**: Users can create an account and log in using their email and password.
- **Profile Management**: Users can view and edit their profile information, including uploading a profile image and setting preferences.
- **Party Management**: Users can view a list of available parties, join parties, and toggle their matching opt-in status.
- **Matching System**: Users can see match previews and accept or decline matches.

## Project Structure

```
frontend
├── src
│   ├── screens
│   │   ├── SignupScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── PartyListScreen.tsx
│   │   └── MatchPreviewScreen.tsx
│   ├── components
│   │   └── index.ts
│   ├── services
│   │   ├── api.ts
│   │   └── firebase.ts
│   ├── types
│   │   └── index.ts
│   ├── App.tsx
│   └── index.ts
├── app.json
└── package.json
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the frontend directory:
   ```
   cd party-matching-app/frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Running the Application

To start the application, use the following command:
```
npm start
```

This will launch the Expo development server. You can then use the Expo Go app on your mobile device to scan the QR code and run the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.

## License

This project is licensed under the MIT License. See the LICENSE file for details.