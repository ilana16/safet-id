
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileFunctionalStatusForm from '@/components/forms/MedicalProfileFunctionalStatusForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const FunctionalSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    try {
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('functionalStatusFormData');
      if (sessionData) {
        (window as any).functionalStatusFormData = JSON.parse(sessionData);
        console.log('Setting functional status form data from session storage:', JSON.parse(sessionData));
        return;
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.functional) {
          (window as any).functionalStatusFormData = savedProfile.functional;
          console.log('Setting functional status form data in window object:', savedProfile.functional);
          
          // Also save to session storage for better persistence
          sessionStorage.setItem('functionalStatusFormData', JSON.stringify(savedProfile.functional));
        }
      }
    } catch (error) {
      console.error('Error loading functional status data:', error);
    }
  }, []);
  
  // Add event listener for page unload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormData = (window as any).functionalStatusFormData;
      if (currentFormData) {
        sessionStorage.setItem('functionalStatusFormData', JSON.stringify(currentFormData));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.functional || {};
      
      let newFormData = (window as any).functionalStatusFormData || {};
      
      console.log('Saving functional status form data:', newFormData);
      
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
      
      setTimeout(() => {
        const updatedProfile = {
          ...existingProfile,
          functional: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('functionalStatusFormData', JSON.stringify({
          ...newFormData,
          completed: true,
          lastUpdated: new Date().toISOString()
        }));
        
        if (changes.length > 0) {
          logChanges('functional', changes);
        }
        
        setIsSaving(false);
        toast.success('Functional status information saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving functional status information:', error);
      setIsSaving(false);
      toast.error('Error saving functional status information');
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
      
      <MedicalProfileFunctionalStatusForm />
      
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

export default FunctionalSection;
