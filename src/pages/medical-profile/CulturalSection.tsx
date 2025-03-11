
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileCulturalPreferencesForm from '@/components/forms/MedicalProfileCulturalPreferencesForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const CulturalSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    loadData();
    
    // Setup a data reload interval
    const reloadInterval = setInterval(() => {
      // Quietly reload data without showing loading state
      loadData(false);
    }, 30000);
    
    return () => {
      clearInterval(reloadInterval);
    };
  }, []);

  const loadData = (showLoading = true) => {
    try {
      console.log('Loading cultural preferences data...');
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('culturalPreferencesFormData');
      if (sessionData) {
        (window as any).culturalPreferencesFormData = JSON.parse(sessionData);
        console.log('Setting cultural preferences form data from session storage:', JSON.parse(sessionData));
        if (showLoading) setIsLoading(false);
        return;
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.cultural) {
          (window as any).culturalPreferencesFormData = savedProfile.cultural;
          console.log('Setting cultural preferences form data in window object:', savedProfile.cultural);
          
          // Also save to session storage for better persistence
          sessionStorage.setItem('culturalPreferencesFormData', JSON.stringify(savedProfile.cultural));
        }
      }
    } catch (error) {
      console.error('Error loading cultural preferences data:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };
  
  // Add event listener for page unload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormData = (window as any).culturalPreferencesFormData;
      if (currentFormData) {
        sessionStorage.setItem('culturalPreferencesFormData', JSON.stringify(currentFormData));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Listen for visibility changes to reload data when coming back to the tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible, reloading cultural data');
        loadData(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
        const saveTimestamp = new Date().toISOString();
        const updatedProfile = {
          ...existingProfile,
          cultural: {
            ...newFormData,
            completed: true,
            lastUpdated: saveTimestamp
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('culturalPreferencesFormData', JSON.stringify({
          ...newFormData,
          completed: true,
          lastUpdated: saveTimestamp
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
          disabled={isSaving || isLoading}
        >
          {isSaving ? 'Saving...' : isLoading ? 'Loading...' : 'Save'}
          {!isSaving && !isLoading && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-100 rounded-md w-full"></div>
          <div className="h-40 bg-gray-100 rounded-md w-full"></div>
          <div className="h-20 bg-gray-100 rounded-md w-full"></div>
        </div>
      ) : (
        <MedicalProfileCulturalPreferencesForm />
      )}
      
      <div className="mt-8 flex justify-end gap-3">
        <Button 
          onClick={handleSave} 
          className="bg-safet-500 hover:bg-safet-600"
          disabled={isSaving || isLoading}
        >
          {isSaving ? 'Saving...' : isLoading ? 'Loading...' : 'Save'}
          {!isSaving && !isLoading && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default CulturalSection;

