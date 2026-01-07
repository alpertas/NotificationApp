# Notification Client App 📱

A professional React Native application built with **Expo**, demonstrating a robust implementation of "Notification Center" features. The app follows **Clean Architecture** principles and implements secure Authentication, Token Persistence, and Push Notification handling.

<p align="center">
  <!-- Screenshots placeholders -->
  <img src="https://via.placeholder.com/200x400?text=Login+Screen" alt="Login Screen" width="200" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://via.placeholder.com/200x400?text=Notification+List" alt="List Screen" width="200" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://via.placeholder.com/200x400?text=Create+Notification" alt="Create Screen" width="200" />
</p>

## 🚀 Features

- **Secure Authentication**: Firebase Auth integration with persistent sessions (AsyncStorage).
- **Push Notifications**: Full FCM (Firebase Cloud Messaging) support with Token Sync logic.
- **State Management**: Scalable global state management using `Zustand`.
- **Form Management**: Validated inputs with `React Hook Form` and `Zod`.
- **Robust Networking**: `Axios` interceptors for automatic Token injection and error logging.
- **Platform Optimized**: Custom handling for Android vs iOS networking environments.

## 🛠 Tech Stack

- **Framework**: React Native (Expo SDK 50+)
- **Language**: TypeScript
- **State**: Zustand
- **Network**: Axios
- **UI Architecture**: Clean Architecture (Feature-based)
- **UI Library**: React Native Paper
- **Forms**: React Hook Form + Zod
- **Storage**: Expo SecureStore + AsyncStorage

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/alpertas/NotificationApp.git
   cd NotificationApp
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory (copy from `.env.example`).
   ```bash
   cp .env.example .env
   ```

4. **Run the Application**
   ```bash
   npx expo start
   ```

## ⚠️ Configuration & Troubleshooting

### 🌐 Network Connection (Critical)
The most common issue during development is connecting to the Backend API from different environments. We maintain a single `EXPO_PUBLIC_API_URL` variable, but you must configure it based on your device:

| Device | Setting (`.env`) | Description |
|--------|------------------|-------------|
| **Android Emulator** | `http://10.0.2.2:3000` | Android requires specific IP to reach host localhost. |
| **iOS Simulator** | `http://localhost:3000` | iOS Simulator maps localhost directly to host. |
| **Physical Device** | `http://192.168.x.x:3000` | Use your computer's local LAN IP address. |

**Troubleshooting:**
- If you see `Network Error` logs: Check your `.env` file and ensure the backend server is running on port 3000.
- Restart Metro bundler (`r` key) after changing `.env` values.

### 🔔 Push Notifications
> [!IMPORTANT]
> **Push Notifications do NOT work on standard iOS/Android Simulators.**

- **iOS Simulator**: Does *not* support remote push notifications. You must use a physical device.
- **Android Emulator**: Supports FCM only if Google Play Services are installed and correctly configured.
- **Best Practice**: Use a **Development Build** (`npx expo run:ios` / `npx expo run:android`) or a physical device via Expo Go for reliable notification testing.

## 📂 Project Structure

```
src/
├── app/              # Navigation & Entry points
├── core/             # Core utilities (API, Config, Theme)
├── features/         # Feature modules
│   ├── auth/         # Login, Register, Stores
│   └── notifications/# List, Create, Services
└── components/       # Shared UI components
```

## 🧪 Testing

- **Linting**: Run `eslint` availability.
- **Manual Test flow**:
  1. Register a new user.
  2. Check console for `[API Request]` logs.
  3. Verify Token Sync (POST `/users/device-token`).
  4. Send a notification and verify list update with `useFocusEffect`.
