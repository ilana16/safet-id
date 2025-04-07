
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
      // Handle synchronously to avoid Promise issues
      const sectionData = loadSection(section);
      
      if (sectionData && typeof sectionData === 'object' && Object.keys(sectionData).length > 0) {
        console.log(`Found existing data for ${section}:`, sectionData);
        setFormData(prev => ({ ...prev, ...sectionData }));
      } else {
        console.log(`No existing data found for ${section}, using initial data`);
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
    console.log(`Updating form data for ${section}:`, newData);
    
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      
      // Update context data which will propagate to other components
      updateSectionData(section, updated);
      
      // Auto-save if enabled
      if (autoSave) {
        console.log(`Auto-saving section ${section}`);
        setTimeout(() => saveSection(section), 300);
      }
      
      return updated;
    });
  };
  
  // Manually save data
  const saveData = () => {
    console.log(`Manually saving section ${section}`);
    saveSection(section);
  };
  
  return [formData, updateFormData, saveData, isLoading];
}
