
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfilePersonalForm from '@/components/forms/MedicalProfilePersonalForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { loadSectionData, saveSectionData, MEDICAL_DATA_CHANGE_EVENT } from '@/utils/medicalProfileService';

const PersonalSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  useEffect(() => {
    const loadPersonalData = () => {
      try {
        console.log('Loading personal data');
        const personalData = loadSectionData('personal');
        setIsLoaded(true);
        
        // Trigger a UI refresh
        window.dispatchEvent(new CustomEvent('personalDataLoaded'));
      } catch (error) {
        console.error('Error loading personal data:', error);
        setIsLoaded(true); // Still show the form even if there's an error
      }
    };
    
    loadPersonalData();
    
    // Listen for navigation changes and data requests
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading personal data');
      loadPersonalData();
    };
    
    const handleDataChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.section === 'personal') {
        console.log('Personal data changed externally, reloading');
        loadPersonalData();
      }
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('personalDataRequest', handleNavChange);
    window.addEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('personalDataRequest', handleNavChange);
      window.removeEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).personalFormData || {};
      
      console.log('Saving personal form data:', newFormData);
      
      // Save the data
      const saved = saveSectionData('personal', newFormData);
      
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
    <div>
      <div className="flex justify-end mb-6">
        <Button 
          onClick={handleSave} 
          className="bg-safet-500 hover:bg-safet-600"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
          {!isSaving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>
      
      {isLoaded && <MedicalProfilePersonalForm />}
      
      <div className="mt-8 flex justify-end gap-3">
        <Button 
          onClick={handleSave} 
          className="bg-safet-500 hover:bg-safet-600"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
          {!isSaving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default PersonalSection;
