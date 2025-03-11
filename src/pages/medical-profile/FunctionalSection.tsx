
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileFunctionalStatusForm from '@/components/forms/MedicalProfileFunctionalStatusForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const FunctionalSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  const loadData = () => {
    try {
      console.log('Loading functional status data');
      
      // First check if localStorage has data (source of truth)
      const savedProfileJson = localStorage.getItem('medicalProfile');
      let localData = null;
      
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.functional) {
          localData = savedProfile.functional;
          console.log('Found functional status in localStorage:', localData);
        }
      }
      
      // Also check sessionStorage
      const sessionData = sessionStorage.getItem('functionalStatusFormData');
      let sessionParsed = null;
      
      if (sessionData) {
        try {
          sessionParsed = JSON.parse(sessionData);
          console.log('Found functional status in sessionStorage:', sessionParsed);
        } catch (e) {
          console.error('Error parsing functional status session data:', e);
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
      (window as any).functionalStatusFormData = dataToUse;
      console.log('Setting functional status data in window object:', dataToUse);
      
      // Update session storage to match
      sessionStorage.setItem('functionalStatusFormData', JSON.stringify(dataToUse));
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading functional status data:', error);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadData();
    
    // Listen for navigation changes to reload data
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading functional status data');
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
      const currentFormData = (window as any).functionalStatusFormData;
      if (currentFormData) {
        sessionStorage.setItem('functionalStatusFormData', JSON.stringify({
          ...currentFormData,
          lastUpdated: new Date().toISOString()
        }));
        console.log('Saving functional status data on unmount/unload');
        
        // Also save to localStorage for persistence
        try {
          const savedProfileJson = localStorage.getItem('medicalProfile');
          const savedProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
          
          localStorage.setItem('medicalProfile', JSON.stringify({
            ...savedProfile,
            functional: {
              ...currentFormData,
              lastUpdated: new Date().toISOString()
            }
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
        const currentTimestamp = new Date().toISOString();
        const updatedProfile = {
          ...existingProfile,
          functional: {
            ...newFormData,
            completed: true,
            lastUpdated: currentTimestamp
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage and window object
        const updatedFormData = {
          ...newFormData,
          completed: true,
          lastUpdated: currentTimestamp
        };
        
        sessionStorage.setItem('functionalStatusFormData', JSON.stringify(updatedFormData));
        (window as any).functionalStatusFormData = updatedFormData;
        
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
      
      {isLoaded && <MedicalProfileFunctionalStatusForm />}
      
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
