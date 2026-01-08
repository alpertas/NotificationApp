import { StyleSheet } from 'react-native';
import { theme, spacing } from '../../../core/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.l, // 24
  },
  headerContainer: {
    marginBottom: spacing.xl,
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: spacing.s,
  },
  subtitle: {
    color: theme.colors.textSecondary,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surface,
    marginBottom: 4,
    fontSize: 16,
  },
  helperText: {
    marginBottom: spacing.s,
    marginTop: -4,
  },
  button: {
    marginTop: spacing.m,
    borderRadius: 16,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkContainer: {
    marginTop: spacing.l,
    alignItems: 'center',
    padding: spacing.s,
  },
});
