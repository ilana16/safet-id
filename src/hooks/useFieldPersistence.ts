
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
    }
  }, [section, loadSection]);
  
  // Update form data and sync with context
  const updateFormData = (newData: Partial<T>) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      
      // Update context data which will propagate to other components
      updateSectionData(section, updated);
      
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
  
  return [formData, updateFormData, saveData];
}
