
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfilePreventativeCareForm from '@/components/forms/MedicalProfilePreventativeCareForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const PreventativeSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    try {
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('preventativeCareFormData');
      if (sessionData) {
        (window as any).preventativeCareFormData = JSON.parse(sessionData);
        console.log('Setting preventative care form data from session storage:', JSON.parse(sessionData));
        return;
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.preventative) {
          (window as any).preventativeCareFormData = savedProfile.preventative;
          console.log('Setting preventative care form data in window object:', savedProfile.preventative);
          
          // Also save to session storage for better persistence
          sessionStorage.setItem('preventativeCareFormData', JSON.stringify(savedProfile.preventative));
        }
      }
    } catch (error) {
      console.error('Error loading preventative care data:', error);
    }
  }, []);
  
  // Add event listener for page unload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormData = (window as any).preventativeCareFormData;
      if (currentFormData) {
        sessionStorage.setItem('preventativeCareFormData', JSON.stringify(currentFormData));
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
      const existingSectionData = existingProfile.preventative || {};
      
      let newFormData = (window as any).preventativeCareFormData || {};
      
      console.log('Saving preventative care form data:', newFormData);
      
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
          preventative: {
            ...newFormData,
            completed: true
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('preventativeCareFormData', JSON.stringify({
          ...newFormData,
          completed: true
        }));
        
        if (changes.length > 0) {
          logChanges('preventative', changes);
        }
        
        setIsSaving(false);
        toast.success('Preventative care information saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving preventative care information:', error);
      setIsSaving(false);
      toast.error('Error saving preventative care information');
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
      
      <MedicalProfilePreventativeCareForm />
      
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

export default PreventativeSection;
