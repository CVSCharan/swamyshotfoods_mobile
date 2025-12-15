import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme, Divider } from 'react-native-paper';
import {
  User,
  Mail,
  Lock,
  LogOut,
  Edit2,
  Camera,
  Shield,
  Bell,
  Info,
} from 'lucide-react-native';

import { useAuthStore } from '../stores/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { CustomHeader } from '../components/CustomHeader';
import alert from '../lib/alert';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    alert.confirm('Logout', 'Are you sure you want to logout?', async () => {
      setLoading(true);
      await logout();
      setLoading(false);
    });
  };

  const handleEditProfile = () => {
    alert.info('Edit Profile', 'Profile editing coming soon!');
  };

  const handleChangePassword = () => {
    alert.info('Change Password', 'Password change coming soon!');
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'staff':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'staff':
        return '👨‍🍳';
      default:
        return '👤';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="My Profile" showLogout={false} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../pngs/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: '#f4c430' }]}
          >
            Swamy's Hot Foods
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            --- Pure Veg ---
          </Text>
        </View>

        {/* Profile Card */}
        <Card style={styles.card}>
          <CardContent style={styles.profileContent}>
            {/* Profile Picture */}
            <View style={styles.avatarSection}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Text style={styles.avatarText}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Text variant="headlineSmall" style={styles.username}>
                {user?.username || 'User'}
              </Text>
              <View style={styles.roleContainer}>
                <Text style={styles.roleEmoji}>
                  {getRoleIcon(user?.role || 'user')}
                </Text>
                <Badge variant={getRoleBadgeVariant(user?.role || 'user')}>
                  {user?.role?.toUpperCase() || 'USER'}
                </Badge>
              </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  {user?.role === 'admin' ? '∞' : '0'}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Permissions
                </Text>
              </View>
              <Divider style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={styles.statValue}>
                  Active
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Status
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleEditProfile}
            >
              <View style={styles.menuItemLeft}>
                <Edit2 size={20} color={theme.colors.primary} />
                <Text variant="bodyLarge" style={styles.menuItemText}>
                  Edit Profile
                </Text>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>

            <Divider style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleChangePassword}
            >
              <View style={styles.menuItemLeft}>
                <Lock size={20} color={theme.colors.primary} />
                <Text variant="bodyLarge" style={styles.menuItemText}>
                  Change Password
                </Text>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>

            <Divider style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Bell size={20} color={theme.colors.primary} />
                <Text variant="bodyLarge" style={styles.menuItemText}>
                  Notifications
                </Text>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>

            {user?.role === 'admin' && (
              <>
                <Divider style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem}>
                  <View style={styles.menuItemLeft}>
                    <Shield size={20} color={theme.colors.primary} />
                    <Text variant="bodyLarge" style={styles.menuItemText}>
                      Admin Settings
                    </Text>
                  </View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
              </>
            )}
          </CardContent>
        </Card>

        {/* About */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Info size={20} color={theme.colors.primary} />
                <Text variant="bodyLarge" style={styles.menuItemText}>
                  App Version
                </Text>
              </View>
              <Text style={styles.versionText}>1.0.0</Text>
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          loading={loading}
          style={styles.logoutButton}
          icon={() => <LogOut size={20} color={theme.colors.error} />}
          textColor={theme.colors.error}
        >
          Logout
        </Button>

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Swamy's Hot Foods © 2025
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  card: {
    marginBottom: 16,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#16a34a',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleEmoji: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: 'bold',
    color: '#16a34a',
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  menuItemArrow: {
    fontSize: 24,
    color: '#999',
  },
  menuDivider: {
    marginVertical: 4,
  },
  versionText: {
    color: '#666',
    fontSize: 14,
  },
  logoutButton: {
    marginTop: 8,
    borderColor: '#dc2626',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#999',
  },
});
