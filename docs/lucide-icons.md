# Lucide React Native Icons Guide

## Installation ✅

Lucide React Native is now installed in your project!

## Usage

### Basic Import

```tsx
import { User, Lock, Mail, Eye, EyeOff, Image } from 'lucide-react-native';
```

### Using Icons

```tsx
// Simple icon
<User color="#16a34a" size={24} />

// With custom styling
<Lock
  color={theme.colors.primary}
  size={20}
  strokeWidth={2}
/>

// In TextInput (React Native Paper)
<TextInput
  label="Email"
  left={<Mail color="#5a5045" size={20} />}
/>
```

## Common Icons for Your App

### Authentication & User

- `User` - User profile, account
- `UserPlus` - Registration
- `LogIn` - Login
- `LogOut` - Logout
- `Lock` - Password
- `Unlock` - Unlock
- `Eye` / `EyeOff` - Password visibility
- `Mail` - Email
- `Phone` - Phone number

### Food & Restaurant

- `UtensilsCrossed` - Restaurant, dining
- `ChefHat` - Chef, cooking
- `Soup` - Food items
- `Coffee` - Beverages
- `Pizza` - Fast food
- `Salad` - Healthy food
- `Leaf` - Vegetarian (perfect for Swamy Hot Foods!)

### E-commerce & Shopping

- `ShoppingCart` - Cart
- `ShoppingBag` - Shopping
- `CreditCard` - Payment
- `Wallet` - Wallet
- `Receipt` - Order receipt
- `Package` - Delivery
- `Truck` - Shipping

### Navigation & UI

- `Home` - Home screen
- `Menu` - Menu/hamburger
- `Search` - Search
- `Filter` - Filters
- `Settings` - Settings
- `Bell` - Notifications
- `Heart` - Favorites
- `Star` - Ratings
- `MapPin` - Location
- `Navigation` - Directions

### Actions

- `Plus` - Add
- `Minus` - Remove
- `X` - Close
- `Check` - Confirm
- `ChevronRight` - Next
- `ChevronLeft` - Back
- `ChevronDown` - Dropdown
- `Edit` - Edit
- `Trash2` - Delete
- `Share2` - Share

## Example: Updated RegisterScreen

```tsx
import { User, Lock, LockKeyhole, Image, Eye, EyeOff } from 'lucide-react-native';

// Username input
<View style={{ position: 'relative' }}>
  <User
    color="#5a5045"
    size={20}
    style={{ position: 'absolute', left: 12, top: 16, zIndex: 1 }}
  />
  <TextInput
    label="Username"
    value={username}
    style={{ paddingLeft: 40 }}
  />
</View>

// Password with toggle
<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
  {showPassword ? (
    <EyeOff color="#5a5045" size={20} />
  ) : (
    <Eye color="#5a5045" size={20} />
  )}
</TouchableOpacity>
```

## Styling Tips

### Match Your Design System

```tsx
// Primary color (Curry Leaf Green)
<Leaf color="#16a34a" size={24} />

// Secondary color (Ocean Blue)
<User color="#1d4ed8" size={24} />

// Accent color (Saffron Gold)
<Star color="#c08810" size={24} />

// Muted/Disabled
<Settings color="#9a8a72" size={20} />
```

### Responsive Sizing

```tsx
// Small (16px) - For inline text
<Mail size={16} />

// Medium (20px) - For inputs, buttons
<User size={20} />

// Large (24px) - For headers, featured items
<ShoppingCart size={24} />

// Extra Large (32px) - For hero sections
<ChefHat size={32} />
```

## All Available Icons

Browse all 1000+ icons at: https://lucide.dev/icons/

## Integration with React Native Paper

Lucide icons work great alongside Paper's Material icons:

```tsx
import { Button } from 'react-native-paper';
import { ShoppingCart } from 'lucide-react-native';

<Button
  mode="contained"
  icon={() => <ShoppingCart color="#ffffff" size={20} />}
>
  Add to Cart
</Button>;
```

## Performance Note

Lucide icons are **tree-shakeable** - only the icons you import are included in your bundle, keeping your app size small!
