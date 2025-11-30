# React Native Paper - Component Guide

## Why React Native Paper?

✅ **Production-Ready** - Used by thousands of apps  
✅ **40+ Components** - Buttons, inputs, cards, modals, etc.  
✅ **Fully Themed** - Matches Swamy Hot Foods design system  
✅ **TypeScript** - Full type safety  
✅ **Accessibility** - Built-in a11y features  
✅ **Active Development** - Regular updates

## Available Components

### Buttons

```tsx
import { Button } from 'react-native-paper';

// Primary button
<Button mode="contained">Explore Menu</Button>

// Secondary button
<Button mode="outlined">Learn More</Button>

// Text button
<Button mode="text">Cancel</Button>

// With icon
<Button mode="contained" icon="cart">Add to Cart</Button>
```

### Text Inputs

```tsx
import { TextInput } from 'react-native-paper';

// Standard input
<TextInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  mode="outlined"
/>

// With icon
<TextInput
  label="Search"
  left={<TextInput.Icon icon="magnify" />}
/>

// Password input
<TextInput
  label="Password"
  secureTextEntry
  right={<TextInput.Icon icon="eye" />}
/>
```

### Cards

```tsx
import { Card, Text } from 'react-native-paper';

<Card>
  <Card.Cover source={{ uri: 'https://...' }} />
  <Card.Title title="Masala Dosa" subtitle="₹120" />
  <Card.Content>
    <Text>Crispy rice crepe with spiced potato filling</Text>
  </Card.Content>
  <Card.Actions>
    <Button>Order Now</Button>
  </Card.Actions>
</Card>;
```

### Dialogs & Modals

```tsx
import { Dialog, Portal, Button } from 'react-native-paper';

<Portal>
  <Dialog visible={visible} onDismiss={hideDialog}>
    <Dialog.Title>Confirm Order</Dialog.Title>
    <Dialog.Content>
      <Text>Are you sure you want to place this order?</Text>
    </Dialog.Content>
    <Dialog.Actions>
      <Button onPress={hideDialog}>Cancel</Button>
      <Button onPress={confirmOrder}>Confirm</Button>
    </Dialog.Actions>
  </Dialog>
</Portal>;
```

### Snackbars (Toasts)

```tsx
import { Snackbar } from 'react-native-paper';

<Snackbar
  visible={visible}
  onDismiss={onDismiss}
  action={{
    label: 'Undo',
    onPress: () => {},
  }}
>
  Item added to cart
</Snackbar>;
```

### Lists

```tsx
import { List } from 'react-native-paper';

<List.Section>
  <List.Subheader>Menu Categories</List.Subheader>
  <List.Item
    title="South Indian"
    left={() => <List.Icon icon="food" />}
    onPress={() => {}}
  />
  <List.Item title="North Indian" left={() => <List.Icon icon="food" />} />
</List.Section>;
```

### Chips

```tsx
import { Chip } from 'react-native-paper';

<Chip icon="leaf" onPress={() => {}}>Vegetarian</Chip>
<Chip mode="outlined">Spicy</Chip>
<Chip selected>Popular</Chip>
```

### FAB (Floating Action Button)

```tsx
import { FAB } from 'react-native-paper';

<FAB icon="plus" style={styles.fab} onPress={() => {}} />;
```

### Badges

```tsx
import { Badge } from 'react-native-paper';

<Badge>3</Badge>
<Badge size={24}>New</Badge>
```

### Progress Indicators

```tsx
import { ProgressBar, ActivityIndicator } from 'react-native-paper';

<ProgressBar progress={0.5} />
<ActivityIndicator animating={true} />
```

## Theme Usage

Your app is already configured with Swamy Hot Foods theme!

### Accessing Theme Colors

```tsx
import { useTheme } from 'react-native-paper';

function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.primary }}>
      <Text style={{ color: theme.colors.onPrimary }}>Swamy Hot Foods</Text>
    </View>
  );
}
```

### Theme Colors Available

- `primary` - Curry Leaf Green (#16a34a)
- `secondary` - Ocean Blue (#1d4ed8)
- `tertiary` - Saffron Gold (#c08810)
- `error` - Red (#dc2626)
- `background` - Warm Cream (#fdfcfb)
- `surface` - White (#ffffff)
- `success` - Green (#16a34a)
- `warning` - Amber (#d97706)
- `info` - Cyan (#0284c7)

## Example: Refactored RegisterScreen with Paper

```tsx
import { TextInput, Button, HelperText } from 'react-native-paper';

// Replace custom Input with Paper TextInput
<TextInput
  label="Username"
  value={username}
  onChangeText={setUsername}
  mode="outlined"
  error={!!errors.username}
/>
<HelperText type="error" visible={!!errors.username}>
  {errors.username}
</HelperText>

// Replace custom button with Paper Button
<Button
  mode="contained"
  onPress={handleRegister}
  loading={loading}
  disabled={loading}
>
  Create Account
</Button>
```

## Documentation

Full documentation: https://callstack.github.io/react-native-paper/

## Next Steps

1. ✅ Theme configured with your design system
2. ✅ PaperProvider wrapping your app
3. 🔄 Optionally refactor components to use Paper
4. 🔄 Add more screens with Paper components
