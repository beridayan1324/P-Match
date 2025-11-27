import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

interface InputFieldProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function InputField({ 
  label, 
  icon, 
  error, 
  multiline = false,
  numberOfLines = 1,
  style,
  ...props 
}: InputFieldProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError, multiline && styles.multilineContainer]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={theme.colors.textLight} 
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input, 
            icon && styles.inputWithIcon,
            multiline && styles.multilineInput,
            style
          ]}
          placeholderTextColor={theme.colors.textLight}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.card,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: theme.spacing.md,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  multilineInput: {
    minHeight: 100,
    paddingTop: 0,
  },
  inputError: {
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});