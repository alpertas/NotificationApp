import React, { useState } from 'react';
import { View, TextInput as RNTextInput, NativeSyntheticEvent, TextInputFocusEventData, TargetedEvent } from 'react-native';
import { Text } from 'react-native-paper';
import { styles } from '../notification.styles';
import { theme } from '../../../core/theme';

interface CustomLabeledInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  placeholder?: string;
  error?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
}

export const CustomLabeledInput = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  multiline = false,
  numberOfLines = 1,
  disabled = false,
}: CustomLabeledInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
    setIsFocused(false);
    onBlur && onBlur(e);
  };

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputBox,
          isFocused && styles.inputBoxFocused,
          error && styles.inputBoxError,
          disabled && styles.inputBoxDisabled,
          multiline && { height: 120 }
        ]}
      >
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          style={[
            styles.nativeInput,
            multiline && { textAlignVertical: 'top', paddingTop: 12 }
          ]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled}
        />
      </View>
    </View>
  );
};
