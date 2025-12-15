import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Text } from 'react-native-paper';
import { User, Lock, Image as LucideImage } from 'lucide-react-native';

import { Input } from '../components/Input';
import { authService } from '../services/authService';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/Card';
import { Button } from '../components/Button';
import { CustomHeader } from '../components/CustomHeader';
import alert from '../lib/alert';

interface RegisterResponse {
  username: string;
  role: string;
  pic?: string;
  _id: string;
  createdAt: string;
}

export default function AddUserScreen() {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pic, setPic] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        username: username.trim(),
        password,
        role: 'user',
        ...(pic.trim() && { pic: pic.trim() }),
      });

      alert.success(
        'Success! 🎉',
        `User ${username} has been added successfully!`,
        0, // Don't auto-dismiss
      );
      // Reset form
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setPic('');
      setErrors({});
    } catch (error: any) {
      alert.error('Registration Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <CustomHeader title="User Management" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text variant="displaySmall" style={styles.emoji}>
              👥
            </Text>
            <Text
              variant="headlineLarge"
              style={[styles.title, { color: theme.colors.primary }]}
            >
              User Management
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Add a new user to the platform
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formContainer}>
            <Card>
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Enter user details below</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  label="Username"
                  value={username}
                  onChangeText={text => {
                    setUsername(text);
                    if (errors.username) {
                      setErrors({ ...errors, username: undefined });
                    }
                  }}
                  error={errors.username}
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon={User}
                />

                <Input
                  label="Password"
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  error={errors.password}
                  secureTextEntry
                  autoCapitalize="none"
                  leftIcon={Lock}
                />

                <Input
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={text => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                  error={errors.confirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  leftIcon={Lock}
                />

                <Input
                  label="Profile Picture URL (Optional)"
                  value={pic}
                  onChangeText={setPic}
                  autoCapitalize="none"
                  keyboardType="url"
                  leftIcon={LucideImage}
                />

                <Button
                  mode="contained"
                  onPress={handleRegister}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                >
                  Add User
                </Button>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  button: {
    marginTop: 16,
  },
});
