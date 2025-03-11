
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfilePreventativeCareForm from '@/components/forms/MedicalProfilePreventativeCareForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const PreventativeSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  const loadData = () => {
    try {
      console.log('Loading preventative care data');
      
      // First check if localStorage has data (source of truth)
      const savedProfileJson = localStorage.getItem('medicalProfile');
      let localData = null;
      
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.preventative) {
          localData = savedProfile.preventative;
          console.log('Found preventative care in localStorage:', localData);
        }
      }
      
      // Also check sessionStorage
      const sessionData = sessionStorage.getItem('preventativeCareFormData');
      let sessionParsed = null;
      
      if (sessionData) {
        try {
          sessionParsed = JSON.parse(sessionData);
          console.log('Found preventative care in sessionStorage:', sessionParsed);
        } catch (e) {
          console.error('Error parsing preventative care session data:', e);
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
      (window as any).preventativeCareFormData = dataToUse;
      console.log('Setting preventative care data in window object:', dataToUse);
      
      // Update session storage to match
      sessionStorage.setItem('preventativeCareFormData', JSON.stringify(dataToUse));
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading preventative care data:', error);
      setIsLoaded(true); // Still show the form even if there's an error
    }
  };
  
  // Initial load
  useEffect(() => {
    loadData();
    
    // Listen for navigation changes to reload data
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading preventative care data');
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
      const currentFormData = (window as any).preventativeCareFormData;
      if (currentFormData) {
        const dataWithTimestamp = {
          ...currentFormData,
          lastUpdated: new Date().toISOString()
        };
        sessionStorage.setItem('preventativeCareFormData', JSON.stringify(dataWithTimestamp));
        console.log('Saving preventative care data on unmount/unload');
        
        // Also save to localStorage for persistence
        try {
          const savedProfileJson = localStorage.getItem('medicalProfile');
          const savedProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
          
          localStorage.setItem('medicalProfile', JSON.stringify({
            ...savedProfile,
            preventative: dataWithTimestamp
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
        const currentTimestamp = new Date().toISOString();
        const updatedFormData = {
          ...newFormData,
          completed: true,
          lastUpdated: currentTimestamp
        };
        
        const updatedProfile = {
          ...existingProfile,
          preventative: updatedFormData
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage and window object
        sessionStorage.setItem('preventativeCareFormData', JSON.stringify(updatedFormData));
        (window as any).preventativeCareFormData = updatedFormData;
        
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
      
      {isLoaded && <MedicalProfilePreventativeCareForm />}
      
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
