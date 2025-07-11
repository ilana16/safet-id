
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { loadAllSectionData, saveSectionData } from '@/utils/medicalProfileService';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsKjI3BadRGYaQ1GcFmgZEOuUWrL_3kWs",
  authDomain: "safet-id-7b807.firebaseapp.com",
  projectId: "safet-id-7b807",
  storageBucket: "safet-id-7b807.firebasestorage.app",
  messagingSenderId: "367148685926",
  appId: "1:367148685926:web:31e50a8c05adefdc796ba7",
  measurementId: "G-DJJFCXB486"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  syncProfileData: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile data with Firebase (Firestore will be handled in next phase)
  const syncProfileData = async (): Promise<boolean> => {
    if (!user?.uid) return false;
    
    try {
      // For now, we'll just log that data would be synced.
      // Actual data migration to Firestore will happen in the next phase.
      console.log('Syncing profile data for user:', user.uid);
      return true;
    } catch (error) {
      console.error('Error syncing profile data:', error);
      return false;
    }
  };
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      localStorage.setItem('isLoggedIn', currentUser ? 'true' : 'false');
      if (currentUser) {
        // Load data if user is signed in (Firestore will be handled in next phase)
        loadAllSectionData().catch(err => {
          console.error('Error loading initial profile data:', err);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Error signing up:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Error signing in with Google:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    // Save data before signing out (Firestore will be handled in next phase)
    const sections = ['personal', 'history', 'medications', 'allergies', 
                      'immunizations', 'social', 'reproductive', 'mental', 
                      'functional', 'cultural'];
    
    for (const section of sections) {
      await saveSectionData(section);
    }
    
    await firebaseSignOut(auth);
    localStorage.setItem('isLoggedIn', 'false');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signInWithGoogle, signOut, syncProfileData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}




