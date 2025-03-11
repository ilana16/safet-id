
import { useState, useEffect } from 'react';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';

export function useFieldPersistence<T>(
  section: string,
  initialData: T,
  autoSave: boolean = true
): [T, (data: Partial<T>) => void, () => void] {
  const { loadSection, updateSectionData, saveSection } = useMedicalProfile();
  const [formData, setFormData] = useState<T>(initialData);
  
  // Load data on initial mount
  useEffect(() => {
    console.log(`Loading initial data for ${section}`);
    const sectionData = loadSection(section);
    
    if (sectionData && Object.keys(sectionData).length > 0) {
      console.log(`Found existing data for ${section}:`, sectionData);
      setFormData(prev => ({ ...prev, ...sectionData }));
      
      // Set window object for compatibility with existing code
      const windowKey = getWindowKeyForSection(section);
      if (windowKey) {
        (window as any)[windowKey] = { ...sectionData };
      }
    }
  }, [section]);
  
  // Update form data and sync with context
  const updateFormData = (newData: Partial<T>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      
      // Update context data which will propagate to other components
      updateSectionData(section, updated);
      
      // Set window object for compatibility with existing code
      const windowKey = getWindowKeyForSection(section);
      if (windowKey) {
        (window as any)[windowKey] = { ...updated };
      }
      
      return updated;
    });
    
    // Auto-save if enabled
    if (autoSave) {
      setTimeout(() => saveSection(section), 300);
    }
  };
  
  // Manually save data
  const saveData = () => {
    saveSection(section);
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
  
  return [formData, updateFormData, saveData];
}
