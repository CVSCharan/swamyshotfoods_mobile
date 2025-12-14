import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Switch, ActivityIndicator, Text } from 'react-native-paper';

import {
  useStoreConfigStore,
  StoreConfig,
} from '../stores/useStoreConfigStore';
import { useStoreConfigSSE } from '../hooks/useStoreConfigSSE';
import { storeConfigService } from '../services/storeConfigService';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { CustomHeader } from '../components/CustomHeader';
import {
  spacing,
  moderateScale,
  DeviceSize,
  getResponsiveValue,
  fontSize,
} from '../utils/responsive';

export default function ShopStatusScreen() {
  const theme = useTheme();
  const { config, isConnected, setConfig } = useStoreConfigStore();
  const { connect } = useStoreConfigSSE();

  const [noticeText, setNoticeText] = useState('');
  const [holidayText, setHolidayText] = useState('');
  const [shopDesc, setShopDesc] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (config) {
      setNoticeText(config.noticeMessage || '');
      setHolidayText(config.holidayMessage || '');
      setShopDesc(config.description || '');
    }
  }, [config]);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await storeConfigService.get();
      setConfig(data);
    } catch (err) {
      console.error('Failed to fetch config:', err);
    }
  };

  const updateConfig = async (updates: Partial<StoreConfig>) => {
    setLoading(true);
    try {
      await storeConfigService.update(updates);
      if (config) {
        setConfig({ ...config, ...updates });
      }
      Alert.alert('Success', 'Status updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading Shop Status...</Text>
      </View>
    );
  }

  const logoSize = getResponsiveValue({
    small: 100,
    medium: 120,
    large: 140,
    default: 120,
  });

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Shop Management" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoSection}>
              <View
                style={[
                  styles.logoContainer,
                  {
                    width: logoSize,
                    height: logoSize,
                    borderRadius: logoSize / 2,
                  },
                ]}
              >
                <Image
                  source={require('../../pngs/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text
              variant={DeviceSize.isSmall ? 'headlineSmall' : 'headlineMedium'}
              style={[styles.title, { color: '#f4c430' }]}
            >
              Swamy's Hot Foods
            </Text>
            <Text
              variant={DeviceSize.isSmall ? 'bodySmall' : 'bodyMedium'}
              style={[styles.subtitle, { color: theme.colors.primary }]}
            >
              --- Pure Veg ---
            </Text>

            {/* Connection Status */}
            <View style={styles.connectionStatus}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isConnected ? '#16a34a' : '#dc2626' },
                ]}
              />
              <Text
                variant="bodySmall"
                style={[
                  styles.statusText,
                  { color: isConnected ? '#16a34a' : '#dc2626' },
                ]}
              >
                {isConnected
                  ? 'Live Updates Active'
                  : 'Offline - Reconnecting...'}
              </Text>
            </View>
          </View>

          {/* Main Status Cards */}
          <View
            style={[
              styles.statusRow,
              DeviceSize.isTablet && styles.statusRowTablet,
            ]}
          >
            <Card style={styles.statusCard}>
              <CardContent style={styles.statusCardContent}>
                <Text variant="bodyLarge" style={styles.statusLabel}>
                  Shop Status
                </Text>
                <Switch
                  value={config.isShopOpen}
                  onValueChange={val => updateConfig({ isShopOpen: val })}
                  color={theme.colors.primary}
                />
                <Badge
                  variant={config.isShopOpen ? 'default' : 'destructive'}
                  style={styles.statusBadge}
                >
                  {config.isShopOpen ? 'OPEN' : 'CLOSED'}
                </Badge>
              </CardContent>
            </Card>

            <Card style={styles.statusCard}>
              <CardContent style={styles.statusCardContent}>
                <Text variant="bodyLarge" style={styles.statusLabel}>
                  Cooking
                </Text>
                <Switch
                  value={config.isCooking}
                  onValueChange={val => updateConfig({ isCooking: val })}
                  color={theme.colors.primary}
                />
                <Badge
                  variant={config.isCooking ? 'default' : 'secondary'}
                  style={styles.statusBadge}
                >
                  {config.isCooking ? 'ON' : 'OFF'}
                </Badge>
              </CardContent>
            </Card>
          </View>

          {/* Notice Board */}
          <Card style={styles.card}>
            <CardHeader style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderText}>
                <CardTitle>Notice Board</CardTitle>
                <CardDescription>Announcements for customers</CardDescription>
              </View>
              <Switch
                value={config.isNoticeActive}
                onValueChange={val => updateConfig({ isNoticeActive: val })}
              />
            </CardHeader>
            {config.isNoticeActive && (
              <CardContent>
                <Input
                  multiline
                  numberOfLines={3}
                  value={noticeText}
                  onChangeText={setNoticeText}
                  placeholder="Enter notice text..."
                  containerStyle={styles.inputContainer}
                />
                <Button
                  mode="outlined"
                  onPress={() => updateConfig({ noticeMessage: noticeText })}
                  loading={loading}
                >
                  Update Notice
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Holiday Mode */}
          <Card style={styles.card}>
            <CardHeader style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderText}>
                <CardTitle>Holiday Mode</CardTitle>
                <CardDescription>Set shop as on holiday</CardDescription>
              </View>
              <Switch
                value={config.isHoliday}
                onValueChange={val => updateConfig({ isHoliday: val })}
              />
            </CardHeader>
            {config.isHoliday && (
              <CardContent>
                <Input
                  multiline
                  numberOfLines={3}
                  value={holidayText}
                  onChangeText={setHolidayText}
                  placeholder="Enter holiday message..."
                  containerStyle={styles.inputContainer}
                />
                <Button
                  mode="outlined"
                  onPress={() => updateConfig({ holidayMessage: holidayText })}
                  loading={loading}
                >
                  Update Holiday Message
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Shop Description */}
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle>Shop Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                multiline
                numberOfLines={4}
                value={shopDesc}
                onChangeText={setShopDesc}
                placeholder="Enter shop description..."
                containerStyle={styles.inputContainer}
              />
              <Button
                mode="contained"
                onPress={() => updateConfig({ description: shopDesc })}
                loading={loading}
              >
                Update Description
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: moderateScale(100),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.lg,
    fontSize: fontSize.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoSection: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  logoContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontWeight: '500',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: moderateScale(20),
  },
  statusDot: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    marginRight: spacing.sm,
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: DeviceSize.isSmall ? 'column' : 'row',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  statusRowTablet: {
    maxWidth: moderateScale(600),
    alignSelf: 'center',
    width: '100%',
  },
  statusCard: {
    flex: 1,
    minWidth: DeviceSize.isSmall ? '100%' : undefined,
  },
  statusCardContent: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  statusLabel: {
    fontWeight: '700',
    marginBottom: spacing.md,
    fontSize: fontSize.lg,
  },
  statusBadge: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  card: {
    marginBottom: spacing.xxl,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginRight: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
});
