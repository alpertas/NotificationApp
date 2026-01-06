# Notification App

A React Native application demonstrating "Notification Center" features with Clean Architecture, Firebase Auth, and Push Notifications.

## Features

- **Authentication**: Firebase Auth (Email/Password) with VSCode persistence.
- **Push Notifications**: Expo Notifications with FCM integration.
- **Token Management**: Secure storage and backend synchronization.
- **Clean Architecture**: Feature-based folder structure.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory based on `.env.example`.

   **.env Example:**
   ```properties
   EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Run the App**
   ```bash
   npx expo start
   ```

## Architecture

- `src/features`: Contains `auth` and `notifications` modules.
- `src/core`: Shared utilities, API configuration, and theme.
- `src/app`: Navigation and app entry setup.

## Notifications Flow

1. **Permission**: App requests permission on boot (`usePushNotification`).
2. **Registration**: FCM Token is generated and stored in `SecureStore`.
3. **Sync**: Token is sent to backend via `POST /users/device-token`.
4. **Sending**: Use the "Create Notification" screen to trigger a notification via backend API.
