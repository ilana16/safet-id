
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileCulturalPreferencesForm from '@/components/forms/MedicalProfileCulturalPreferencesForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const CulturalSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    try {
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('culturalPreferencesFormData');
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          (window as any).culturalPreferencesFormData = parsedData;
          console.log('Setting cultural preferences form data from session storage:', parsedData);
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
      
      // Also load from localStorage to ensure data consistency
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.cultural) {
          // If session storage data is older than localStorage data, update it
          const localData = savedProfile.cultural;
          
          if (sessionData) {
            const sessionParsed = JSON.parse(sessionData);
            const sessionTime = new Date(sessionParsed.lastUpdated || 0).getTime();
            const localTime = new Date(localData.lastUpdated || 0).getTime();
            
            if (localTime > sessionTime) {
              (window as any).culturalPreferencesFormData = localData;
              sessionStorage.setItem('culturalPreferencesFormData', JSON.stringify(localData));
              console.log('Updated session storage with newer data from localStorage');
            }
          } else {
            (window as any).culturalPreferencesFormData = localData;
            sessionStorage.setItem('culturalPreferencesFormData', JSON.stringify(localData));
          }
        }
      }
      
      // Dispatch a custom event to notify the form component to reload data
      window.dispatchEvent(new Event('navigationChange'));
      
    } catch (error) {
      console.error('Error loading cultural preferences data:', error);
    }
  }, []);
  
  // Save form data when component unmounts
  useEffect(() => {
    return () => {
      const currentFormData = (window as any).culturalPreferencesFormData;
      if (currentFormData) {
        sessionStorage.setItem('culturalPreferencesFormData', JSON.stringify(currentFormData));
        console.log('Saving cultural preferences form data to session storage on unmount:', currentFormData);
        
        // Also save directly to localStorage for persistence
        try {
          const savedProfileJson = localStorage.getItem('medicalProfile');
          const savedProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
          
          localStorage.setItem('medicalProfile', JSON.stringify({
            ...savedProfile,
            cultural: currentFormData
          }));
        } catch (error) {
          console.error('Error saving to localStorage on unmount:', error);
        }
      }
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.cultural || {};
      
      let newFormData = (window as any).culturalPreferencesFormData || {};
      
      console.log('Saving cultural preferences form data:', newFormData);
      
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
          cultural: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('culturalPreferencesFormData', JSON.stringify({
          ...newFormData,
          completed: true,
          lastUpdated: new Date().toISOString()
        }));
        
        if (changes.length > 0) {
          logChanges('cultural', changes);
        }
        
        setIsSaving(false);
        toast.success('Cultural preferences saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving cultural preferences:', error);
      setIsSaving(false);
      toast.error('Error saving cultural preferences');
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
      
      <MedicalProfileCulturalPreferencesForm />
      
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

export default CulturalSection;
