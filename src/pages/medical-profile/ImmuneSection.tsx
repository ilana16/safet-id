
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileImmunizationsForm from '@/components/forms/MedicalProfileImmunizationsForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const ImmuneSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    try {
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('immunizationsFormData');
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          (window as any).immunizationsFormData = parsedData;
          console.log('Setting immunizations form data from session storage:', parsedData);
          return;
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.immunizations) {
          (window as any).immunizationsFormData = savedProfile.immunizations;
          console.log('Setting immunizations form data in window object:', savedProfile.immunizations);
          
          // Also save to session storage for better persistence
          sessionStorage.setItem('immunizationsFormData', JSON.stringify(savedProfile.immunizations));
        }
      }
    } catch (error) {
      console.error('Error loading immunizations profile data:', error);
    }
  }, []);
  
  // Add event listener for page unload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormData = (window as any).immunizationsFormData;
      if (currentFormData) {
        sessionStorage.setItem('immunizationsFormData', JSON.stringify(currentFormData));
        console.log('Saving immunizations form data to session storage before unload:', currentFormData);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Save form data when component unmounts
  useEffect(() => {
    return () => {
      const currentFormData = (window as any).immunizationsFormData;
      if (currentFormData) {
        sessionStorage.setItem('immunizationsFormData', JSON.stringify(currentFormData));
        console.log('Saving immunizations form data to session storage on unmount:', currentFormData);
      }
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.immunizations || {};
      
      let newFormData = (window as any).immunizationsFormData || {};
      
      console.log('Saving immunizations form data:', newFormData);
      
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
      
      setTimeout(() => {
        const updatedProfile = {
          ...existingProfile,
          immunizations: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('immunizationsFormData', JSON.stringify({
          ...newFormData,
          completed: true,
          lastUpdated: new Date().toISOString()
        }));
        
        if (changes.length > 0) {
          logChanges('immunizations', changes);
        }
        
        setIsSaving(false);
        toast.success('Immunizations information saved successfully');
      }, 500);
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
      
      <MedicalProfileImmunizationsForm />
      
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
