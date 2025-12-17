import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useTheme,
  Text,
  ActivityIndicator,
  FAB,
  Chip,
  Searchbar,
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Edit2, Trash2, Clock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

import { useMenuStore, MenuItem } from '../stores/useMenuStore';
import { menuService } from '../services/menuService';
import { Card, CardContent } from '../components/Card';
import { CustomHeader } from '../components/CustomHeader';
import alert from '../lib/alert';
import { spacing, moderateScale, fontSize } from '../utils/responsive';
import type { RootDrawerParamList } from '../navigation/RootNavigator';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList, 'MenuList'>;

export default function MenuListScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { items, loading, setItems, deleteItem, setLoading } = useMenuStore();

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    // Filter items based on search query
    if (searchQuery.trim()) {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const data = await menuService.getAll();
      setItems(data);
    } catch (err) {
      alert.error('Error', 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMenuItems();
    setRefreshing(false);
  };

  const handleDelete = (item: MenuItem) => {
    alert.confirm(
      'Delete Menu Item',
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      async () => {
        setLoading(true);
        try {
          await menuService.delete(item._id);
          deleteItem(item._id);
          alert.success('Success', 'Menu item deleted successfully');
        } catch (err) {
          alert.error('Error', 'Failed to delete menu item');
        } finally {
          setLoading(false);
        }
      },
    );
  };

  const isAvailableNow = (item: MenuItem): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    const checkTimeSlot = (
      timing: { startTime: string; endTime: string } | null | undefined,
    ): boolean => {
      if (!timing) return false;

      const parseTime = (timeStr: string): number => {
        const match = timeStr.match(/(\d+):(\d+)(am|pm)/i);
        if (!match) return 0;
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const isPM = match[3].toLowerCase() === 'pm';
        if (isPM && hours !== 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      const startTime = parseTime(timing.startTime);
      const endTime = parseTime(timing.endTime);

      return currentTime >= startTime && currentTime <= endTime;
    };

    return (
      checkTimeSlot(item.morningTimings) || checkTimeSlot(item.eveningTimings)
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const available = isAvailableNow(item);

    return (
      <Card style={styles.menuCard}>
        <CardContent style={styles.menuCardContent}>
          <FastImage
            source={{ uri: item.imgSrc }}
            style={styles.menuImage}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.menuInfo}>
            <Text variant="bodyLarge" style={styles.menuName}>
              {item.name}
            </Text>
            <Text variant="bodyMedium" style={styles.menuPrice}>
              ₹{item.price}
            </Text>
            <Text variant="bodySmall" style={styles.menuDesc} numberOfLines={2}>
              {item.desc}
            </Text>

            {/* Availability Status */}
            {available && (
              <View style={styles.availabilityBadge}>
                <Clock size={moderateScale(12)} color="#16a34a" />
                <Text variant="bodySmall" style={styles.availableText}>
                  Available now
                </Text>
              </View>
            )}

            {/* Dietary Labels */}
            {item.dietaryLabels && item.dietaryLabels.length > 0 && (
              <View style={styles.chipsRow}>
                {item.dietaryLabels.slice(0, 3).map(label => (
                  <Chip
                    key={label}
                    compact
                    style={styles.dietaryChip}
                    textStyle={styles.chipText}
                  >
                    {label}
                  </Chip>
                ))}
              </View>
            )}

            {/* Ingredients Count */}
            <Text variant="bodySmall" style={styles.ingredientsCount}>
              {item.ingredients?.length || 0} ingredients
            </Text>
          </View>
          <View style={styles.menuActions}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EditMenuItem', { itemId: item._id })
              }
              style={[styles.actionButton, styles.editButton]}
            >
              <Edit2 size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item)}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Trash2 size={20} color="white" />
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No Menu Items
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        {searchQuery
          ? 'No items match your search'
          : 'Get started by adding your first menu item'}
      </Text>
    </View>
  );

  if (loading && items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading Menu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Menu Items" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search menu items..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Menu Items List */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item._id}
        renderItem={renderMenuItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        label="Add Item"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddMenuItem')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchBar: {
    elevation: 2,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.lg,
  },
  menuCard: {
    marginBottom: spacing.lg,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.lg,
  },
  menuImage: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(8),
  },
  menuInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  menuName: {
    fontWeight: 'bold',
    fontSize: fontSize.lg,
    marginBottom: spacing.xs,
  },
  menuPrice: {
    color: '#16a34a',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  menuDesc: {
    color: '#666',
    marginBottom: spacing.sm,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  availableText: {
    color: '#16a34a',
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  dietaryChip: {
    height: moderateScale(24),
  },
  chipText: {
    fontSize: fontSize.xs,
  },
  ingredientsCount: {
    color: '#666',
    fontStyle: 'italic',
  },
  menuActions: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
    borderRadius: moderateScale(8),
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
  },
  emptyTitle: {
    marginBottom: spacing.md,
    color: '#666',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 0,
  },
});
