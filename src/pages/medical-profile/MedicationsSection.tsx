
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { loadSectionData, saveSectionData, MEDICAL_DATA_CHANGE_EVENT } from '@/utils/medicalProfileService';

const MedicationsSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  useEffect(() => {
    const loadMedicationsData = () => {
      try {
        console.log('Loading medications data');
        const medicationsData = loadSectionData('medications');
        setIsLoaded(true);
        
        // Trigger a UI refresh
        window.dispatchEvent(new CustomEvent('medicationsDataLoaded'));
      } catch (error) {
        console.error('Error loading medications data:', error);
        setIsLoaded(true);
      }
    };
    
    loadMedicationsData();
    
    // Listen for navigation changes and data requests
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading medications data');
      loadMedicationsData();
    };
    
    const handleDataChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.section === 'medications') {
        console.log('Medications data changed externally, reloading');
        loadMedicationsData();
      }
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('medicationsDataRequest', handleNavChange);
    window.addEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('medicationsDataRequest', handleNavChange);
      window.removeEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).medicationsFormData || {};
      
      console.log('Saving medications form data:', newFormData);
      
      // Save the data
      const saved = saveSectionData('medications', newFormData);
      
      if (saved) {
        // Log changes for audit trail
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        const existingSectionData = existingProfile.medications || {};
        
        const changes: {field: string; oldValue: any; newValue: any}[] = [];
        
        Object.keys(newFormData).forEach(key => {
          const oldValue = existingSectionData[key];
          const newValue = newFormData[key];
          
          if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push({
              field: key,
              oldValue: oldValue,
              newValue: newValue
            });
          }
        });
        
        if (changes.length > 0) {
          logChanges('medications', changes);
        }
        
        setIsSaving(false);
        toast.success('Medications saved successfully');
      } else {
        setIsSaving(false);
        toast.error('Error saving medications');
      }
    } catch (error) {
      console.error('Error saving medications:', error);
      setIsSaving(false);
      toast.error('Error saving medications');
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
      
      {isLoaded && <MedicalProfileMedicationsForm />}
      
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

export default MedicationsSection;
