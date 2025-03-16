
import { useState, useEffect } from 'react';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';

export function useFieldPersistence<T>(
  section: string,
  initialData: T,
  autoSave: boolean = true
): [T, (data: Partial<T>) => void, () => void, boolean] {
  const { loadSection, updateSectionData, saveSection } = useMedicalProfile();
  const [formData, setFormData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data on initial mount
  useEffect(() => {
    console.log(`Loading initial data for ${section}`);
    try {
      setIsLoading(true);
      const sectionData = loadSection(section);
      
      if (sectionData && Object.keys(sectionData).length > 0) {
        console.log(`Found existing data for ${section}:`, sectionData);
        setFormData(prev => ({ ...prev, ...sectionData }));
      }
    } catch (error) {
      console.error(`Error loading initial data for ${section}:`, error);
      // Fall back to initial data
    } finally {
      setIsLoading(false);
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
  
  return [formData, updateFormData, saveData, isLoading];
}
