
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileSocialHistoryForm from '@/components/forms/MedicalProfileSocialHistoryForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const SocialSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    try {
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('socialHistoryFormData');
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          (window as any).socialHistoryFormData = parsedData;
          console.log('Setting social history form data from session storage:', parsedData);
          return;
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.social) {
          (window as any).socialHistoryFormData = savedProfile.social;
          console.log('Setting social history form data in window object:', savedProfile.social);
          
          // Also save to session storage for better persistence
          sessionStorage.setItem('socialHistoryFormData', JSON.stringify(savedProfile.social));
        }
      }
    } catch (error) {
      console.error('Error loading social history data:', error);
    }
  }, []);
  
  // Save form data periodically with auto-save
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const currentFormData = (window as any).socialHistoryFormData;
      if (currentFormData) {
        sessionStorage.setItem('socialHistoryFormData', JSON.stringify(currentFormData));
        console.log('Auto-saved social history data to session storage:', currentFormData);
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => {
      clearInterval(autoSaveInterval);
    };
  }, []);
  
  // Add event listener for page unload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormData = (window as any).socialHistoryFormData;
      if (currentFormData) {
        sessionStorage.setItem('socialHistoryFormData', JSON.stringify(currentFormData));
        console.log('Saving social history form data to session storage before unload:', currentFormData);
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
      const currentFormData = (window as any).socialHistoryFormData;
      if (currentFormData) {
        sessionStorage.setItem('socialHistoryFormData', JSON.stringify(currentFormData));
        console.log('Saving social history form data to session storage on unmount:', currentFormData);
      }
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.social || {};
      
      let newFormData = (window as any).socialHistoryFormData || {};
      
      console.log('Saving social history form data:', newFormData);
      
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
          social: {
            ...newFormData,
            completed: true
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('socialHistoryFormData', JSON.stringify({
          ...newFormData,
          completed: true
        }));
        
        if (changes.length > 0) {
          logChanges('social', changes);
        }
        
        setIsSaving(false);
        toast.success('Social history saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving social history:', error);
      setIsSaving(false);
      toast.error('Error saving social history');
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
      
      <MedicalProfileSocialHistoryForm />
      
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

export default SocialSection;
