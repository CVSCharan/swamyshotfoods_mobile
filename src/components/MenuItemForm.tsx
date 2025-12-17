import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Checkbox, Divider, useTheme } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { Input } from '../components/Input';
import { TimePicker } from '../components/ui/TimePicker';
import { IngredientsManager } from '../components/ui/IngredientsManager';
import { MultiSelectChips } from '../components/ui/MultiSelectChips';
import { MenuItem } from '../stores/useMenuStore';
import { spacing, moderateScale } from '../utils/responsive';

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

interface MenuItemFormProps {
  initialData?: Partial<MenuItem>;
  onDataChange?: (data: Partial<MenuItem>) => void;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({
  initialData,
  onDataChange,
}) => {
  const theme = useTheme();

  const [formData, setFormData] = useState<Partial<MenuItem>>(
    initialData || {
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
    },
  );

  const [hasMorningTimings, setHasMorningTimings] = useState(
    !!initialData?.morningTimings,
  );
  const [hasEveningTimings, setHasEveningTimings] = useState(
    !!initialData?.eveningTimings,
  );

  const updateFormData = (updates: Partial<MenuItem>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
    onDataChange?.(newData);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      {/* BASIC INFORMATION */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        📋 Basic Information
      </Text>
      <Divider style={styles.divider} />

      <Input
        label="Name *"
        value={formData.name}
        onChangeText={text => updateFormData({ name: text })}
        placeholder="e.g., Idly with chutney (4 pieces)"
      />

      <Input
        label="Description *"
        value={formData.desc}
        onChangeText={text => updateFormData({ desc: text })}
        multiline
        numberOfLines={3}
        placeholder="Describe the dish..."
      />

      <View style={styles.row}>
        <Input
          label="Price (₹) *"
          value={formData.price?.toString()}
          onChangeText={text =>
            updateFormData({ price: parseFloat(text) || 0 })
          }
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />

        <Input
          label="Priority *"
          value={formData.priority?.toString()}
          onChangeText={text =>
            updateFormData({ priority: parseInt(text) || 1 })
          }
          keyboardType="numeric"
          containerStyle={styles.halfWidth}
        />
      </View>

      <Input
        label="Image URL *"
        value={formData.imgSrc}
        onChangeText={text => updateFormData({ imgSrc: text })}
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
              updateFormData({ morningTimings: null });
            } else {
              updateFormData({
                morningTimings: { startTime: '5:30am', endTime: '10:00am' },
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
              updateFormData({
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
              updateFormData({
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
              updateFormData({ eveningTimings: null });
            } else {
              updateFormData({
                eveningTimings: { startTime: '4:30pm', endTime: '8:30pm' },
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
              updateFormData({
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
              updateFormData({
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
        onChange={ingredients => updateFormData({ ingredients })}
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
        onChange={dietaryLabels => updateFormData({ dietaryLabels })}
      />

      <MultiSelectChips
        label="Allergens"
        options={ALLERGENS}
        selectedValues={formData.allergens || []}
        onChange={allergens => updateFormData({ allergens })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
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
});
