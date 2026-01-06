import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User 
} from 'firebase/auth';
import { auth } from '../../../core/config/firebase';
import { storage } from '../../../core/utils/storage';
import { LoginCredentials, RegisterCredentials } from '../authTypes'; 

// We need to define types locally if not yet exists, or better create a types file.
// For now I'll assume usage match.

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const { email, password } = credentials;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get ID Token
    const token = await user.getIdToken();
    await storage.setToken(token);
    
    return user;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const { email, password } = credentials;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get ID Token
    const token = await user.getIdToken();
    await storage.setToken(token);

    return user;
  },

  logout: async () => {
    await signOut(auth);
    await storage.deleteToken();
  },

  getCurrentUser: () => {
    return auth.currentUser;
  }
};
