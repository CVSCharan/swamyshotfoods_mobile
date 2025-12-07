import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Home,
  Menu as MenuIcon,
  UserPlus,
  User,
  LogOut,
  X,
} from 'lucide-react-native';
import { Avatar } from '../components/ui/Avatar';
import { Separator } from '../components/ui/Separator';
import ShopStatusScreen from '../screens/ShopStatusScreen';
import MenuManagementScreen from '../screens/MenuManagementScreen';
import AddUserScreen from '../screens/AddUserScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuthStore } from '../stores/useAuthStore';
import { RootDrawerParamList } from '../types/navigation';
import { lightColors } from '../theme/colors';
import { typography, spacing, borderRadius } from '../theme/typography';

const Stack = createStackNavigator<RootDrawerParamList>();

// Custom Menu Modal Component
export const MenuModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: keyof RootDrawerParamList) => void;
  currentScreen: string;
}> = ({ visible, onClose, onNavigate, currentScreen }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  const menuItems = [
    {
      key: 'Dashboard' as keyof RootDrawerParamList,
      label: 'Dashboard',
      icon: Home,
    },
    {
      key: 'Menu' as keyof RootDrawerParamList,
      label: 'Menu Management',
      icon: MenuIcon,
    },
    ...(user?.role === 'admin'
      ? [
          {
            key: 'Users' as keyof RootDrawerParamList,
            label: 'User Management',
            icon: UserPlus,
          },
        ]
      : []),
    {
      key: 'Profile' as keyof RootDrawerParamList,
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={styles.menuContainer}
          onStartShouldSetResponder={() => true}
        >
          {/* Header */}
          <View style={styles.menuHeader}>
            <Avatar
              src={user?.pic}
              fallback={user?.username || 'User'}
              size="lg"
            />
            <Text style={styles.userName}>{user?.username || 'User'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role || 'user'}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={lightColors.text} />
            </TouchableOpacity>
          </View>

          <Separator />

          {/* Menu Items */}
          <ScrollView style={styles.menuItems}>
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = currentScreen === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => {
                    onNavigate(item.key);
                    onClose();
                  }}
                >
                  <Icon
                    size={22}
                    color={
                      isActive ? lightColors.primary : lightColors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.menuItemText,
                      isActive && styles.menuItemTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Logout */}
          <View>
            <Separator />
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LogOut size={22} color={lightColors.error} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
            <Text style={styles.version}>v1.0.0</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export function DrawerNavigator() {
  const { user } = useAuthStore();
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentScreen, setCurrentScreen] =
    useState<keyof RootDrawerParamList>('Dashboard');

  const handleNavigate = (screen: keyof RootDrawerParamList) => {
    setCurrentScreen(screen);
  };

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Dashboard" component={ShopStatusScreen} />
        <Stack.Screen name="Menu" component={MenuManagementScreen} />
        {user?.role === 'admin' && (
          <Stack.Screen name="Users" component={AddUserScreen} />
        )}
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>

      <MenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={handleNavigate}
        currentScreen={currentScreen}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: lightColors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '80%',
    paddingBottom: spacing[6],
  },
  menuHeader: {
    padding: spacing[6],
    alignItems: 'center',
    backgroundColor: lightColors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: lightColors.text,
    marginTop: spacing[3],
    marginBottom: spacing[2],
  },
  roleBadge: {
    backgroundColor: lightColors.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  roleText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: '#ffffff',
    textTransform: 'uppercase',
  },
  closeButton: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    padding: spacing[2],
  },
  menuItems: {
    paddingVertical: spacing[2],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    marginHorizontal: spacing[2],
    marginVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  menuItemActive: {
    backgroundColor: lightColors.primary + '15',
    borderLeftWidth: 4,
    borderLeftColor: lightColors.primary,
  },
  menuItemText: {
    fontSize: typography.fontSize.base,
    color: lightColors.text,
    marginLeft: spacing[3],
  },
  menuItemTextActive: {
    color: lightColors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    marginHorizontal: spacing[4],
  },
  logoutText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: lightColors.error,
    marginLeft: spacing[3],
  },
  version: {
    fontSize: typography.fontSize.xs,
    color: lightColors.textTertiary,
    textAlign: 'center',
    marginTop: spacing[2],
  },
});
