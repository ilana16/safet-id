
import { useState, useEffect } from 'react';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';
import { toast } from '@/lib/toast';

export const useMedicalProfileSection = (currentSection: string) => {
  const { profileData, saveSection, loadSection } = useMedicalProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  
  // Load section data
  useEffect(() => {
    console.log(`Route changed, loading section: ${currentSection}`);
    setIsLoadingData(true);
    
    try {
      loadSection(currentSection);
    } catch (error) {
      console.error('Error reloading section data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [currentSection, loadSection]);

  const saveCurrentSectionData = () => {
    console.log(`Attempting to save data for section: ${currentSection}`);
    setIsSaving(true);
    
    try {
      const saved = saveSection(currentSection);
      
      if (saved) {
        toast.success(`${getSectionTitle(currentSection)} information saved successfully`);
        if (currentSection !== 'medications') {
          setIsEditing(false);
        }
      } else {
        toast.error(`No data found to save for ${getSectionTitle(currentSection)}`);
      }
      
      setIsSaving(false);
      return saved;
    } catch (error) {
      console.error(`Error saving ${currentSection} data:`, error);
      setIsSaving(false);
      toast.error(`Error saving ${getSectionTitle(currentSection)} information`);
      return false;
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      saveCurrentSectionData();
    } else {
      setIsEditing(true);
    }
  };
  
  // Helper function to get section title
  const getSectionTitle = (section: string): string => {
    const sections = [
      { id: 'personal', label: 'Personal' },
      { id: 'history', label: 'Medical History' },
      { id: 'allergies', label: 'Allergies' },
      { id: 'medications', label: 'Medications' },
      { id: 'immunizations', label: 'Immunizations & Vaccines' },
      { id: 'social', label: 'Social History' },
      { id: 'reproductive', label: 'Reproductive' },
      { id: 'mental', label: 'Mental Health' },
      { id: 'functional', label: 'Functional Status' },
      { id: 'cultural', label: 'Cultural' }
    ];
    
    const sectionObj = sections.find(s => s.id === section);
    return sectionObj ? sectionObj.label : 'Section';
  };

  return {
    isLoadingData,
    isSaving,
    isEditing,
    setIsEditing,
    toggleEditMode,
    saveCurrentSectionData,
    getSectionTitle
  };
};
