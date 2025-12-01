import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  TextInput as PaperTextInput,
  HelperText,
  useTheme,
} from 'react-native-paper';
import { Eye, EyeOff, LucideIcon } from 'lucide-react-native';

// Omit 'error' from PaperTextInput props because Paper expects boolean, but we want string | boolean
type PaperInputProps = React.ComponentProps<typeof PaperTextInput>;

interface InputProps extends Omit<PaperInputProps, 'error'> {
  label?: string;
  error?: string | boolean;
  containerStyle?: any;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
}

export function Input({
  label,
  error,
  containerStyle,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconPress,
  secureTextEntry,
  ...props
}: InputProps) {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(
    !secureTextEntry,
  );

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine if we should treat this as a password field
  const isPassword = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      <PaperTextInput
        mode="outlined"
        label={label}
        error={!!error}
        secureTextEntry={isPassword}
        theme={{
          roundness: 12,
          colors: { background: 'white' },
        }}
        left={
          LeftIcon ? (
            <PaperTextInput.Icon
              icon={({ size, color }) => <LeftIcon size={size} color={color} />}
            />
          ) : null
        }
        right={
          secureTextEntry ? (
            <PaperTextInput.Icon
              icon={({ size, color }) =>
                isPasswordVisible ? (
                  <EyeOff size={size} color={color} />
                ) : (
                  <Eye size={size} color={color} />
                )
              }
              onPress={togglePasswordVisibility}
            />
          ) : RightIcon ? (
            <PaperTextInput.Icon
              icon={({ size, color }) => (
                <RightIcon size={size} color={color} />
              )}
              onPress={onRightIconPress}
            />
          ) : null
        }
        {...props}
      />
      {typeof error === 'string' && (
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    marginTop: 4,
  },
});
