import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DrawerNavigator } from './DrawerNavigator';

export function RootNavigator() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}
