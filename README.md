# Swamy Hot Foods Mobile Admin App

[![React Native](https://img.shields.io/badge/React%20Native-0.76-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> Production-ready React Native admin application for managing Swamy Hot Foods restaurant operations in real-time.

---

## 📱 About

Swamy Hot Foods Mobile is an **admin-only** mobile application that enables restaurant staff to manage shop operations, menus, and users. Built with modern React Native best practices, featuring real-time updates via Server-Sent Events (SSE).

**Key Features:**

- 🔐 JWT Authentication with secure token storage
- 🏪 Real-time shop status management
- 🍽️ Complete menu CRUD operations
- 👥 User management (admin only)
- 📡 Live updates via SSE
- 🎨 Professional UI with React Native Paper
- 📱 Responsive design for phones and tablets

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- npm or yarn
- React Native development environment ([Setup Guide](https://reactnative.dev/docs/environment-setup))
- Android Studio (for Android) or Xcode (for iOS)

### Installation

```bash
# Clone the repository
git clone https://github.com/CVSCharan/swamyshotfoods_mobile.git
cd swamyshotfoods_mobile

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your API URL

# iOS only - Install pods
cd ios && pod install && cd ..

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## 📁 Project Structure

```
swamyshotfoods_mobile/
├── src/                    # All source code
│   ├── components/         # Reusable UI components
│   ├── screens/           # App screens
│   ├── services/          # API layer
│   ├── stores/            # Zustand state management
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation setup
│   ├── config/            # App configuration
│   ├── theme/             # Theming
│   └── App.tsx           # Root component
├── android/               # Android native code
├── ios/                   # iOS native code
├── docs/                  # Documentation
└── ...config files
```

See [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) for detailed architecture.

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:5001/api
ENVIRONMENT=development
```

**Available Environments:**

- `development` - Local development
- `staging` - Staging server
- `production` - Production server

---

## 🎯 Features

### Authentication

- JWT-based login
- Secure token storage (AsyncStorage)
- Auto-login on app restart
- Auto-logout on session expiry
- Role-based access control

### Dashboard (Shop Status)

- Toggle shop Open/Closed
- Enable Cooking mode
- Set Holiday status with custom message
- Notice Board for announcements
- Upload shop logo
- Real-time status updates via SSE

### Menu Management

- View all menu items
- Add new items with images
- Edit existing items
- Delete items
- Priority ordering

### User Management (Admin Only)

- Add new users
- Set user roles (admin, staff, user)
- Profile picture support

---

## 🏗️ Tech Stack

**Framework:** React Native + TypeScript

**UI Libraries:**

- React Native Paper (Material Design)
- NativeWind (Tailwind CSS)
- Lucide React Native (Icons)

**State Management:** Zustand

**Navigation:** React Navigation (Bottom Tabs)

**Real-time:** Server-Sent Events (SSE)

**Storage:** AsyncStorage

---

## 📚 Documentation

- [Project Overview](docs/PROJECT_OVERVIEW.md) - Complete architecture guide
- [API Reference](docs/api.md) - Backend API documentation
- [SSE Integration](docs/sse-integration-guide.md) - Real-time updates guide
- [Design System](docs/design-system.md) - UI component guidelines
- [Icons Guide](docs/lucide-icons.md) - Icon usage
- [Paper Components](docs/react-native-paper.md) - React Native Paper guide

---

## 🛠️ Development

### Available Scripts

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Code Quality

- **TypeScript**: 100% coverage
- **ESLint**: Configured with React Native rules
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit linting (if configured)

---

## 🔐 Security

- JWT tokens stored securely in AsyncStorage
- Auto-logout on 401 Unauthorized
- Environment variables for sensitive data
- Role-based access control
- Input validation on all forms

---

## 📱 Screenshots

> Add screenshots here after deployment

---

## 🚢 Deployment

### Android

```bash
# Generate release APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

### iOS

```bash
# Open in Xcode
open ios/swamyshotfoods_mobile.xcworkspace

# Archive and upload to App Store Connect
```

---

## 🐛 Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache and restart
npx react-native start --reset-cache
```

### Android Build Issues

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Issues

```bash
# Clean and reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

---

## 📊 Project Status

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** December 2025

### Completed Features

- ✅ Authentication system
- ✅ Shop status management
- ✅ Menu CRUD operations
- ✅ User management
- ✅ Real-time updates (SSE)
- ✅ Professional navigation
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states

---

## 🤝 Contributing

This is a private project for Swamy Hot Foods. For questions or contributions, please contact the development team.

---

## 📄 License

Proprietary - Swamy Hot Foods © 2025

---

## 👥 Team

**Developer:** CVS Charan  
**Organization:** Swamy Hot Foods

---

## 🔗 Links

- [Backend Repository](#) - API server
- [Web Application](#) - Customer-facing Next.js app
- [Documentation](docs/) - Complete docs

---

## 📞 Support

For issues or questions:

- Email: support@swamyshotfoods.com
- GitHub Issues: [Create an issue](https://github.com/CVSCharan/swamyshotfoods_mobile/issues)

---

**Built with ❤️ using React Native**
