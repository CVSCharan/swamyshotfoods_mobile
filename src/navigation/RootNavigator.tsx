import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import ShopStatusScreen from '../screens/ShopStatusScreen';
import MenuListScreen from '../screens/MenuListScreen';
import AddMenuItemScreen from '../screens/AddMenuItemScreen';
import EditMenuItemScreen from '../screens/EditMenuItemScreen';
import AddUserScreen from '../screens/AddUserScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuthStore } from '../stores/useAuthStore';
import { CustomHeader } from '../components/CustomHeader';
import { CustomDrawerContent } from '../components/CustomDrawerContent';

export type RootDrawerParamList = {
  Dashboard: undefined;
  MenuList: undefined;
  AddMenuItem: undefined;
  EditMenuItem: {
    itemId: string;
  };
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
          name="MenuList"
          component={MenuListScreen}
          options={{
            title: 'Menu Items',
          }}
        />
        <Drawer.Screen
          name="AddMenuItem"
          component={AddMenuItemScreen}
          options={{
            title: 'Add Menu Item',
            drawerItemStyle: { display: 'none' }, // Hide from drawer, accessible via FAB
          }}
        />
        <Drawer.Screen
          name="EditMenuItem"
          component={EditMenuItemScreen}
          options={{
            title: 'Edit Menu Item',
            drawerItemStyle: { display: 'none' }, // Hide from drawer, accessible via list
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
