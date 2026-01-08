# Notification Client App 📱

A professional React Native application built with **Expo**, demonstrating a robust implementation of real-time notifications with offline support, optimistic updates, and clean architecture.

The app uses **Clean Architecture** principles, enforcing a strict separation between UI, Logic (Hooks), and State (Zustand). It features secure Authentication, Token Persistence, background data syncing, and a smooth user experience even in unreliable network conditions.

<p align="center">
  <img src="https://via.placeholder.com/200x400?text=Login" alt="Login Screen" width="200" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://via.placeholder.com/200x400?text=Notification+List" alt="List Screen" width="200" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://via.placeholder.com/200x400?text=Create+Draft" alt="Create Screen" width="200" />
</p>

## 🚀 Features

### 🔐 Authentication & Security
- **Secure Auth**: Powered by Firebase Auth.
- **Persistent Sessions**: Auto-login using securely stored tokens (`Expo SecureStore`).
- **Token Injection**: `Axios` interceptors automatically inject JWT tokens into every request.

### 🔔 Advanced Notifications
- **Real-time Updates**: Optimistic UI updates ensure the app feels instant.
- **Draft System**: Save notifications as drafts and resume editing later.
- **Retry Mechanism**: Pending notifications can be tapped to retry or edit.
- **Smart Fetching**: Background fetching ensures data is fresh without blocking the UI with loading spinners.
- **Push Support**: Full FCM (Firebase Cloud Messaging) integration with automatic token syncing.

### 📡 Offline First & Resilience
- **Network Awareness**: Real-time network status monitoring (`@react-native-community/netinfo`).
- **Offline Guard**: Critical actions (like sending) are disabled when offline, with clear UI feedback.
- **Global Error Handling**: Centralized toast system for user-friendly error messages.

### 🎨 Modern UI/UX
- **Design System**: Built with `React Native Paper` and a centralized Theme system.
- **Animations**: Loading skeletons and smooth transitions.
- **Feedback**: Global loaders and Toast notifications.

## 🛠 Tech Stack

- **Framework**: React Native (Expo SDK 50+)
- **Language**: TypeScript (Strict Mode)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Lightweight & Fast)
- **Networking**: [Axios](https://axios-http.com/) (Interceptors & Error Handling)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (Validation)
- **Architecture**: Modular Feature-based Architecture + Custom Hooks Separation
- **UI Architecture**: Single Style File per Feature Strategy

## 📂 Project Structure

We follow a strict **Feature-based** folder structure. Each feature contains its own screens, components, hooks, services, and state.

```
src/
├── app/                  # App Entry & Providers
├── core/                 # Shared Kernel
│   ├── api/              # Axios Setup
│   ├── components/       # Global Components (Loaders, Toasts)
│   ├── hooks/            # Global Hooks (useNetworkStatus, useToast)
│   ├── navigation/       # Navigation Types & Stacks
│   ├── theme/            # Design Tokens
│   └── utils/            # Helpers (Date, Storage)
└── features/             # Feature Modules
    ├── auth/
    │   ├── components/   # Dumb Components (Headers)
    │   ├── hooks/        # Logic (useLogin, useRegister)
    │   ├── screens/      # UI Pages (LoginScreen)
    │   ├── services/     # API Calls
    │   └── store/        # Auth State (Zustand)
    └── notifications/
        ├── components/   # List Items, Skeletons
        ├── hooks/        # Logic (useNotifications, useCreate)
        ├── screens/      # UI Pages
        ├── services/     # API Calls
        └── store/        # Notification State (Zustand)
```

## 🏗 Architecture & Patterns

### 1. Separation of Concerns (Logic vs UI)
Screens (`.tsx`) are purely for rendering UI. They do **not** contain `useEffect`, `useState`, or API calls.
All logic is extracted into **Custom Hooks**.

*Example:*
```tsx
// LoginScreen.tsx - Clean & Readable
export const LoginScreen = () => {
  const { control, handleSubmit, isLoading } = useLogin(); // Logic inside hook
  
  return (
      <Button loading={isLoading} onPress={handleSubmit}>Login</Button>
  );
};
```

### 2. Single Style File per Feature
To avoid file clutter, all styles for a feature are consolidated into a single file (e.g., `auth.styles.ts`, `notification.styles.ts`). Screens import specific style objects from this centralized file.

### 3. State Management (Zustand)
We use generic stores for global state.
- **Optimistic Updates**: The UI updates immediately when an action (like adding a notification) is taken, before the server responds.
- **Background Fetching**: Data is refreshed silently if content already exists to avoid jarring loading spinners.

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
   Create a `.env` file in the root directory.
   ```bash
   EXPO_PUBLIC_API_URL=http://localhost:3000
   EXPO_PUBLIC_FIREBASE_API_KEY=your_key
   ...
   ```
   > **Note:** For Android Emulator, use `http://10.0.2.2:3000` as the API URL.

4. **Run the Application**
   ```bash
   npx expo start
   ```

## ⚠️ Configuration & Troubleshooting

### 🌐 Network Connection
The app monitors connection status. If you see "No Internet Connection", ensure your simulator/device has internet access.
- **Android Emulator**: `10.0.2.2` maps to host `localhost`.
- **iOS Simulator**: `localhost` maps to host.
- **Physical Device**: Use your machine's LAN IP (e.g., `192.168.1.5`).

### 🔔 Push Notifications
- **Simulators**: Remote Push Notifications **do not work** on simulators. You must use a physical device for reliable testing.
- **Android**: Requires Google Play Services.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
Built with ❤️ by [Alper Taş](https://github.com/alpertas)
