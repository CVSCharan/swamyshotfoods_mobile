import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Text, useTheme, Divider } from 'react-native-paper';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Home, Menu, UserPlus, User, LogOut } from 'lucide-react-native';
import { Alert } from 'react-native';
import { useAuthStore } from '../stores/useAuthStore';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  const { logout, user } = useAuthStore();
  const { navigation, state } = props;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      label: 'Dashboard',
      icon: Home,
      route: 'Dashboard',
    },
    {
      name: 'Menu',
      label: 'Menu Management',
      icon: Menu,
      route: 'Menu',
    },
    ...(user?.role === 'admin'
      ? [
          {
            name: 'Users',
            label: 'User Management',
            icon: UserPlus,
            route: 'Users',
          },
        ]
      : []),
    {
      name: 'Profile',
      label: 'My Profile',
      icon: User,
      route: 'Profile',
    },
  ];

  const activeRoute = state.routes[state.index].name;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header Section */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../pngs/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text variant="headlineSmall" style={styles.shopName}>
          Swamy's Hot Foods
        </Text>
        <Text variant="bodySmall" style={styles.shopTagline}>
          --- Pure Veg ---
        </Text>
      </View>

      {/* User Info Section */}
      <View
        style={[
          styles.userInfo,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <View style={styles.userAvatar}>
          <User size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.userDetails}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {user?.username || 'User'}
          </Text>
          <Text
            variant="bodySmall"
            style={[
              styles.userRole,
              {
                color: theme.colors.primary,
                backgroundColor: theme.colors.primaryContainer,
              },
            ]}
          >
            {user?.role?.toUpperCase() || 'STAFF'}
          </Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Navigation Menu */}
      <ScrollView style={styles.menuContainer}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeRoute === item.route;

          return (
            <TouchableOpacity
              key={item.route}
              style={[
                styles.menuItem,
                isActive && {
                  backgroundColor: theme.colors.primaryContainer,
                  borderLeftWidth: 4,
                  borderLeftColor: theme.colors.primary,
                },
              ]}
              onPress={() => navigation.navigate(item.route)}
            >
              <Icon
                size={24}
                color={
                  isActive
                    ? theme.colors.primary
                    : theme.colors.onSurfaceVariant
                }
              />
              <Text
                variant="bodyLarge"
                style={[
                  styles.menuLabel,
                  {
                    color: isActive
                      ? theme.colors.primary
                      : theme.colors.onSurface,
                    fontWeight: isActive ? '600' : '400',
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Divider style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          { backgroundColor: theme.colors.errorContainer },
        ]}
        onPress={handleLogout}
      >
        <LogOut size={24} color={theme.colors.error} />
        <Text
          variant="bodyLarge"
          style={[styles.logoutText, { color: theme.colors.error }]}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 12,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  shopName: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shopTagline: {
    color: '#fff',
    opacity: 0.9,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 12,
    borderRadius: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userRole: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 8,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  menuLabel: {
    marginLeft: 16,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 12,
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 16,
    fontWeight: '600',
  },
});
