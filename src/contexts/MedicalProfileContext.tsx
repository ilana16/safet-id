
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadSectionData, saveSectionData, loadAllSectionData } from '@/utils/medicalProfileService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MedicalProfileContextType {
  profileData: Record<string, any>;
  updateSectionData: (section: string, data: any) => void;
  loadSection: (section: string) => any;
  saveSection: (section: string) => boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  saveCurrentSection: (section: string) => Promise<boolean>;
  syncWithSupabase: () => Promise<boolean>;
}

const MedicalProfileContext = createContext<MedicalProfileContextType | undefined>(undefined);

export const MedicalProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Check for authenticated user
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUserId(data.session?.user?.id || null);
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setUserId(session?.user?.id || null);
          }
        );
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error checking auth state:', error);
      }
    };
    
    checkAuth();
  }, []);

  // Load all profile data on initial mount
  useEffect(() => {
    console.log('Loading all profile data in MedicalProfileProvider');
    try {
      loadAllSectionData().then(data => {
        setProfileData(data);
      });
      
      // Set up auto-save
      const autoSaveInterval = setInterval(() => {
        console.log('Auto-saving all profile data');
        Object.keys(profileData).forEach(section => {
          if (section && profileData[section]) {
            saveSectionData(section, profileData[section]);
          }
        });
      }, 5000); // Save every 5 seconds
      
      return () => clearInterval(autoSaveInterval);
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast.error('Error loading profile data. Please refresh the page.');
    }
  }, []);

  // Sync data with Supabase when user changes
  useEffect(() => {
    if (userId && Object.keys(profileData).length > 0) {
      // Sync data to Supabase when user logs in
      syncWithSupabase();
    }
  }, [userId]);

  // Sync with Supabase
  const syncWithSupabase = async (): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      await loadAllSectionData();
      return true;
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
      return false;
    }
  };

  // Update a specific section's data
  const updateSectionData = (section: string, data: any) => {
    console.log(`Updating section data for ${section}:`, data);
    
    try {
      setProfileData(prevData => {
        const newData = {
          ...prevData,
          [section]: {
            ...data,
            lastUpdated: new Date().toISOString()
          }
        };
        
        // Update window object for interoperability with other components
        const windowKey = getWindowKeyForSection(section);
        if (windowKey) {
          (window as any)[windowKey] = { ...data };
        }
        
        return newData;
      });
    } catch (error) {
      console.error(`Error updating section data for ${section}:`, error);
      toast.error(`Error updating ${section} data`);
    }
  };

  // Load data for a specific section
  const loadSection = (section: string) => {
    console.log(`Loading section data for ${section}`);
    try {
      const sectionData = loadSectionData(section);
      
      setProfileData(prevData => ({
        ...prevData,
        [section]: sectionData
      }));
      
      // Update window object for interoperability
      const windowKey = getWindowKeyForSection(section);
      if (windowKey) {
        (window as any)[windowKey] = { ...sectionData };
      }
      
      return sectionData;
    } catch (error) {
      console.error(`Error loading section data for ${section}:`, error);
      toast.error(`Error loading ${section} data`);
      return {};
    }
  };

  // Save data for a specific section
  const saveSection = (section: string) => {
    console.log(`Saving section data for ${section}`);
    try {
      const success = saveSectionData(section, profileData[section]);
      if (!success) {
        toast.error(`Error saving ${section} data`);
      }
      return success;
    } catch (error) {
      console.error(`Error saving section data for ${section}:`, error);
      toast.error(`Error saving ${section} data`);
      return false;
    }
  };

  // Save the current section with loading state
  const saveCurrentSection = async (section: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      const success = saveSection(section);
      
      if (success) {
        toast.success(`${getSectionTitle(section)} saved successfully`);
        setIsEditing(false);
      }
      
      return success;
    } catch (error) {
      console.error(`Error saving ${section}:`, error);
      toast.error(`Failed to save ${section}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to get window key for section
  const getWindowKeyForSection = (section: string): string => {
    switch (section) {
      case 'personal': return 'personalFormData';
      case 'history': return 'historyFormData';
      case 'medications': return 'medicationsFormData';
      case 'allergies': return 'allergiesFormData';
      case 'immunizations': return 'immunizationsFormData';
      case 'social': return 'socialHistoryFormData';
      case 'reproductive': return 'reproductiveHistoryFormData';
      case 'mental': return 'mentalHealthFormData';
      case 'functional': return 'functionalStatusFormData';
      case 'cultural': return 'culturalPreferencesFormData';
      default: return '';
    }
  };

  // Helper function to get human-readable section title
  const getSectionTitle = (section: string): string => {
    switch (section) {
      case 'personal': return 'Personal Information';
      case 'history': return 'Medical History';
      case 'medications': return 'Medications';
      case 'allergies': return 'Allergies';
      case 'immunizations': return 'Immunizations & Vaccines';
      case 'social': return 'Social History';
      case 'reproductive': return 'Reproductive History';
      case 'mental': return 'Mental Health';
      case 'functional': return 'Functional Status';
      case 'cultural': return 'Cultural Preferences';
      default: return 'Section';
    }
  };

  return (
    <MedicalProfileContext.Provider 
      value={{ 
        profileData, 
        updateSectionData, 
        loadSection, 
        saveSection,
        isEditing,
        setIsEditing,
        saveCurrentSection,
        syncWithSupabase
      }}
    >
      {children}
    </MedicalProfileContext.Provider>
  );
};

export const useMedicalProfile = () => {
  const context = useContext(MedicalProfileContext);
  if (context === undefined) {
    throw new Error('useMedicalProfile must be used within a MedicalProfileProvider');
  }
  return context;
};
