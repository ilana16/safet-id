
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { loadAllSectionData, saveAllSectionData } from '@/utils/medicalProfileService';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  syncProfileData: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile data with Supabase
  const syncProfileData = async (): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      // Save current data to Supabase
      await saveAllSectionData();
      
      // Load latest data from Supabase
      await loadAllSectionData();
      
      return true;
    } catch (error) {
      console.error('Error syncing profile data:', error);
      return false;
    }
  };
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        localStorage.setItem('isLoggedIn', session ? 'true' : 'false');
        
        // When user logs in, load their data
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            await loadAllSectionData();
          } catch (err) {
            console.error('Error loading profile data on sign in:', err);
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      localStorage.setItem('isLoggedIn', session ? 'true' : 'false');
      
      // If session exists, load user data
      if (session?.user) {
        loadAllSectionData().catch(err => {
          console.error('Error loading initial profile data:', err);
        }).finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Save data before signing out
    await saveAllSectionData();
    
    await supabase.auth.signOut();
    localStorage.setItem('isLoggedIn', 'false');
  };

  return (
    <AuthContext.Provider value={{ session, user, isLoading, signOut, syncProfileData }}>
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
