
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadSectionData, saveSectionData, loadAllSectionData } from '@/utils/medicalProfileService';

interface MedicalProfileContextType {
  profileData: Record<string, any>;
  updateSectionData: (section: string, data: any) => void;
  loadSection: (section: string) => any;
  saveSection: (section: string) => boolean;
}

const MedicalProfileContext = createContext<MedicalProfileContextType | undefined>(undefined);

export const MedicalProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profileData, setProfileData] = useState<Record<string, any>>({});

  // Load all profile data on initial mount
  useEffect(() => {
    console.log('Loading all profile data in MedicalProfileProvider');
    const data = loadAllSectionData();
    setProfileData(data);
    
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
  }, []);

  // Update a specific section's data
  const updateSectionData = (section: string, data: any) => {
    console.log(`Updating section data for ${section}:`, data);
    
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
  };

  // Load data for a specific section
  const loadSection = (section: string) => {
    console.log(`Loading section data for ${section}`);
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
  };

  // Save data for a specific section
  const saveSection = (section: string) => {
    console.log(`Saving section data for ${section}`);
    const success = saveSectionData(section, profileData[section]);
    return success;
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

  return (
    <MedicalProfileContext.Provider 
      value={{ 
        profileData, 
        updateSectionData, 
        loadSection, 
        saveSection 
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
