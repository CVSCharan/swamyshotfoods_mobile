import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {
  Home,
  Menu as MenuIcon,
  Plus,
  UserPlus,
  User,
  Clock,
  LogOut,
} from 'lucide-react-native';
import { Avatar } from '../ui/Avatar';
import { Separator } from '../ui/Separator';
import { useAuthStore } from '../../stores/useAuthStore';
import { lightColors } from '../../theme/colors';
import { typography, spacing, borderRadius } from '../../theme/typography';
import alert from '../../lib/alert';

interface DrawerItemProps {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  active?: boolean;
}

const DrawerItem: React.FC<DrawerItemProps> = ({
  label,
  icon,
  onPress,
  active,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.drawerItem,
        active && {
          backgroundColor: lightColors.primary + '15',
          borderLeftWidth: 4,
          borderLeftColor: lightColors.primary,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.drawerItemIcon}>{icon}</View>
      <Text
        style={[
          styles.drawerItemLabel,
          active && {
            color: lightColors.primary,
            fontWeight: typography.fontWeight.semibold,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const CustomDrawerContent: React.FC<
  DrawerContentComponentProps
> = props => {
  const { user, logout } = useAuthStore();
  const { state, navigation } = props;

  const currentRoute = state.routes[state.index].name;

  const handleLogout = () => {
    alert.confirm('Logout', 'Are you sure you want to logout?', async () => {
      await logout();
      navigation.closeDrawer();
    });
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <Avatar
            src={user?.pic}
            fallback={user?.username || 'User'}
            size="lg"
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user?.username || 'User'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role || 'user'}</Text>
          </View>
        </View>

        <Separator style={styles.separator} />

        {/* Navigation Items */}
        <View style={styles.menuSection}>
          <DrawerItem
            label="Dashboard"
            icon={
              <Home
                size={22}
                color={
                  currentRoute === 'Dashboard'
                    ? lightColors.primary
                    : lightColors.textSecondary
                }
              />
            }
            onPress={() => navigation.navigate('Dashboard')}
            active={currentRoute === 'Dashboard'}
          />
          <DrawerItem
            label="Menu Items"
            icon={
              <MenuIcon
                size={22}
                color={
                  currentRoute === 'MenuList'
                    ? lightColors.primary
                    : lightColors.textSecondary
                }
              />
            }
            onPress={() => navigation.navigate('MenuList')}
            active={currentRoute === 'MenuList'}
          />
          <DrawerItem
            label="Add Menu Item"
            icon={
              <Plus
                size={22}
                color={
                  currentRoute === 'AddMenuItem'
                    ? lightColors.primary
                    : lightColors.textSecondary
                }
              />
            }
            onPress={() => navigation.navigate('AddMenuItem')}
            active={currentRoute === 'AddMenuItem'}
          />
          {user?.role === 'admin' && (
            <>
              <DrawerItem
                label="Timing Templates"
                icon={
                  <Clock
                    size={22}
                    color={
                      currentRoute === 'TimingTemplates'
                        ? lightColors.primary
                        : lightColors.textSecondary
                    }
                  />
                }
                onPress={() => navigation.navigate('TimingTemplates')}
                active={currentRoute === 'TimingTemplates'}
              />
              <DrawerItem
                label="User Management"
                icon={
                  <UserPlus
                    size={22}
                    color={
                      currentRoute === 'Users'
                        ? lightColors.primary
                        : lightColors.textSecondary
                    }
                  />
                }
                onPress={() => navigation.navigate('Users')}
                active={currentRoute === 'Users'}
              />
            </>
          )}
          <DrawerItem
            label="Profile"
            icon={
              <User
                size={22}
                color={
                  currentRoute === 'Profile'
                    ? lightColors.primary
                    : lightColors.textSecondary
                }
              />
            }
            onPress={() => navigation.navigate('Profile')}
            active={currentRoute === 'Profile'}
          />
        </View>
      </DrawerContentScrollView>

      {/* Logout Button */}
      <View style={styles.footer}>
        <Separator style={styles.separator} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={22} color={lightColors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.card,
  },
  scrollContent: {
    paddingTop: 0,
  },
  profileSection: {
    padding: spacing[6],
    alignItems: 'center',
    backgroundColor: lightColors.background,
  },
  avatar: {
    marginBottom: spacing[3],
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: lightColors.text,
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
    color: lightColors.white,
    textTransform: 'uppercase',
  },
  separator: {
    marginVertical: spacing[2],
  },
  menuSection: {
    paddingVertical: spacing[2],
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    marginHorizontal: spacing[2],
    marginVertical: spacing[1],
    borderRadius: borderRadius.md,
  },
  drawerItemIcon: {
    marginRight: spacing[3],
  },
  drawerItemLabel: {
    fontSize: typography.fontSize.base,
    color: lightColors.text,
  },
  footer: {
    paddingBottom: spacing[4],
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
