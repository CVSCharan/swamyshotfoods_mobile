import React, { useRef, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

import { MenuItemForm } from '../components/MenuItemForm';
import { useMenuStore, MenuItem } from '../stores/useMenuStore';
import { menuService } from '../services/menuService';
import alert from '../lib/alert';
import type { RootDrawerParamList } from '../navigation/RootNavigator';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList, 'AddMenuItem'>;

export default function AddMenuItemScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { addItem, setLoading } = useMenuStore();

  const [formData, setFormData] = useState<Partial<MenuItem>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setLoading(true);
    try {
      const newItem = await menuService.create(formData);
      addItem(newItem);
      alert.success('Success', 'Menu item added successfully');
      setHasChanges(false);
      navigation.navigate('MenuList');
    } catch (err) {
      alert.error('Error', 'Failed to add menu item');
    } finally {
      setIsSaving(false);
      setLoading(false);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title="Add Menu Item" />
        <Appbar.Action icon="check" onPress={handleSave} disabled={isSaving} />
      </Appbar.Header>

      <MenuItemForm
        initialData={{
          name: '',
          price: 0,
          desc: '',
          ingredients: [],
          priority: 1,
          imgSrc: '',
          dietaryLabels: ['vegetarian'],
          allergens: [],
          morningTimings: null,
          eveningTimings: null,
          timingTemplate: null,
        }}
        onDataChange={handleFormChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
