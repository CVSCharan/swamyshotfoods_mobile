import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  useTheme,
  Chip,
  IconButton,
} from 'react-native-paper';
import { X } from 'lucide-react-native';
import { moderateScale, spacing, fontSize } from '../../utils/responsive';

interface IngredientsManagerProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

export const IngredientsManager: React.FC<IngredientsManagerProps> = ({
  ingredients,
  onChange,
}) => {
  const theme = useTheme();
  const [newIngredient, setNewIngredient] = useState('');

  const addIngredient = () => {
    const trimmed = newIngredient.trim();
    if (!trimmed) return;

    // Capitalize first letter
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    // Check for duplicates (case-insensitive)
    if (
      ingredients.some(ing => ing.toLowerCase() === capitalized.toLowerCase())
    ) {
      return;
    }

    onChange([...ingredients, capitalized]);
    setNewIngredient('');
  };

  const removeIngredient = (index: number) => {
    onChange(ingredients.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text
        variant="bodySmall"
        style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
      >
        Ingredients *
      </Text>

      {/* Ingredients List */}
      {ingredients.length > 0 && (
        <View style={styles.ingredientsList}>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.ingredientContent}>
                <Text variant="bodyMedium" style={styles.ingredientBullet}>
                  •
                </Text>
                <Text variant="bodyMedium" style={styles.ingredientText}>
                  {ingredient}
                </Text>
              </View>
              <IconButton
                icon={() => (
                  <X size={moderateScale(16)} color={theme.colors.error} />
                )}
                size={moderateScale(20)}
                onPress={() => removeIngredient(index)}
                style={styles.removeButton}
              />
            </View>
          ))}
        </View>
      )}

      {/* Add Ingredient Input */}
      <View style={styles.addIngredientRow}>
        <TextInput
          mode="outlined"
          value={newIngredient}
          onChangeText={setNewIngredient}
          placeholder="Add ingredient..."
          style={styles.input}
          onSubmitEditing={addIngredient}
          returnKeyType="done"
          dense
        />
        <IconButton
          icon="plus"
          mode="contained"
          size={moderateScale(20)}
          onPress={addIngredient}
          disabled={!newIngredient.trim()}
          style={styles.addButton}
        />
      </View>

      {ingredients.length === 0 && (
        <Text
          variant="bodySmall"
          style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
        >
          No ingredients added yet
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
    fontSize: fontSize.sm,
  },
  ingredientsList: {
    marginBottom: spacing.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.xs,
    backgroundColor: '#f5f5f5',
    borderRadius: moderateScale(8),
  },
  ingredientContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientBullet: {
    marginRight: spacing.sm,
    fontWeight: 'bold',
  },
  ingredientText: {
    flex: 1,
  },
  removeButton: {
    margin: 0,
  },
  addIngredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
  },
  addButton: {
    margin: 0,
  },
  emptyText: {
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
});
