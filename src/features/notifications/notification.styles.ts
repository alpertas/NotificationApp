import { StyleSheet } from 'react-native';
import { theme, spacing } from '../../core/theme';

export const createStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    marginBottom: spacing.s,
  },
  backButton: {
    marginRight: spacing.s,
    marginLeft: -spacing.s,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    color: theme.colors.textSecondary,
  },
  formContainer: {
    paddingHorizontal: spacing.l,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: spacing.l,
    elevation: 2,
    shadowColor: theme.colors.backdrop,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: spacing.l,
    borderWidth: 1,
    borderColor: theme.palette.grey200,
  },
  inputContainer: {
    marginBottom: spacing.l,
  },
  inputWrapper: {
    // Wrapper around label and input box
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    marginLeft: 2,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: theme.palette.grey300,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    paddingHorizontal: spacing.m,
    minHeight: 56,
    justifyContent: 'center',
  },
  inputBoxFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
  },
  inputBoxError: {
    borderColor: theme.colors.error,
  },
  inputBoxDisabled: {
    backgroundColor: theme.palette.grey200,
    opacity: 0.7,
  },
  nativeInput: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
    minHeight: 20,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    paddingHorizontal: 0,
    marginTop: 0,
    flex: 1,
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginLeft: 8,
  },
  charCountError: {
    color: theme.colors.error,
  },
  button: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  testButton: {
    borderRadius: 12,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  draftButton: {
    borderRadius: 12,
    borderColor: theme.palette.grey300,
    backgroundColor: theme.palette.grey100,
    borderWidth: 1,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: theme.colors.onPrimary,
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
  },
});

export const listStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    headerTitle: {
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    headerSubtitle: {
        color: theme.colors.textSecondary,
    },
    list: {
        padding: spacing.l,
        paddingTop: 0,
    },
    cardContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: spacing.m,
        padding: spacing.m,
        flexDirection: 'row',
        alignItems: 'flex-start',
        // Shadow
        elevation: 2,
        shadowColor: theme.colors.backdrop,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    cardIconContainer: {
        backgroundColor: theme.palette.grey100, // Fallback if not status color
        borderRadius: 12,
        marginRight: spacing.m,
        justifyContent: 'center',
        alignItems: 'center',
        width: 48,
        height: 48,
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardTitle: {
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        flex: 1,
        marginRight: spacing.s,
    },
    cardDate: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    cardBody: {
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    loader: {
        marginTop: 50,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: spacing.m,
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    emptySubText: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginTop: spacing.s,
    },
    fab: {
        position: 'absolute',
        margin: spacing.l,
        right: 0,
        bottom: 20,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
    },
});

export const skeletonStyles = StyleSheet.create({
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
