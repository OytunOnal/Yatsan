# TeknePazari - Mobile Tech Stack

## 📱 Mobile Platform Teknoloji Yığını

TeknePazari mobil uygulaması (iOS/Android) için kullanılan teknolojiler ve araçlar.

---

## 🎯 Stack Özeti

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| Framework | React Native | 0.73.x |
| Bundler | Expo | SDK 50.x |
| Language | TypeScript | 5.x |
| Styling | NativeWind | 4.x |
| State Management | Zustand | 4.x |
| API Client | TanStack Query | 5.x |
| Form Management | React Hook Form | 7.x |
| Navigation | React Navigation | 6.x |
| Storage | AsyncStorage | Latest |
| Database | SQLite | 3.x |
| Maps | Mapbox GL | 10.x |
| Camera | Expo Camera | Latest |
| Location | Expo Location | Latest |
| Notifications | Expo Notifications | Latest |
| Auth | NextAuth.js + Mobile | 5.x |
| WebRTC | Daily.co SDK | Latest |

---

## 📦 Paketler ve Bağımlılıklar

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.73.0",
    "expo": "^50.0.0",
    "typescript": "^5.3.0"
  }
}
```

### Navigation

```json
{
  "dependencies": {
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@react-navigation/stack": "^6.3.0",
    "react-native-screens": "^3.27.0",
    "react-native-safe-area-context": "^4.8.0"
  }
}
```

### Styling

```json
{
  "dependencies": {
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0"
  }
}
```

### State Management

```json
{
  "dependencies": {
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.28.0",
    "@react-query-devtools/native": "^3.0.0"
  }
}
```

### Forms

```json
{
  "dependencies": {
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0"
  }
}
```

### Storage & Database

```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^1.21.0",
    "@react-native-camera-roll/camera-roll": "^6.2.0",
    "react-native-mmkv": "^2.11.0",
    "react-native-sqlite-storage": "^6.0.0"
  }
}
```

### Camera & Media

```json
{
  "dependencies": {
    "expo-camera": "^14.1.0",
    "expo-image-picker": "^14.7.0",
    "expo-av": "^13.12.0",
    "expo-media-library": "^15.7.0",
    "react-native-video": "^5.2.0"
  }
}
```

### Location & Maps

```json
{
  "dependencies": {
    "expo-location": "^16.6.0",
    "@react-native-mapbox-gl/maps": "^8.6.0",
    "react-native-maps": "^1.7.0"
  }
}
```

### Notifications & Auth

```json
{
  "dependencies": {
    "expo-notifications": "^14.10.0",
    "expo-local-authentication": "^14.3.0",
    "react-native-keychain": "^8.1.0"
  }
}
```

### HTTP & WebRTC

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "@daily-co/react-native-daily-js": "^0.30.0",
    "react-native-webrtc": "^111.1.0"
  }
}
```

### UI Components

```json
{
  "dependencies": {
    "react-native-paper": "^5.11.0",
    "react-native-vector-icons": "^10.0.0",
    "react-native-modalize": "^2.1.0",
    "react-native-action-sheet": "^0.11.0"
  }
}
```

### Utilities

```json
{
  "dependencies": {
    "date-fns": "^2.30.0",
    "uuid": "^9.0.0",
    "slugify": "^1.6.0",
    "js-base64": "^3.7.0"
  }
}
```

### Development

```json
{
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.72.0",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

---

## 📁 Proje Yapısı

```
app/
├── src/
│   ├── app.tsx                 # Root component
│   ├── navigation/
│   │   ├── RootNavigator.tsx   # Root navigator
│   │   ├── AuthNavigator.tsx   # Auth stack
│   │   └── MainNavigator.tsx   # Main tabs
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── VerifyScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── SearchScreen.tsx
│   │   │   └── CategoriesScreen.tsx
│   │   ├── listings/
│   │   │   ├── ListingsScreen.tsx
│   │   │   ├── ListingDetailScreen.tsx
│   │   │   ├── CreateListingScreen.tsx
│   │   │   └── ListingSteps/
│   │   ├── messages/
│   │   │   ├── MessagesScreen.tsx
│   │   │   └── ChatScreen.tsx
│   │   ├── favorites/
│   │   │   └── FavoritesScreen.tsx
│   │   ├── profile/
│   │   │   └── ProfileScreen.tsx
│   │   └── broker/
│   │       └── BrokerScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── listings/
│   │   │   ├── ListingCard.tsx
│   │   │   ├── ListingGallery.tsx
│   │   │   └── ListingFilter.tsx
│   │   ├── messages/
│   │   │   ├── MessageBubble.tsx
│   │   │   └── ConversationList.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       └── BottomTabs.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useListings.ts
│   │   ├── useLocation.ts
│   │   ├── useCamera.ts
│   │   └── useNotifications.ts
│   ├── store/
│   │   ├── authStore.ts        # Zustand auth store
│   │   ├── listingStore.ts     # Zustand listing store
│   │   └── uiStore.ts          # Zustand UI store
│   ├── services/
│   │   ├── api.ts              # API client
│   │   ├── auth.ts             # Auth service
│   │   ├── listings.ts         # Listings service
│   │   ├── storage.ts          # Storage service
│   │   └── notifications.ts    # Notifications service
│   ├── types/
│   │   ├── auth.ts
│   │   ├── listings.ts
│   │   ├── user.ts
│   │   └── common.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── colors.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── config/
│   │   ├── constants.ts
│   │   └── env.ts
│   └── styles/
│       ├── tailwind.css
│       └── theme.ts
├── app.json               # Expo config
├── eas.json               # EAS config
├── tsconfig.json
└── package.json
```

---

## ⚙️ Konfigürasyon

### app.json

```json
{
  "expo": {
    "name": "TeknePazari",
    "slug": "teknepazari",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0066CC"
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow TeknePazari to access your camera"
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow TeknePazari to access your location"
        }
      ],
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow TeknePazari to use Face ID"
        }
      ]
    ],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.teknepazari.app",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0066CC"
      },
      "package": "com.teknepazari.app",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### eas.json

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "distribution": "store"
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": 000000000
      }
    }
  }
}
```

### Environment Variables

```env
# API
EXPO_PUBLIC_API_URL="https://api.teknepazari.com"
EXPO_PUBLIC_API_TIMEOUT=10000

