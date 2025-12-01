import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Menu, UserPlus, User, LogOut } from 'lucide-react-native';
import { TouchableOpacity, Alert } from 'react-native';

import ShopStatusScreen from '../screens/ShopStatusScreen';
import MenuManagementScreen from '../screens/MenuManagementScreen';
import AddUserScreen from '../screens/AddUserScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuthStore } from '../stores/useAuthStore';

export type RootTabParamList = {
  Dashboard: undefined;
  Menu: undefined;
  Users: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const { logout, user } = useAuthStore();

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

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#ff7722',
          tabBarInactiveTintColor: '#888',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 16, padding: 8 }}
            >
              <LogOut size={24} color="#ff7722" />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            height: 65,
            paddingBottom: 10,
            paddingTop: 5,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={ShopStatusScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            tabBarLabel: 'Dashboard',
            headerTitle: 'Shop Management',
          }}
        />
        <Tab.Screen
          name="Menu"
          component={MenuManagementScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Menu size={size} color={color} />,
            tabBarLabel: 'Menu',
            headerTitle: 'Menu Management',
          }}
        />
        {user?.role === 'admin' && (
          <Tab.Screen
            name="Users"
            component={AddUserScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <UserPlus size={size} color={color} />
              ),
              tabBarLabel: 'Add User',
              headerTitle: 'User Management',
            }}
          />
        )}
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            tabBarLabel: 'Profile',
            headerTitle: 'My Profile',
            headerRight: undefined,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
