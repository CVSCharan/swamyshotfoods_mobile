import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StatusBar,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, Text } from 'react-native-paper';
import { RootNavigator } from './navigation/RootNavigator';
import LoginScreen from './screens/LoginScreen';
import { useAuthStore } from './stores/useAuthStore';
import { lightTheme, darkTheme } from './theme/paperTheme';
import { ToastContainer } from './components/ui/Toast';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { isAuthenticated, isLoading, loadToken } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </PaperProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        {isAuthenticated ? <RootNavigator /> : <LoginScreen />}
        <ToastContainer />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
});

export default App;
