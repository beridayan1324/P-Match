import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  children: React.ReactNode;
  colors?: [string, string, ...string[]];
}

export default function GradientBackground({ children, colors }: Props) {
  return (
    <LinearGradient
      colors={colors || ['#FF4F70', '#6C5CE7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});