# Auth
EXPO_PUBLIC_AUTH_DOMAIN="teknepazari.auth0.com"

# Maps
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN="pk_xxxxx"

# Sentry
EXPO_PUBLIC_SENTRY_DSN="https://xxxxx@sentry.io/xxxxx"

# OneSignal (Push Notifications)
EXPO_PUBLIC_ONESIGNAL_APP_ID="xxxxx"

# Daily (WebRTC)
EXPO_PUBLIC_DAILY_API_KEY="xxxxx"

# Environment
EXPO_PUBLIC_ENVIRONMENT="production"
```

---

## 🎨 Styling Strategy

### NativeWind Setup

```typescript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0066CC",
          light: "#00A3E0",
          dark: "#004FA0",
        },
        secondary: "#FF6B35",
        success: "#1DB854",
        error: "#E94B3C",
        warning: "#FFA500",
      },
      fontFamily: {
        sans: ["Inter"],
      },
    },
  },
  plugins: [],
};
```

### Color Utilities

```typescript
// utils/colors.ts
export const colors = {
  primary: "#0066CC",
  secondary: "#00A3E0",
  accent: "#FF6B35",
  success: "#1DB854",
  error: "#E94B3C",
  warning: "#FFA500",
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    100: "#F5F5F5",
    200: "#E0E0E0",
    300: "#CCCCCC",
    600: "#666666",
    900: "#333333",
  },
};
```

---

## 🔧 Native Modules Integration

### Camera Module

```typescript
// hooks/useCamera.ts
import { CameraView, useCameraPermissions } from 'expo-camera';

export const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();

  const takePicture = async (cameraRef: any) => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      return photo;
    }
  };

  return { permission, requestPermission, takePicture };
};
```

### Location Module

```typescript
// hooks/useLocation.ts
import * as Location from 'expo-location';

export const useLocation = () => {
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    
    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  };

  return { getLocation };
};
```

### Notifications Module

```typescript
// services/notifications.ts
import * as Notifications from 'expo-notifications';

export const registerForPushNotificationsAsync = async () => {
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
};

export const setNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};
```

---

## 📦 Build & Deployment

### Development Build

```bash
# Create development build
eas build --platform all --profile development

# Run on simulator/emulator
expo start --dev-client
```

### Production Build

```bash
# Build for production
eas build --platform all --profile production

# Submit to stores
eas submit --platform all
```

### TestFlight (iOS)

```bash
# Build and submit to TestFlight
eas build --platform ios --profile production
eas submit --platform ios
```

### Google Play (Android)

```bash
# Build and submit to Google Play
eas build --platform android --profile production
eas submit --platform android
```

---

## 🔐 Security

### Secure Storage

```typescript
// services/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync('auth_token', token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync('auth_token');
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync('auth_token');
};
```

### Biometric Auth

```typescript
// hooks/useBiometric.ts
import * as LocalAuthentication from 'expo-local-authentication';

export const useBiometric = () => {
  const isAvailable = async () => {
    return await LocalAuthentication.hasHardwareAsync();
  };

  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        disableDeviceFallback: false,
      });
      return result.success;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return { isAvailable, authenticate };
};
```

---

## 📊 Performance

### Optimization Tips

1. **Lazy Loading:** Dynamic navigation import
2. **Image Optimization:** Cached images, thumbnails
3. **List Optimization:** FlatList, virtualization
4. **State Management:** Zustand (minimal re-renders)
5. **Code Splitting:** Separate bundles per route

### Memory Management

```typescript
// Cleanup on unmount
useEffect(() => {
  return () => {
    // Cleanup subscriptions
    // Clear timers
    // Unsubscribe from streams
  };
}, []);
```

---

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Coverage

```bash
npm run test:coverage
```

---

*Son Güncelleme: 2026-01-19*
*Versiyon: 1.0 (Project Specs)*
