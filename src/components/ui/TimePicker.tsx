import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Clock } from 'lucide-react-native';
import { moderateScale, spacing, fontSize } from '../../utils/responsive';

interface TimePickerProps {
  label: string;
  value?: string;
  onChange: (time: string) => void;
  style?: any;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  style,
}) => {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(() => {
    if (value) {
      // Parse time string like "5:30am" to Date
      const timeMatch = value.match(/(\d+):(\d+)(am|pm)/i);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        const isPM = timeMatch[3].toLowerCase() === 'pm';
        const date = new Date();
        date.setHours(
          isPM && hours !== 12 ? hours + 12 : hours === 12 && !isPM ? 0 : hours,
        );
        date.setMinutes(minutes);
        return date;
      }
    }
    return new Date();
  });

  const formatTime = (date: Date): string => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
    return `${hours}:${minutesStr}${ampm}`;
  };

  const handleChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }

    if (selectedDate) {
      setDate(selectedDate);
      onChange(formatTime(selectedDate));
    }
  };

  const handlePress = () => {
    setShow(true);
  };

  const handleDismiss = () => {
    setShow(false);
  };

  return (
    <View style={[styles.container, style]}>
      <Text
        variant="bodySmall"
        style={[styles.label, { color: theme.colors.onSurfaceVariant }]}
      >
        {label}
      </Text>
      <TouchableRipple
        onPress={handlePress}
        style={[
          styles.timeButton,
          {
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.surface,
          },
        ]}
        borderless
      >
        <View style={styles.timeButtonContent}>
          <Clock size={moderateScale(20)} color={theme.colors.primary} />
          <Text variant="bodyLarge" style={styles.timeText}>
            {value || 'Select time'}
          </Text>
        </View>
      </TouchableRipple>

      {show && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          {...(Platform.OS === 'ios' && { onTouchCancel: handleDismiss })}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    fontSize: fontSize.sm,
  },
  timeButton: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  timeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  timeText: {
    flex: 1,
  },
});
