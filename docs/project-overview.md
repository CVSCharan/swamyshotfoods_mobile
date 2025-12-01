# Swamy Hot Foods Mobile - Project Overview

## 📱 About

Swamy Hot Foods Mobile is a production-ready React Native admin application for managing a restaurant's operations in real-time. Built with modern best practices, this app allows administrators to control shop status, manage menus, and handle user accounts.

---

## 🎯 Purpose

This is an **admin-only mobile application** that enables restaurant staff to:

- Toggle shop status (Open/Closed, Cooking, Holiday)
- Manage menu items (Create, Read, Update, Delete)
- Add new users to the system
- Receive real-time updates via Server-Sent Events (SSE)
- Upload and manage shop branding (logo)

**Note**: This is NOT a customer-facing app. Customers interact with the Next.js web application that consumes the same backend API.

---

## 🏗️ Architecture

### Tech Stack

**Frontend Framework:**

- React Native (Latest)
- TypeScript (100% coverage)

**UI Libraries:**

- React Native Paper (Material Design)
- NativeWind (Tailwind CSS for React Native)
- Lucide React Native (Icons)

**State Management:**

- Zustand (Lightweight, performant)

**Navigation:**

- React Navigation (Bottom Tabs)

**Real-time Communication:**

- Server-Sent Events (SSE) via `react-native-sse`

**Storage:**

- AsyncStorage (Secure token storage)

**Image Handling:**

- React Native Image Picker
- React Native Fast Image

---

## 📁 Project Structure

```
swamyshotfoods_mobile/
├── src/                          # All source code
│   ├── components/               # Reusable UI components
│   │   ├── Input.tsx            # Enhanced text input
│   │   ├── Card.tsx             # Card components
│   │   ├── Button.tsx           # Button wrapper
│   │   ├── Badge.tsx            # Status badges
│   │   └── Typography.tsx       # Text components
│   ├── screens/                 # App screens
│   │   ├── LoginScreen.tsx      # Authentication
│   │   ├── ShopStatusScreen.tsx # Dashboard
│   │   ├── MenuManagementScreen.tsx
│   │   └── AddUserScreen.tsx
│   ├── services/                # API layer
│   │   ├── api.ts              # HTTP client
│   │   ├── authService.ts      # Auth operations
│   │   ├── menuService.ts      # Menu CRUD
│   │   └── storeConfigService.ts
│   ├── stores/                  # Zustand stores
│   │   ├── useAuthStore.ts     # Auth state
│   │   ├── useMenuStore.ts     # Menu state
│   │   └── useStoreConfigStore.ts
│   ├── hooks/                   # Custom hooks
│   │   └── useStoreConfigSSE.ts # SSE connection
│   ├── navigation/              # Navigation setup
│   │   └── RootNavigator.tsx   # Tab navigator
│   ├── config/                  # Configuration
│   │   └── env.ts              # Environment config
│   ├── theme/                   # Theming
│   │   └── paperTheme.ts       # Paper theme
│   ├── types/                   # TypeScript types
│   │   └── env.d.ts            # Env variable types
│   ├── lib/                     # Utilities
│   │   └── utils.ts            # Helper functions
│   ├── App.tsx                 # Root component
│   └── global.css              # Global styles
├── android/                     # Android native code
├── ios/                         # iOS native code
├── docs/                        # Documentation
│   ├── api.md                  # API reference
│   ├── sse-integration-guide.md
│   ├── design-system.md
│   ├── lucide-icons.md
│   ├── project-overview.md
│   └── react-native-paper.md
├── .env.example                # Environment template
├── index.js                    # App entry point
├── package.json
└── tsconfig.json
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│ App Launch  │
└──────┬──────┘
       │
       ▼
┌───────────────────┐
│ Check AsyncStorage│
│ for saved token   │
└──────┬────────────┘
       │
       ├─── Token Found ──────┐
       │                      │
       ▼                      ▼
┌─────────────┐      ┌──────────────┐
│ Login Screen│      │ Main App     │
└──────┬──────┘      │ (Tabs)       │
       │             └──────────────┘
       │ POST /auth/login
       ▼
┌─────────────┐
│ Save Token  │
│ to Storage  │
└──────┬──────┘
       │
       ▼
┌──────────────┐
│ Navigate to  │
│ Main App     │
└──────────────┘
```

---

## 🌐 API Integration

### Backend

- **Base URL**: `http://localhost:5001/api` (development)
- **Authentication**: JWT Bearer tokens
- **Real-time**: Server-Sent Events (SSE)

### Endpoints Used

**Authentication:**

- `POST /auth/login` - User login
- `POST /auth/register` - Add new user (admin only)

**Menu Management:**

- `GET /menu` - Fetch all menu items
- `POST /menu` - Create menu item
- `PUT /menu/:id` - Update menu item
- `DELETE /menu/:id` - Delete menu item

