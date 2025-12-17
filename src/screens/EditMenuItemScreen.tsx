import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useTheme,
  Appbar,
  ActivityIndicator,
  Text,
  Menu,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { RouteProp } from '@react-navigation/native';

import { MenuItemForm } from '../components/MenuItemForm';
import { useMenuStore, MenuItem } from '../stores/useMenuStore';
import { menuService } from '../services/menuService';
import alert from '../lib/alert';
import type { RootDrawerParamList } from '../navigation/RootNavigator';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList, 'EditMenuItem'>;
type RoutePropType = RouteProp<RootDrawerParamList, 'EditMenuItem'>;

export default function EditMenuItemScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { items, updateItem, deleteItem, setLoading } = useMenuStore();

  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [loadingItem, setLoadingItem] = useState(true);

  const { itemId } = route.params;

  useEffect(() => {
    loadMenuItem();
  }, [itemId]);

  const loadMenuItem = async () => {
    setLoadingItem(true);
    try {
      // First try to find in store
      const item = items.find(i => i._id === itemId);
      if (item) {
        setMenuItem(item);
        setFormData(item);
      } else {
        // If not in store, fetch from API
        const fetchedItem = await menuService.getById(itemId);
        setMenuItem(fetchedItem);
        setFormData(fetchedItem);
      }
    } catch (err) {
      alert.error('Error', 'Failed to load menu item');
      navigation.goBack();
    } finally {
      setLoadingItem(false);
    }
  };

  const handleFormChange = (data: Partial<MenuItem>) => {
    setFormData(data);
    setHasChanges(true);
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.price) {
      alert.error('Validation Error', 'Name and Price are required');
      return false;
    }

    if (!formData.ingredients || formData.ingredients.length === 0) {
      alert.error('Validation Error', 'At least one ingredient is required');
      return false;
    }

    if (!formData.imgSrc) {
      alert.error('Validation Error', 'Image URL is required');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm() || !menuItem) return;

    setIsSaving(true);
    setLoading(true);
    try {
      await menuService.update(menuItem._id, formData);
      updateItem(menuItem._id, formData);
      alert.success('Success', 'Menu item updated successfully');
      setHasChanges(false);
      navigation.navigate('MenuList');
    } catch (err) {
      alert.error('Error', 'Failed to update menu item');
    } finally {
      setIsSaving(false);
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setMenuVisible(false);
    if (!menuItem) return;

    alert.confirm(
      'Delete Menu Item',
      `Are you sure you want to delete "${menuItem.name}"? This action cannot be undone.`,
      async () => {
        setLoading(true);
        try {
          await menuService.delete(menuItem._id);
          deleteItem(menuItem._id);
          alert.success('Success', 'Menu item deleted successfully');
          navigation.navigate('MenuList');
        } catch (err) {
          alert.error('Error', 'Failed to delete menu item');
        } finally {
          setLoading(false);
        }
      },
    );
  };

  const handleBack = () => {
    if (hasChanges) {
      alert.confirm(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        () => {
          navigation.goBack();
        },
      );
    } else {
      navigation.goBack();
    }
  };

  if (loadingItem) {
    return (
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit Menu Item" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Edit Menu Item" />
        <Appbar.Action
          icon="check"
          onPress={handleUpdate}
          disabled={isSaving}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item
            onPress={handleDelete}
            title="Delete"
            leadingIcon="delete"
          />
        </Menu>
      </Appbar.Header>

      {menuItem && (
        <MenuItemForm initialData={menuItem} onDataChange={handleFormChange} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
});
