
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfilePersonalForm from '@/components/forms/MedicalProfilePersonalForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { useFieldPersistence } from '@/hooks/useFieldPersistence';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';

interface SectionContext {
  isEditing: boolean;
}

const PersonalSection = () => {
  const { isEditing } = useOutletContext<SectionContext>();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { loadSection, saveSection } = useMedicalProfile();
  const [formData, updateFormData, saveData] = useFieldPersistence('personal', {});
  
  // Load data on initial render
  useEffect(() => {
    const loadPersonalData = () => {
      try {
        console.log('Loading personal data');
        loadSection('personal');
        setIsLoaded(true);
        
        // Trigger a UI refresh
        window.dispatchEvent(new CustomEvent('personalDataLoaded'));
      } catch (error) {
        console.error('Error loading personal data:', error);
        setIsLoaded(true);
      }
    };
    
    loadPersonalData();
    
    // Listen for navigation changes and data requests
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading personal data');
      loadPersonalData();
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('personalDataRequest', handleNavChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('personalDataRequest', handleNavChange);
      
      // Save data when component unmounts
      saveData();
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).personalFormData || {};
      
      console.log('Saving personal form data:', newFormData);
      
      // Save the data and record changes
      updateFormData(newFormData);
      const saved = saveSection('personal');
      
      if (saved) {
        // Log changes for audit trail
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        const existingSectionData = existingProfile.personal || {};
        
        const changes: {field: string; oldValue: any; newValue: any}[] = [];
        
        // For personal section, we need to handle nested objects
        Object.keys(newFormData).forEach(key => {
          const oldValue = existingSectionData[key];
          const newValue = newFormData[key];
          
          // For objects, compare stringified versions
          if (typeof newValue === 'object' && newValue !== null) {
            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
              changes.push({
                field: key,
                oldValue: oldValue,
                newValue: newValue
              });
            }
          } else if (oldValue !== newValue) {
            // For primitive values
            changes.push({
              field: key,
              oldValue: oldValue,
              newValue: newValue
            });
          }
        });
        
        if (changes.length > 0) {
          logChanges('personal', changes);
        }
        
        setIsSaving(false);
        toast.success('Personal information saved successfully');
      } else {
        setIsSaving(false);
        toast.error('Error saving personal information');
      }
    } catch (error) {
      console.error('Error saving personal information:', error);
      setIsSaving(false);
      toast.error('Error saving personal information');
    }
  };

  return (
    <div className={`${!isEditing ? 'opacity-90' : ''}`}>
      {isLoaded && (
        <div className={`${!isEditing ? 'pointer-events-none' : ''}`}>
          <MedicalProfilePersonalForm />
        </div>
      )}
    </div>
  );
};

export default PersonalSection;