**Store Configuration:**

- `GET /store-config` - Get shop status
- `PUT /store-config` - Update shop status
- `GET /store-config/sse` - Real-time updates stream

**File Upload:**

- `POST /upload` - Upload shop logo

---

## 🎨 Design System

### Brand Colors

- **Primary**: `#ff7722` (Swamy's Orange)
- **Secondary**: `#50ba94` (Green)
- **Background**: `#F4EFE6` (Cream)

### Components

All components follow a Shadcn-like API for consistency:

- Composable (Card, CardHeader, CardContent, etc.)
- Accessible
- Themeable
- TypeScript-first

### Responsive Design

- Mobile-first approach
- Tablet support with `md:` breakpoints
- Safe area handling
- Keyboard-aware layouts

---

## 🔄 Real-time Updates

The app uses Server-Sent Events (SSE) for real-time synchronization:

1. **Connection**: Established on app launch
2. **Auto-reconnect**: Handles network failures
3. **Status Indicator**: Shows connection state
4. **Optimistic Updates**: UI updates immediately, SSE confirms

**Use Case**: When an admin changes shop status on mobile, all connected clients (web app, other mobile devices) receive the update instantly.

---

## 🛡️ Security Features

1. **JWT Authentication**

   - Tokens stored in AsyncStorage (encrypted on device)
   - Auto-logout on token expiry (401)
   - Secure token transmission

2. **Role-Based Access Control**

   - Admin-only features (Add User tab)
   - Protected API endpoints

3. **Environment Variables**

   - Sensitive data in `.env` (not committed)
   - Template in `.env.example`

4. **Input Validation**
   - Client-side validation
   - Error handling
   - Type safety with TypeScript

---

## 📊 State Management

### Zustand Stores

**Auth Store** (`useAuthStore`):

- User information
- JWT token
- Authentication state
- Login/logout actions

**Menu Store** (`useMenuStore`):

- Menu items list
- CRUD operations
- Loading states

**Store Config Store** (`useStoreConfigStore`):

- Shop status (Open/Closed, Cooking, Holiday)
- Notice board
- SSE connection state

---

## 🚀 Key Features

### 1. Dashboard (Shop Status)

- Toggle shop open/closed
- Enable cooking mode
- Set holiday status with custom message
- Display notice board
- Upload shop logo
- Real-time status updates

### 2. Menu Management

- View all menu items
- Add new items
- Edit existing items
- Delete items
- Image upload support

### 3. User Management

- Add new users (admin only)
- Set user roles
- Profile picture support

### 4. Professional Navigation

- Bottom tab navigation
- Header with logout button
- Role-based tab visibility
- Smooth transitions

---

## 🔧 Development Workflow

### Environment Setup

1. Copy `.env.example` to `.env`
2. Configure `API_BASE_URL`
3. Install dependencies: `npm install`
4. Run on Android: `npm run android`
5. Run on iOS: `npm run ios`

### Code Quality

- **TypeScript**: 100% coverage
- **ESLint**: Configured
- **Prettier**: Code formatting
- **Git**: Version control with meaningful commits

---

## 📦 Dependencies

### Core

- `react-native`: ^0.76.6
- `react`: ^19.1.1
- `typescript`: ^5.7.2

### UI

- `react-native-paper`: ^5.12.5
- `nativewind`: ^4.1.23
- `lucide-react-native`: ^0.468.0

### State & Navigation

- `zustand`: ^5.0.2
- `@react-navigation/native`: ^7.0.12
- `@react-navigation/bottom-tabs`: ^7.2.1

### Utilities

- `@react-native-async-storage/async-storage`: ^2.1.0
- `react-native-sse`: Latest
- `react-native-image-picker`: Latest
- `react-native-fast-image`: ^8.6.3

---

## 🎯 Production Readiness

### Checklist

- ✅ Authentication system
- ✅ Protected routes
- ✅ Error handling
- ✅ Loading states
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Type safety
- ✅ Code organization
- ✅ Environment configuration
- ✅ Security best practices

### Deployment

1. Update `.env` with production API URL
2. Build release APK/IPA
3. Test on physical devices
4. Submit to app stores

---

## 📚 Documentation

- `docs/api.md` - Complete API reference
- `docs/sse-integration-guide.md` - Real-time updates guide
- `docs/design-system.md` - UI component guidelines
- `docs/lucide-icons.md` - Icon usage
- `docs/react-native-paper.md` - Paper components

---

## 🤝 Contributing

This is a private project for Swamy Hot Foods. For questions or issues, contact the development team.

---

## 📄 License

Proprietary - Swamy Hot Foods © 2025

---

## 🔗 Related Projects

- **Backend API**: Node.js/Express server
- **Customer Web App**: Next.js application
- **Admin Dashboard**: (If separate from mobile)

---

**Built with ❤️ for Swamy Hot Foods**
