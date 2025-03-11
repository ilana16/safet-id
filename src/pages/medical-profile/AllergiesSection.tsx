
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileAllergiesForm from '@/components/forms/MedicalProfileAllergiesForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const AllergiesSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  const loadData = () => {
    try {
      console.log('Loading allergies data');
      
      // Create default data structure for allergies section
      const defaultData = {
        allergies: '[]',
        noKnownAllergies: 'false',
        lastUpdated: new Date().toISOString()
      };
      
      // First check if localStorage has data (source of truth)
      const savedProfileJson = localStorage.getItem('medicalProfile');
      let localData = null;
      
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.allergies) {
          localData = savedProfile.allergies;
          console.log('Found allergies in localStorage:', localData);
        }
      }
      
      // Also check sessionStorage
      const sessionData = sessionStorage.getItem('allergiesFormData');
      let sessionParsed = null;
      
      if (sessionData) {
        try {
          sessionParsed = JSON.parse(sessionData);
          console.log('Found allergies in sessionStorage:', sessionParsed);
        } catch (e) {
          console.error('Error parsing allergies session data:', e);
        }
      }
      
      // Determine which data is more recent and use that
      let dataToUse = defaultData;
      
      if (localData && sessionParsed) {
        const localTime = new Date(localData.lastUpdated || 0).getTime();
        const sessionTime = new Date(sessionParsed.lastUpdated || 0).getTime();
        
        dataToUse = localTime >= sessionTime ? localData : sessionParsed;
        console.log('Using more recent data, timestamp comparison:', { localTime, sessionTime });
      } else {
        dataToUse = localData || sessionParsed || defaultData;
      }
      
      // Set the data in window object for the form to use
      (window as any).allergiesFormData = dataToUse;
      console.log('Setting allergies data in window object:', dataToUse);
      
      // Update session storage to match
      sessionStorage.setItem('allergiesFormData', JSON.stringify(dataToUse));
      
      // Also ensure localStorage has the latest data
      if (!localData || (sessionParsed && new Date(sessionParsed.lastUpdated) > new Date(localData.lastUpdated))) {
        const savedProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        localStorage.setItem('medicalProfile', JSON.stringify({
          ...savedProfile,
          allergies: dataToUse
        }));
        console.log('Updated localStorage with most recent allergies data');
      }
      
      setIsLoaded(true);
      
      // Force a re-render of the form component
      window.dispatchEvent(new CustomEvent('allergiesDataLoaded'));
    } catch (error) {
      console.error('Error loading allergies data:', error);
      setIsLoaded(true); // Still show the form even if there's an error
    }
  };
  
  // Initial load
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      loadData();
    }, 50);
    
    // Listen for navigation changes to reload data
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading allergies data');
      // Add a small delay to ensure state is ready
      setTimeout(() => {
        loadData();
      }, 50);
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('popstate', handleNavChange);
    window.addEventListener('allergiesDataRequest', handleNavChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('popstate', handleNavChange);
      window.removeEventListener('allergiesDataRequest', handleNavChange);
    };
  }, []);
  
  // Save form data when component unmounts or before unload
  useEffect(() => {
    const saveData = () => {
      const currentFormData = (window as any).allergiesFormData;
      if (currentFormData) {
        // Ensure allergies is a string if it's an array
        if (Array.isArray(currentFormData.allergies)) {
          currentFormData.allergies = JSON.stringify(currentFormData.allergies);
        }
        
        const dataToSave = {
          ...currentFormData,
          lastUpdated: new Date().toISOString()
        };
        
        sessionStorage.setItem('allergiesFormData', JSON.stringify(dataToSave));
        console.log('Saving allergies data on unmount/unload', dataToSave);
        
        // Also save to localStorage for persistence
        try {
          const savedProfileJson = localStorage.getItem('medicalProfile');
          const savedProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
          
          localStorage.setItem('medicalProfile', JSON.stringify({
            ...savedProfile,
            allergies: dataToSave
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
      const existingSectionData = existingProfile.allergies || {};
      
      let newFormData = (window as any).allergiesFormData || {};
      
      // Ensure allergies is a string if it's an array
      if (Array.isArray(newFormData.allergies)) {
        newFormData.allergies = JSON.stringify(newFormData.allergies);
      }
      
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
        const currentTimestamp = new Date().toISOString();
        const updatedFormData = {
          ...newFormData,
          completed: true,
          lastUpdated: currentTimestamp
        };
        
        const updatedProfile = {
          ...existingProfile,
          allergies: updatedFormData
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage and window object
        sessionStorage.setItem('allergiesFormData', JSON.stringify(updatedFormData));
        (window as any).allergiesFormData = updatedFormData;
        
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
      
      {isLoaded && <MedicalProfileAllergiesForm />}
      
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
