import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useTheme,
  Portal,
  Modal,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

import { useMenuStore, MenuItem } from '../stores/useMenuStore';
import { menuService } from '../services/menuService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export default function MenuManagementScreen() {
  const theme = useTheme();
  const {
    items,
    loading,
    setItems,
    addItem,
    updateItem,
    deleteItem,
    setLoading,
  } = useMenuStore();

  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isEditSectionOpen, setEditSectionOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    price: 0,
    desc: '',
    ingredients: '',
    priority: 1,
    imgSrc: '',
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const data = await menuService.getAll();
      setItems(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!formData.name || !formData.price) {
      Alert.alert('Error', 'Name and Price are required');
      return;
    }

    setLoading(true);
    try {
      const newItem = await menuService.create(formData);
      addItem(newItem);
      setAddModalVisible(false);
      resetForm();
      Alert.alert('Success', 'Menu item added successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;

    setLoading(true);
    try {
      await menuService.update(selectedItem._id, formData);
      updateItem(selectedItem._id, formData);
      setEditModalVisible(false);
      resetForm();
      Alert.alert('Success', 'Menu item updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!selectedItem) return;

    setLoading(true);
    try {
      await menuService.delete(selectedItem._id);
      deleteItem(selectedItem._id);
      setDeleteModalVisible(false);
      setSelectedItem(null);
      Alert.alert('Success', 'Menu item deleted successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete menu item');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData(item);
    setEditModalVisible(true);
  };

  const openDeleteModal = (item: MenuItem) => {
    setSelectedItem(item);
    setDeleteModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      desc: '',
      ingredients: '',
      priority: 1,
      imgSrc: '',
    });
    setSelectedItem(null);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
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
          <Text variant="bodySmall" style={styles.menuDesc}>
            {item.desc}
          </Text>
        </View>
        <View style={styles.menuActions}>
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            style={[styles.actionButton, styles.editButton]}
          >
            <Edit2 size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openDeleteModal(item)}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Trash2 size={20} color="white" />
          </TouchableOpacity>
        </View>
      </CardContent>
    </Card>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={[
              styles.logoContainer,
              { borderColor: theme.colors.primary },
            ]}
          >
            <Image
              source={require('../../pngs/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: '#f4c430' }]}
          >
            Swamy's Hot Foods
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            --- Pure Veg ---
          </Text>
        </View>

        {/* Add Menu Item Button */}
        <Button
          mode="contained"
          onPress={() => setAddModalVisible(true)}
          style={styles.addButton}
          icon={() => <Plus size={20} color="white" />}
        >
          Add Menu Item
        </Button>

        {/* Edit Menu Items Section */}
        <Card style={styles.card}>
          <TouchableOpacity
            onPress={() => setEditSectionOpen(!isEditSectionOpen)}
          >
            <CardHeader style={styles.cardHeader}>
              <CardTitle>Edit Menu Items ({items.length})</CardTitle>
              {isEditSectionOpen ? (
                <ChevronUp size={24} color={theme.colors.primary} />
              ) : (
                <ChevronDown size={24} color={theme.colors.primary} />
              )}
            </CardHeader>
          </TouchableOpacity>
        </Card>

        {isEditSectionOpen && (
          <FlatList
            data={items}
            keyExtractor={item => item._id}
            renderItem={renderMenuItem}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Portal>
        <Modal
          visible={isAddModalVisible || isEditModalVisible}
          onDismiss={() => {
            setAddModalVisible(false);
            setEditModalVisible(false);
            resetForm();
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              {isEditModalVisible ? 'Edit' : 'Add'} Menu Item
            </Text>

            <Input
              label="Name *"
              value={formData.name}
              onChangeText={text => setFormData({ ...formData, name: text })}
            />

            <Input
              label="Price *"
              value={formData.price?.toString()}
              onChangeText={text =>
                setFormData({ ...formData, price: parseFloat(text) || 0 })
              }
              keyboardType="numeric"
            />

            <Input
              label="Description"
              value={formData.desc}
              onChangeText={text => setFormData({ ...formData, desc: text })}
              multiline
              numberOfLines={3}
            />

            <Input
              label="Ingredients"
              value={formData.ingredients}
              onChangeText={text =>
                setFormData({ ...formData, ingredients: text })
              }
              multiline
              numberOfLines={2}
            />

            <Input
              label="Priority"
              value={formData.priority?.toString()}
              onChangeText={text =>
                setFormData({ ...formData, priority: parseInt(text) || 1 })
              }
              keyboardType="numeric"
            />

            <Input
              label="Image URL"
              value={formData.imgSrc}
              onChangeText={text => setFormData({ ...formData, imgSrc: text })}
              containerStyle={styles.lastInput}
            />

            <View style={styles.modalActions}>
              <Button
                mode="contained"
                onPress={isEditModalVisible ? handleUpdateItem : handleAddItem}
                loading={loading}
                style={styles.modalButton}
              >
                {isEditModalVisible ? 'Update' : 'Add'}
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setAddModalVisible(false);
                  setEditModalVisible(false);
                  resetForm();
                }}
                style={styles.modalButton}
              >
                Cancel
              </Button>
            </View>
          </ScrollView>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          visible={isDeleteModalVisible}
          onDismiss={() => setDeleteModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text variant="headlineSmall" style={styles.modalTitle}>
            Delete Menu Item?
          </Text>
          <Text variant="bodyLarge" style={styles.deleteText}>
            Are you sure you want to delete "{selectedItem?.name}"? This action
            cannot be undone.
          </Text>
          <View style={styles.modalActions}>
            <Button
              mode="contained"
              onPress={handleDeleteItem}
              loading={loading}
              style={[styles.modalButton, styles.deleteButtonModal]}
            >
              Delete
            </Button>
            <Button
              mode="outlined"
              onPress={() => setDeleteModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
  },
  addButton: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuCard: {
    marginBottom: 16,
  },
  menuCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuInfo: {
    flex: 1,
    marginLeft: 16,
  },
  menuName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  menuPrice: {
    color: '#16a34a',
    fontWeight: '600',
    marginTop: 4,
  },
  menuDesc: {
    color: '#666',
    marginTop: 4,
  },
  menuActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
  },
  lastInput: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  modalButton: {
    flex: 1,
  },
  deleteButtonModal: {
    backgroundColor: '#ef4444',
  },
  deleteText: {
    marginBottom: 24,
  },
});
