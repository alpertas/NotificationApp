import { StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12, // Gap between cards
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    marginBottom: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.palette.grey100, // Light gray
    marginRight: 16,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  titleLine: {
    height: 16,
    width: '40%',
    backgroundColor: theme.palette.grey200, // Gray 200
    borderRadius: 4,
  },
  bodyLine: {
    height: 12,
    width: '90%',
    backgroundColor: theme.palette.grey100, // Gray 100
    borderRadius: 4,
  },
});
