import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import {
  Home,
  Menu,
  UserPlus,
  User,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { Alert } from 'react-native';
import { useAuthStore } from '../stores/useAuthStore';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

interface MenuItemProps {
  item: {
    name: string;
    label: string;
    icon: any;
    route: string;
  };
  isActive: boolean;
  onPress: () => void;
  theme: any;
  index: number;
}

const AnimatedMenuItem = ({
  item,
  isActive,
  onPress,
  theme,
  index,
}: MenuItemProps) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 1,
      delay: index * 50,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
  };

  const Icon = item.icon;

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          {
            translateX: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          },
        ],
        opacity: slideAnim,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.menuItem,
          {
            backgroundColor: isActive
              ? theme.colors.primaryContainer
              : 'transparent',
          },
        ]}
      >
        {isActive && (
          <View
            style={[
              styles.activeIndicator,
              { backgroundColor: theme.colors.primary },
            ]}
          />
        )}
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: isActive
                ? theme.colors.primary
                : theme.colors.surfaceVariant,
            },
          ]}
        >
          <Icon
            size={20}
            color={isActive ? theme.colors.onPrimary : theme.colors.primary}
          />
        </View>
        <View style={styles.menuTextContainer}>
          <Text
            variant="bodyLarge"
            style={[
              styles.menuLabel,
              {
                color: isActive ? theme.colors.primary : theme.colors.onSurface,
                fontWeight: isActive ? '600' : '500',
              },
            ]}
          >
            {item.label}
          </Text>
        </View>
        {isActive && (
          <ChevronRight
            size={18}
            color={theme.colors.primary}
            style={styles.chevron}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

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
    <View style={styles.container}>
      {/* Gradient Header Section */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerOverlay}>
          <View
            style={[
              styles.logoContainer,
              {
                shadowColor: theme.colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              },
            ]}
          >
            <Image
              source={require('../../pngs/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text variant="headlineMedium" style={styles.shopName}>
            Swamy's Hot Foods
          </Text>
          <View style={styles.taglineContainer}>
            <View style={styles.taglineDivider} />
            <Text variant="bodyMedium" style={styles.shopTagline}>
              Pure Veg
            </Text>
            <View style={styles.taglineDivider} />
          </View>
        </View>
      </LinearGradient>

      {/* User Info Card */}
      <View style={styles.userInfoWrapper}>
        <View
          style={[
            styles.userInfo,
            {
              backgroundColor: theme.colors.surface,
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        >
          <View
            style={[
              styles.userAvatar,
              {
                backgroundColor: theme.colors.primaryContainer,
              },
            ]}
          >
            <User size={28} color={theme.colors.primary} />
          </View>
          <View style={styles.userDetails}>
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onSurface, fontWeight: '600' }}
            >
              {user?.username || 'User'}
            </Text>
            <View
              style={[
                styles.userRole,
                {
                  backgroundColor: theme.colors.tertiaryContainer,
                },
              ]}
            >
              <Text
                variant="labelSmall"
                style={{
                  color: theme.colors.onTertiaryContainer,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                }}
              >
                {user?.role?.toUpperCase() || 'STAFF'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Navigation Menu */}
      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContent}
      >
        <Text
          variant="labelLarge"
          style={[
            styles.menuSectionTitle,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          NAVIGATION
        </Text>
        {menuItems.map((item, index) => {
          const isActive = activeRoute === item.route;
          return (
            <AnimatedMenuItem
              key={item.route}
              item={item}
              isActive={isActive}
              onPress={() => navigation.navigate(item.route)}
              theme={theme}
              index={index}
            />
          );
        })}
      </ScrollView>

      {/* Logout Button */}
      <View style={styles.logoutWrapper}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.logoutButton,
            {
              backgroundColor: theme.colors.errorContainer,
              borderColor: theme.colors.error,
            },
          ]}
          onPress={handleLogout}
        >
          <View
            style={[
              styles.logoutIconContainer,
              { backgroundColor: theme.colors.error },
            ]}
          >
            <LogOut size={20} color={theme.colors.onError} />
          </View>
          <Text
            variant="titleMedium"
            style={[styles.logoutText, { color: theme.colors.error }]}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerOverlay: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  shopName: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taglineDivider: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  shopTagline: {
    color: '#fff',
    opacity: 0.95,
    fontWeight: '500',
    letterSpacing: 1,
  },
  userInfoWrapper: {
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  userDetails: {
    flex: 1,
    gap: 6,
  },
  userRole: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 8,
  },
  menuContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  menuSectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 4,
    fontWeight: '700',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 12,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    letterSpacing: 0.2,
  },
  chevron: {
    marginLeft: 8,
  },
  logoutWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
