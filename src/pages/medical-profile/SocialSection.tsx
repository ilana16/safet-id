
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileSocialHistoryForm from '@/components/forms/MedicalProfileSocialHistoryForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const SocialSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  const loadData = () => {
    try {
      console.log('Loading social history data');
      
      // First check if localStorage has data (source of truth)
      const savedProfileJson = localStorage.getItem('medicalProfile');
      let localData = null;
      
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.social) {
          localData = savedProfile.social;
          console.log('Found social history in localStorage:', localData);
        }
      }
      
      // Also check sessionStorage
      const sessionData = sessionStorage.getItem('socialHistoryFormData');
      let sessionParsed = null;
      
      if (sessionData) {
        try {
          sessionParsed = JSON.parse(sessionData);
          console.log('Found social history in sessionStorage:', sessionParsed);
        } catch (e) {
          console.error('Error parsing social history session data:', e);
        }
      }
      
      // Determine which data is more recent and use that
      let dataToUse = null;
      
      if (localData && sessionParsed) {
        const localTime = new Date(localData.lastUpdated || 0).getTime();
        const sessionTime = new Date(sessionParsed.lastUpdated || 0).getTime();
        
        dataToUse = localTime >= sessionTime ? localData : sessionParsed;
        console.log('Using more recent data, timestamp comparison:', { localTime, sessionTime });
      } else {
        dataToUse = localData || sessionParsed || {};
      }
      
      // Set the data in window object for the form to use
      (window as any).socialHistoryFormData = dataToUse;
      console.log('Setting social history data in window object:', dataToUse);
      
      // Update session storage to match
      sessionStorage.setItem('socialHistoryFormData', JSON.stringify(dataToUse));
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading social history data:', error);
      setIsLoaded(true); // Still show the form even if there's an error
    }
  };
  
  // Initial load
  useEffect(() => {
    loadData();
    
    // Listen for navigation changes to reload data
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading social history data');
      loadData();
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('popstate', handleNavChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('popstate', handleNavChange);
    };
  }, []);
  
  // Save form data when component unmounts or before unload
  useEffect(() => {
    const saveData = () => {
      const currentFormData = (window as any).socialHistoryFormData;
      if (currentFormData) {
        const dataWithTimestamp = {
          ...currentFormData,
          lastUpdated: new Date().toISOString()
        };
        sessionStorage.setItem('socialHistoryFormData', JSON.stringify(dataWithTimestamp));
        console.log('Saving social history data on unmount/unload');
        
        // Also save to localStorage for persistence
        try {
          const savedProfileJson = localStorage.getItem('medicalProfile');
          const savedProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
          
          localStorage.setItem('medicalProfile', JSON.stringify({
            ...savedProfile,
            social: dataWithTimestamp
          }));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      }
    };
    
    const handleBeforeUnload = () => saveData();
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveData();
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
        const currentTimestamp = new Date().toISOString();
        const updatedFormData = {
          ...newFormData,
          completed: true,
          lastUpdated: currentTimestamp
        };
        
        const updatedProfile = {
          ...existingProfile,
          social: updatedFormData
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage and window object
        sessionStorage.setItem('socialHistoryFormData', JSON.stringify(updatedFormData));
        (window as any).socialHistoryFormData = updatedFormData;
        
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
      
      {isLoaded && <MedicalProfileSocialHistoryForm />}
      
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
