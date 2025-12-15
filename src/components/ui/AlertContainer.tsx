import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAlertStore } from '../../stores/useAlertStore';
import { Alert } from './Alert';

export const AlertContainer: React.FC = () => {
  const { alerts } = useAlertStore();

  if (alerts.length === 0) {
    return null;
  }

  // Show only the most recent alert to avoid overlapping
  const currentAlert = alerts[alerts.length - 1];

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Alert alert={currentAlert} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
});
