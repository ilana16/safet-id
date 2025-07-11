import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadSectionData, saveSectionData, loadAllSectionData } from '@/utils/medicalProfileService';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface MedicalProfileContextType {
  profileData: Record<string, any>;
  updateSectionData: (section: string, data: any) => void;
  loadSection: (section: string) => any;
  saveSection: (section: string) => Promise<boolean>;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  saveCurrentSection: (section: string) => Promise<boolean>;
  syncWithFirestore: () => Promise<boolean>;
}

const MedicalProfileContext = createContext<MedicalProfileContextType | undefined>(undefined);

export const MedicalProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    console.log('Loading all profile data in MedicalProfileProvider');
    try {
      loadAllSectionData().then(data => {
        setProfileData(data);
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  }, [user]);

  const updateSectionData = (section: string, data: any) => {
    console.log(`Updating ${section} data in context:`, data);
    setProfileData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const loadSection = (section: string) => {
    console.log(`Loading ${section} data from context`);
    const data = loadSectionData(section);
    setProfileData(prev => ({
      ...prev,
      [section]: data
    }));
    return data;
  };

  const saveSection = async (section: string): Promise<boolean> => {
    if (isSaving) {
      console.log('Already saving, skipping...');
      return false;
    }
    
    setIsSaving(true);
    try {
      console.log(`Saving ${section} data from context`);
      const success = await saveSectionData(section, profileData[section]);
      if (success) {
        toast.success(`${section} data saved successfully`);
      } else {
        toast.error(`Failed to save ${section} data`);
      }
      return success;
    } catch (error) {
      console.error(`Error saving ${section}:`, error);
      toast.error(`Error saving ${section} data`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveCurrentSection = async (section: string): Promise<boolean> => {
    return await saveSection(section);
  };

  const syncWithFirestore = async (): Promise<boolean> => {
    if (!user) {
      console.log('No user logged in, cannot sync with Firestore');
      return false;
    }

    try {
      console.log('Syncing all sections with Firestore');
      const sections = ['personal', 'history', 'medications', 'allergies', 'immunizations', 'social', 'reproductive', 'mental', 'functional', 'cultural'];
      
      for (const section of sections) {
        if (profileData[section]) {
          await saveSectionData(section, profileData[section]);
        }
      }
      
      toast.success('Profile synced with Firestore successfully');
      return true;
    } catch (error) {
      console.error('Error syncing with Firestore:', error);
      toast.error('Failed to sync with Firestore');
      return false;
    }
  };

  return (
    <MedicalProfileContext.Provider value={{
      profileData,
      updateSectionData,
      loadSection,
      saveSection,
      isEditing,
      setIsEditing,
      saveCurrentSection,
      syncWithFirestore
    }}>
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

