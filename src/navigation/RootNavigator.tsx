import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import ShopStatusScreen from '../screens/ShopStatusScreen';
import MenuManagementScreen from '../screens/MenuManagementScreen';
import AddUserScreen from '../screens/AddUserScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuthStore } from '../stores/useAuthStore';
import { CustomHeader } from '../components/CustomHeader';
import { CustomDrawerContent } from '../components/CustomDrawerContent';

export type RootDrawerParamList = {
  Dashboard: undefined;
  Menu: undefined;
  Users: undefined;
  Profile: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export function RootNavigator() {
  const { user } = useAuthStore();

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          drawerStyle: {
            width: 280,
          },
          swipeEnabled: true,
          swipeEdgeWidth: 50,
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={ShopStatusScreen}
          options={{
            title: 'Shop Management',
          }}
        />
        <Drawer.Screen
          name="Menu"
          component={MenuManagementScreen}
          options={{
            title: 'Menu Management',
          }}
        />
        {user?.role === 'admin' && (
          <Drawer.Screen
            name="Users"
            component={AddUserScreen}
            options={{
              title: 'User Management',
            }}
          />
        )}
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'My Profile',
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
