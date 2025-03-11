
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfilePersonalForm from '@/components/forms/MedicalProfilePersonalForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const PersonalSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load saved data when component mounts
  useEffect(() => {
    setIsLoading(true);
    loadData();
    
    // Setup a data reload interval
    const reloadInterval = setInterval(() => {
      // Quietly reload data without showing loading state
      loadData(false);
    }, 30000); // Check for new data every 30 seconds
    
    return () => {
      clearInterval(reloadInterval);
    };
  }, []);

  const loadData = (showLoading = true) => {
    try {
      console.log('Loading personal section data...');
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('personalFormData');
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          (window as any).personalFormData = parsedData;
          console.log('Setting personal form data from session storage:', parsedData);
          if (showLoading) setIsLoading(false);
          return;
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.personal) {
          // Make the data available to the form via window object
          (window as any).personalFormData = savedProfile.personal;
          console.log('Setting personal form data in window object:', savedProfile.personal);
          
          // Also save to session storage for better persistence
          sessionStorage.setItem('personalFormData', JSON.stringify(savedProfile.personal));
        }
      }
    } catch (error) {
      console.error('Error loading personal profile data:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };
  
  // Add event listener for page unload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormData = (window as any).personalFormData;
      if (currentFormData) {
        sessionStorage.setItem('personalFormData', JSON.stringify(currentFormData));
        console.log('Saving personal form data to session storage before unload:', currentFormData);
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
        console.log('Tab became visible, reloading personal data');
        loadData(false);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Save form data when component unmounts
  useEffect(() => {
    return () => {
      const currentFormData = (window as any).personalFormData;
      if (currentFormData) {
        sessionStorage.setItem('personalFormData', JSON.stringify(currentFormData));
        console.log('Saving personal form data to session storage on unmount:', currentFormData);
      }
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.personal || {};
      
      // Get complete form data from window object
      let windowFormData = (window as any).personalFormData || {};
      
      console.log('Saving personal form data:', windowFormData);
      
      const changes: {field: string; oldValue: any; newValue: any}[] = [];
      
      // Track changes in basic form data
      if (windowFormData.formData) {
        Object.entries(windowFormData.formData || {}).forEach(([key, value]) => {
          if (existingSectionData.formData && existingSectionData.formData[key] !== value) {
            changes.push({
              field: key,
              oldValue: existingSectionData.formData ? existingSectionData.formData[key] : undefined,
              newValue: value
            });
          }
        });
      }
      
      // Track unit preference changes
      if (existingSectionData.heightUnit !== windowFormData.heightUnit) {
        changes.push({
          field: 'heightUnit',
          oldValue: existingSectionData.heightUnit,
          newValue: windowFormData.heightUnit
        });
      }
      
      if (existingSectionData.weightUnit !== windowFormData.weightUnit) {
        changes.push({
          field: 'weightUnit',
          oldValue: existingSectionData.weightUnit,
          newValue: windowFormData.weightUnit
        });
      }
      
      setTimeout(() => {
        const saveTimestamp = new Date().toISOString();
        const updatedProfile = {
          ...existingProfile,
          personal: {
            ...windowFormData,
            completed: true,
            lastUpdated: saveTimestamp
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('personalFormData', JSON.stringify({
          ...windowFormData,
          completed: true,
          lastUpdated: saveTimestamp
        }));
        
        if (changes.length > 0) {
          logChanges('personal', changes);
        }
        
        setIsSaving(false);
        toast.success('Personal information saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving personal information:', error);
      setIsSaving(false);
      toast.error('Error saving personal information');
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
        <MedicalProfilePersonalForm />
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

export default PersonalSection;

