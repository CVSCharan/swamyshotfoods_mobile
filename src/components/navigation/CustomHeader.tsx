import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Menu } from 'lucide-react-native';
import { lightColors, darkColors } from '../../theme/colors';
import { typography, spacing, shadows } from '../../theme/typography';

interface CustomHeaderProps {
  title: string;
  rightActions?: React.ReactNode;
  colorScheme?: 'light' | 'dark';
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  rightActions,
  colorScheme = 'light',
}) => {
  const navigation = useNavigation();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.card}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            ...shadows.sm,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        >
          <Menu size={24} color={colors.text} />
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={styles.rightActions}>
          {rightActions || <View style={{ width: 40 }} />}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
  },
  menuButton: {
    padding: spacing[2],
    marginRight: spacing[2],
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
