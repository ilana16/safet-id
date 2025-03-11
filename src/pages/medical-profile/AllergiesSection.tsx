
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileAllergiesForm from '@/components/forms/MedicalProfileAllergiesForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { loadSectionData, saveSectionData, MEDICAL_DATA_CHANGE_EVENT } from '@/utils/medicalProfileService';

const AllergiesSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  useEffect(() => {
    const loadAllergiesData = () => {
      try {
        console.log('Loading allergies data');
        
        // Create default data structure for allergies section
        const defaultData = {
          allergies: '[]',
          noKnownAllergies: 'false'
        };
        
        // Load from storage, with defaults
        const allergiesData = loadSectionData('allergies') || defaultData;
        
        // Handle allergies data specifically
        if (typeof allergiesData.allergies === 'string' && allergiesData.allergies) {
          try {
            // Parse the allergies string to an array for the form
            const parsedAllergies = JSON.parse(allergiesData.allergies);
            (window as any).allergiesFormData = {
              ...allergiesData,
              allergies: parsedAllergies
            };
          } catch (parseError) {
            console.error('Error parsing allergies JSON:', parseError);
            (window as any).allergiesFormData = {
              ...allergiesData,
              allergies: []
            };
          }
        } else {
          // If allergies is not a string or is empty, initialize as empty array
          (window as any).allergiesFormData = {
            ...allergiesData,
            allergies: []
          };
        }
        
        setIsLoaded(true);
        
        // Trigger a UI refresh
        window.dispatchEvent(new CustomEvent('allergiesDataLoaded'));
      } catch (error) {
        console.error('Error loading allergies data:', error);
        setIsLoaded(true);
      }
    };
    
    loadAllergiesData();
    
    // Listen for navigation changes and data requests
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading allergies data');
      loadAllergiesData();
    };
    
    const handleDataChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.section === 'allergies') {
        console.log('Allergies data changed externally, reloading');
        loadAllergiesData();
      }
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('allergiesDataRequest', handleNavChange);
    window.addEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('allergiesDataRequest', handleNavChange);
      window.removeEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const formData = (window as any).allergiesFormData || {};
      
      console.log('Saving allergies form data:', formData);
      
      // Save the data (allergies already handled in saveSectionData)
      const saved = saveSectionData('allergies', formData);
      
      if (saved) {
        // Log changes for audit trail
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        const existingSectionData = existingProfile.allergies || {};
        
        const changes: {field: string; oldValue: any; newValue: any}[] = [];
        
        // For allergies, we need special handling
        if (existingSectionData.allergies !== formData.allergies) {
          changes.push({
            field: 'allergies',
            oldValue: existingSectionData.allergies,
            newValue: formData.allergies
          });
        }
        
        // For other fields
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'allergies' && existingSectionData[key] !== value) {
            changes.push({
              field: key,
              oldValue: existingSectionData[key],
              newValue: value
            });
          }
        });
        
        if (changes.length > 0) {
          logChanges('allergies', changes);
        }
        
        setIsSaving(false);
        toast.success('Allergies information saved successfully');
      } else {
        setIsSaving(false);
        toast.error('Error saving allergies information');
      }
    } catch (error) {
      console.error('Error saving allergies information:', error);
      setIsSaving(false);
      toast.error('Error saving allergies information');
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
      
      {isLoaded && <MedicalProfileAllergiesForm />}
      
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

export default AllergiesSection;
