import { useContext } from 'react';
import { ToastProvider, useToast as useToastContext } from '../providers/ToastProvider';

// Re-exporting from Provider or defining here if we split context definition
// Ideally we keep implementation in Provider file or separate Context file.
// Since I exported useToast from Provider, I can just re-export it here or import it.

// Let's re-export for cleaner imports
export { useToast } from '../providers/ToastProvider';
