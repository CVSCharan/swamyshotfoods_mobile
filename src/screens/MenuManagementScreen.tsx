import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
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
  Checkbox,
  Divider,
  Chip,
} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react-native';

import { useMenuStore, MenuItem } from '../stores/useMenuStore';
import { menuService } from '../services/menuService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { CustomHeader } from '../components/CustomHeader';
import { TimePicker } from '../components/ui/TimePicker';
import { IngredientsManager } from '../components/ui/IngredientsManager';
import { MultiSelectChips } from '../components/ui/MultiSelectChips';
import alert from '../lib/alert';
import { spacing, moderateScale, fontSize } from '../utils/responsive';

// Dietary labels options
const DIETARY_LABELS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'jain', label: 'Jain' },
  { value: 'gluten-free', label: 'Gluten-free' },
];

// Allergens options
const ALLERGENS = [
  { value: 'nuts', label: 'Nuts' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'soy', label: 'Soy' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'gluten', label: 'Gluten' },
];

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

  // Form state with proper types
  const [formData, setFormData] = useState<Partial<MenuItem>>({
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
  });

  // Timing checkboxes
  const [hasMorningTimings, setHasMorningTimings] = useState(false);
  const [hasEveningTimings, setHasEveningTimings] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

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

  const handleAddItem = async () => {
    if (!formData.name || !formData.price) {
      alert.error('Error', 'Name and Price are required');
      return;
    }

    if (!formData.ingredients || formData.ingredients.length === 0) {
      alert.error('Error', 'At least one ingredient is required');
      return;
    }

    setLoading(true);
    try {
      const newItem = await menuService.create(formData);
      addItem(newItem);
      setAddModalVisible(false);
      resetForm();
      alert.success('Success', 'Menu item added successfully');
    } catch (err) {
      alert.error('Error', 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!selectedItem) return;

    if (!formData.ingredients || formData.ingredients.length === 0) {
      alert.error('Error', 'At least one ingredient is required');
      return;
    }

    setLoading(true);
    try {
      await menuService.update(selectedItem._id, formData);
      updateItem(selectedItem._id, formData);
      setEditModalVisible(false);
      resetForm();
      alert.success('Success', 'Menu item updated successfully');
    } catch (err) {
      alert.error('Error', 'Failed to update menu item');
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
      alert.success('Success', 'Menu item deleted successfully');
    } catch (err) {
      alert.error('Error', 'Failed to delete menu item');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      ...item,
      ingredients: item.ingredients || [],
      dietaryLabels: item.dietaryLabels || ['vegetarian'],
      allergens: item.allergens || [],
    });
    setHasMorningTimings(!!item.morningTimings);
    setHasEveningTimings(!!item.eveningTimings);
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
      ingredients: [],
      priority: 1,
      imgSrc: '',
      dietaryLabels: ['vegetarian'],
      allergens: [],
      morningTimings: null,
      eveningTimings: null,
      timingTemplate: null,
    });
    setSelectedItem(null);
    setHasMorningTimings(false);
    setHasEveningTimings(false);
  };

  // Check if item is currently available
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
  };

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
      <CustomHeader title="Menu Management" />
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
          <ScrollView showsVerticalScrollIndicator={true}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              {isEditModalVisible ? 'Edit' : 'Add'} Menu Item
            </Text>

            {/* BASIC INFORMATION */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              📋 Basic Information
            </Text>
            <Divider style={styles.divider} />

            <Input
              label="Name *"
              value={formData.name}
              onChangeText={text => setFormData({ ...formData, name: text })}
              placeholder="e.g., Idly with chutney (4 pieces)"
            />

            <Input
              label="Description *"
              value={formData.desc}
              onChangeText={text => setFormData({ ...formData, desc: text })}
              multiline
              numberOfLines={3}
              placeholder="Describe the dish..."
            />

            <View style={styles.row}>
              <Input
                label="Price (₹) *"
                value={formData.price?.toString()}
                onChangeText={text =>
                  setFormData({ ...formData, price: parseFloat(text) || 0 })
                }
                keyboardType="numeric"
                containerStyle={styles.halfWidth}
              />

              <Input
                label="Priority *"
                value={formData.priority?.toString()}
                onChangeText={text =>
                  setFormData({ ...formData, priority: parseInt(text) || 1 })
                }
                keyboardType="numeric"
                containerStyle={styles.halfWidth}
              />
            </View>

            <Input
              label="Image URL *"
              value={formData.imgSrc}
              onChangeText={text => setFormData({ ...formData, imgSrc: text })}
              placeholder="https://..."
            />

            {/* Image Preview */}
            {formData.imgSrc && (
              <FastImage
                source={{ uri: formData.imgSrc }}
                style={styles.imagePreview}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}

            {/* AVAILABILITY TIMINGS */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              🕐 Availability Timings
            </Text>
            <Divider style={styles.divider} />

            {/* Morning Timings */}
            <View style={styles.checkboxRow}>
              <Checkbox
                status={hasMorningTimings ? 'checked' : 'unchecked'}
                onPress={() => {
                  setHasMorningTimings(!hasMorningTimings);
                  if (hasMorningTimings) {
                    setFormData({ ...formData, morningTimings: null });
                  } else {
                    setFormData({
                      ...formData,
                      morningTimings: {
                        startTime: '5:30am',
                        endTime: '10:00am',
                      },
                    });
                  }
                }}
              />
              <Text variant="bodyLarge">Morning Timings</Text>
            </View>

            {hasMorningTimings && (
              <View style={styles.row}>
                <TimePicker
                  label="Start Time"
                  value={formData.morningTimings?.startTime}
                  onChange={time =>
                    setFormData({
                      ...formData,
                      morningTimings: {
                        ...formData.morningTimings!,
                        startTime: time,
                      },
                    })
                  }
                  style={styles.halfWidth}
                />
                <TimePicker
                  label="End Time"
                  value={formData.morningTimings?.endTime}
                  onChange={time =>
                    setFormData({
                      ...formData,
                      morningTimings: {
                        ...formData.morningTimings!,
                        endTime: time,
                      },
                    })
                  }
                  style={styles.halfWidth}
                />
              </View>
            )}

            {/* Evening Timings */}
            <View style={styles.checkboxRow}>
              <Checkbox
                status={hasEveningTimings ? 'checked' : 'unchecked'}
                onPress={() => {
                  setHasEveningTimings(!hasEveningTimings);
                  if (hasEveningTimings) {
                    setFormData({ ...formData, eveningTimings: null });
                  } else {
                    setFormData({
                      ...formData,
                      eveningTimings: {
                        startTime: '4:30pm',
                        endTime: '8:30pm',
                      },
                    });
                  }
                }}
              />
              <Text variant="bodyLarge">Evening Timings</Text>
            </View>

            {hasEveningTimings && (
              <View style={styles.row}>
                <TimePicker
                  label="Start Time"
                  value={formData.eveningTimings?.startTime}
                  onChange={time =>
                    setFormData({
                      ...formData,
                      eveningTimings: {
                        ...formData.eveningTimings!,
                        startTime: time,
                      },
                    })
                  }
                  style={styles.halfWidth}
                />
                <TimePicker
                  label="End Time"
                  value={formData.eveningTimings?.endTime}
                  onChange={time =>
                    setFormData({
                      ...formData,
                      eveningTimings: {
                        ...formData.eveningTimings!,
                        endTime: time,
                      },
                    })
                  }
                  style={styles.halfWidth}
                />
              </View>
            )}

            {/* INGREDIENTS */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              🥘 Ingredients
            </Text>
            <Divider style={styles.divider} />

            <IngredientsManager
              ingredients={formData.ingredients || []}
              onChange={ingredients =>
                setFormData({ ...formData, ingredients })
              }
            />

            {/* DIETARY INFORMATION */}
            <Text variant="titleMedium" style={styles.sectionTitle}>
              🌱 Dietary Information
            </Text>
            <Divider style={styles.divider} />

            <MultiSelectChips
              label="Dietary Labels"
              options={DIETARY_LABELS}
              selectedValues={formData.dietaryLabels || []}
              onChange={dietaryLabels =>
                setFormData({ ...formData, dietaryLabels })
              }
            />

            <MultiSelectChips
              label="Allergens"
              options={ALLERGENS}
              selectedValues={formData.allergens || []}
              onChange={allergens => setFormData({ ...formData, allergens })}
            />

            {/* Modal Actions */}
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
    padding: spacing.lg,
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
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    width: moderateScale(128),
    height: moderateScale(128),
    borderRadius: moderateScale(64),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: '#666',
  },
  addButton: {
    marginBottom: spacing.xxl,
  },
  card: {
    marginBottom: spacing.xxl,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  modalContainer: {
    backgroundColor: 'white',
    padding: spacing.xl,
    margin: spacing.xl,
    borderRadius: moderateScale(12),
    maxHeight: '90%',
  },
  modalTitle: {
    marginBottom: spacing.lg,
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  divider: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  imagePreview: {
    width: '100%',
    height: moderateScale(200),
    borderRadius: moderateScale(8),
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  modalButton: {
    flex: 1,
  },
  deleteButtonModal: {
    backgroundColor: '#ef4444',
  },
  deleteText: {
    marginBottom: spacing.xxl,
  },
});
