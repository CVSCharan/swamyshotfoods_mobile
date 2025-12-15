import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import { User, Lock } from 'lucide-react-native';

import { useAuthStore } from '../stores/useAuthStore';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import alert from '../lib/alert';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, setError } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleLogin = async () => {
    console.log('🔐 Login attempt started');
    console.log('Username:', username.trim());
    console.log('Password length:', password.length);

    if (!username.trim() || !password.trim()) {
      console.log('❌ Validation failed: empty fields');
      alert.error('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📡 Calling login API...');
      await login(username.trim(), password);
      console.log('✅ Login successful!');
      // Navigation will happen automatically via App.tsx
    } catch (err: any) {
      console.error('❌ Login error:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      alert.error(
        'Login Failed',
        err.message || 'Invalid username or password. Please try again.',
      );
    } finally {
      setLoading(false);
      console.log('🔐 Login attempt finished');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../pngs/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.title, { color: '#f4c430' }]}>
            Swamy's Hot Foods
          </Text>
          <Text style={styles.subtitle}>Admin Portal</Text>
        </View>

        {/* Login Card */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle style={styles.cardTitle}>Welcome Back</CardTitle>
            <CardDescription>Sign in to manage your shop</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={User}
              editable={!loading}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              leftIcon={Lock}
              editable={!loading}
              onSubmitEditing={handleLogin}
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Swamy's Hot Foods © 2025</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    marginHorizontal: 16,
  },
  cardTitle: {
    fontSize: 24,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    marginTop: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});
