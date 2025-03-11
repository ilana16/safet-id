
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileImmunizationsForm from '@/components/forms/MedicalProfileImmunizationsForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { loadSectionData, saveSectionData, MEDICAL_DATA_CHANGE_EVENT } from '@/utils/medicalProfileService';

const ImmuneSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  useEffect(() => {
    const loadImmuneData = () => {
      try {
        console.log('Loading immunizations data');
        const immuneData = loadSectionData('immunizations');
        setIsLoaded(true);
        
        // Trigger a UI refresh
        window.dispatchEvent(new CustomEvent('immunizationsDataLoaded'));
      } catch (error) {
        console.error('Error loading immunizations data:', error);
        setIsLoaded(true); // Still show the form even if there's an error
      }
    };
    
    loadImmuneData();
    
    // Listen for navigation changes and data requests
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading immunizations data');
      loadImmuneData();
    };
    
    const handleDataChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.section === 'immunizations') {
        console.log('Immunizations data changed externally, reloading');
        loadImmuneData();
      }
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('immunizationsDataRequest', handleNavChange);
    window.addEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('immunizationsDataRequest', handleNavChange);
      window.removeEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).immunizationsFormData || {};
      
      console.log('Saving immunizations form data:', newFormData);
      
      // Save the data
      const saved = saveSectionData('immunizations', newFormData);
      
      if (saved) {
        // Log changes for audit trail
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        const existingSectionData = existingProfile.immunizations || {};
        
        const changes: {field: string; oldValue: any; newValue: any}[] = [];
        
        Object.entries(newFormData).forEach(([key, value]) => {
          if (existingSectionData[key] !== value) {
            changes.push({
              field: key,
              oldValue: existingSectionData[key],
              newValue: value
            });
          }
        });
        
        if (changes.length > 0) {
          logChanges('immunizations', changes);
        }
        
        setIsSaving(false);
        toast.success('Immunizations information saved successfully');
      } else {
        setIsSaving(false);
        toast.error('Error saving immunizations information');
      }
    } catch (error) {
      console.error('Error saving immunizations information:', error);
      setIsSaving(false);
      toast.error('Error saving immunizations information');
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
      
      {isLoaded && <MedicalProfileImmunizationsForm />}
      
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

export default ImmuneSection;
