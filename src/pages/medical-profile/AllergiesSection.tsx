
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileAllergiesForm from '@/components/forms/MedicalProfileAllergiesForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const AllergiesSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    try {
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('allergiesFormData');
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          (window as any).allergiesFormData = parsedData;
          console.log('Setting allergies form data from session storage:', parsedData);
          return;
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.allergies) {
          (window as any).allergiesFormData = savedProfile.allergies;
          console.log('Setting allergies form data in window object:', savedProfile.allergies);
          
          // Also save to session storage for better persistence
          sessionStorage.setItem('allergiesFormData', JSON.stringify(savedProfile.allergies));
        }
      }
    } catch (error) {
      console.error('Error loading allergies profile data:', error);
    }
  }, []);
  
  // Add event listener for page unload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormData = (window as any).allergiesFormData;
      if (currentFormData) {
        sessionStorage.setItem('allergiesFormData', JSON.stringify(currentFormData));
        console.log('Saving allergies form data to session storage before unload:', currentFormData);
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
      const currentFormData = (window as any).allergiesFormData;
      if (currentFormData) {
        sessionStorage.setItem('allergiesFormData', JSON.stringify(currentFormData));
        console.log('Saving allergies form data to session storage on unmount:', currentFormData);
      }
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.allergies || {};
      
      let newFormData = (window as any).allergiesFormData || {};
      
      console.log('Saving allergies form data:', newFormData);
      
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
          allergies: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('allergiesFormData', JSON.stringify({
          ...newFormData,
          completed: true,
          lastUpdated: new Date().toISOString()
        }));
        
        if (changes.length > 0) {
          logChanges('allergies', changes);
        }
        
        setIsSaving(false);
        toast.success('Allergies information saved successfully');
      }, 500);
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
      
      <MedicalProfileAllergiesForm />
      
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
