import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Menu, LogOut } from 'lucide-react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../stores/useAuthStore';
import LinearGradient from 'react-native-linear-gradient';
import alert from '../lib/alert';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;

interface CustomHeaderProps {
  title: string;
  showLogout?: boolean;
}

const AnimatedIconButton = ({
  onPress,
  children,
  style,
}: {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

export function CustomHeader({ title, showLogout = true }: CustomHeaderProps) {
  const theme = useTheme();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    alert.confirm('Logout', 'Are you sure you want to logout?', async () => {
      await logout();
    });
  };

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[
        styles.container,
        {
          borderBottomColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <AnimatedIconButton
        onPress={() => navigation.openDrawer()}
        style={[
          styles.iconButton,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <Menu
          size={isSmallDevice ? 20 : 22}
          color={theme.colors.primary}
          strokeWidth={2.5}
        />
      </AnimatedIconButton>

      <View style={styles.titleContainer}>
        <Text
          variant={isSmallDevice ? 'titleMedium' : 'titleLarge'}
          style={[
            styles.title,
            {
              color: theme.colors.onSurface,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      {showLogout ? (
        <AnimatedIconButton
          onPress={handleLogout}
          style={[
            styles.iconButton,
            { backgroundColor: theme.colors.errorContainer },
          ]}
        >
          <LogOut
            size={isSmallDevice ? 20 : 22}
            color={theme.colors.error}
            strokeWidth={2.5}
          />
        </AnimatedIconButton>
      ) : (
        <View style={styles.iconButton} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallDevice ? 12 : 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 12,
    paddingBottom: isSmallDevice ? 12 : 16,
    borderBottomWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  iconButton: {
    width: isSmallDevice ? 40 : 44,
    height: isSmallDevice ? 40 : 44,
    borderRadius: isSmallDevice ? 10 : 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: isSmallDevice ? 8 : 12,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
});
