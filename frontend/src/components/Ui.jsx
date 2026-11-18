import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';

export function PrimaryButton({ title, onPress, compact = false, disabled = false, danger = false }) {
  return (
    <Pressable
      disabled={disabled}
      style={[styles.button, compact && styles.buttonCompact, danger && styles.buttonDanger, disabled && styles.buttonDisabled]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, value, onChangeText, secureTextEntry, keyboardType }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}

export function Panel({ children, style }) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function MoedasPill({ moedas }) {
  return (
    <View style={styles.moedas}>
      <Text style={styles.moedasText}>🪙 {moedas} MOEDAS</Text>
    </View>
  );
}

export function StatusMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.message}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    borderRadius: 6,
    padding: 12,
    backgroundColor: colors.border,
  },
  fieldRow: {
    marginBottom: 8,
  },
  label: {
    marginBottom: 3,
    color: colors.card,
    fontSize: 11,
    fontWeight: '900',
  },
  input: {
    minHeight: 28,
    paddingHorizontal: 8,
    backgroundColor: colors.muted,
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  button: {
    minHeight: 34,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  buttonCompact: {
    minHeight: 28,
    minWidth: 120,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.card,
    fontSize: 11,
    fontWeight: '900',
  },
  moedas: {
    alignSelf: 'center',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primaryDark,
  },
  moedasText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '900',
  },
  message: {
    width: '100%',
    borderRadius: 6,
    padding: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 16,
    textAlign: 'center',
  },
});
