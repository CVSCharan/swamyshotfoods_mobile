import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';
import { User, Lock, Image as LucideImage } from 'lucide-react-native';

import { Input } from '../components/Input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../components/Card';
import { Button } from '../components/Button';
import { H1, P, Small } from '../components/Typography';

// TODO: Move to environment variable after Metro cache is properly configured
const BASE_URL = 'http://localhost:5001/api';

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
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
          role: 'user',
          ...(pic.trim() && { pic: pic.trim() }),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success! 🎉',
          `User ${data.username} has been added successfully!`,
          [
            {
              text: 'Add Another',
              onPress: () => {
                console.log('User added:', data);
              },
            },
          ],
        );
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setPic('');
        setErrors({});
      } else {
        Alert.alert('Registration Failed', data.message || 'Please try again');
      }
    } catch (error) {
      Alert.alert(
        'Network Error',
        'Unable to connect to server. Please check your connection.',
      );
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header} className="md:mt-10">
            <H1 className="text-center mb-2 text-5xl md:text-7xl">👥</H1>
            <H1 className="text-center text-primary md:text-5xl">
              User Management
            </H1>
            <P className="text-center text-muted-foreground md:text-xl">
              Add a new user to the platform
            </P>
          </View>

          {/* Form Card */}
          <View className="w-full max-w-md self-center">
            <Card className="mx-4 md:mx-0">
              <CardHeader>
                <CardTitle className="md:text-2xl">Add New User</CardTitle>
                <CardDescription className="md:text-lg">
                  Enter user details below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                {/* Username Input */}
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

                {/* Password Input */}
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

                {/* Confirm Password Input */}
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

                {/* Profile Picture URL (Optional) */}
                <Input
                  label="Profile Picture URL (Optional)"
                  value={pic}
                  onChangeText={setPic}
                  autoCapitalize="none"
                  keyboardType="url"
                  leftIcon={LucideImage}
                />

                {/* Register Button */}
                <Button
                  mode="contained"
                  onPress={handleRegister}
                  loading={loading}
                  disabled={loading}
                  className="mt-4"
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
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 24,
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
});
