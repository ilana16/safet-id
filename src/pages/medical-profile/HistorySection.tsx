
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileHistoryForm from '@/components/forms/MedicalProfileHistoryForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const HistorySection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  const loadData = () => {
    try {
      console.log('Loading medical history data');
      
      // First check if localStorage has data (source of truth)
      const savedProfileJson = localStorage.getItem('medicalProfile');
      let localData = null;
      
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.history) {
          localData = savedProfile.history;
          console.log('Found medical history in localStorage:', localData);
          
          if (localData.hasMentalHealthHistory) {
            setHasMentalHealthHistory(localData.hasMentalHealthHistory);
          }
        }
      }
      
      // Also check sessionStorage
      const sessionData = sessionStorage.getItem('historyFormData');
      let sessionParsed = null;
      
      if (sessionData) {
        try {
          sessionParsed = JSON.parse(sessionData);
          console.log('Found medical history in sessionStorage:', sessionParsed);
          
          if (sessionParsed.hasMentalHealthHistory && !localData) {
            setHasMentalHealthHistory(sessionParsed.hasMentalHealthHistory);
          }
        } catch (e) {
          console.error('Error parsing medical history session data:', e);
        }
      }
      
      // Determine which data is more recent and use that
      let dataToUse = null;
      
      if (localData && sessionParsed) {
        const localTime = new Date(localData.lastUpdated || 0).getTime();
        const sessionTime = new Date(sessionParsed.lastUpdated || 0).getTime();
        
        dataToUse = localTime >= sessionTime ? localData : sessionParsed;
        console.log('Using more recent data, timestamp comparison:', { localTime, sessionTime });
        
        // Make sure we use the mental health history from the most recent data
        if (dataToUse.hasMentalHealthHistory) {
          setHasMentalHealthHistory(dataToUse.hasMentalHealthHistory);
        }
      } else {
        dataToUse = localData || sessionParsed || { hasMentalHealthHistory: hasMentalHealthHistory };
      }
      
      // Set the data in window object for the form to use
      (window as any).historyFormData = dataToUse;
      console.log('Setting medical history data in window object:', dataToUse);
      
      // Update session storage to match
      sessionStorage.setItem('historyFormData', JSON.stringify(dataToUse));
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading medical history data:', error);
      setIsLoaded(true); // Still show the form even if there's an error
    }
  };
  
  // Initial load
  useEffect(() => {
    loadData();
    
    // Listen for navigation changes to reload data
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading medical history data');
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
      const currentFormData = (window as any).historyFormData || {};
      // Ensure hasMentalHealthHistory is saved
      const dataToSave = {
        ...currentFormData,
        hasMentalHealthHistory: hasMentalHealthHistory,
        lastUpdated: new Date().toISOString()
      };
      
      sessionStorage.setItem('historyFormData', JSON.stringify(dataToSave));
      console.log('Saving medical history data on unmount/unload:', dataToSave);
      
      // Also save to localStorage for persistence
      try {
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const savedProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        
        localStorage.setItem('medicalProfile', JSON.stringify({
          ...savedProfile,
          history: dataToSave
        }));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    };
    
    const handleBeforeUnload = () => saveData();
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveData();
    };
  }, [hasMentalHealthHistory]);
  
  const handleMentalHealthHistoryChange = (value: string) => {
    setHasMentalHealthHistory(value);
    
    // Update window object and session storage immediately
    if ((window as any).historyFormData) {
      (window as any).historyFormData.hasMentalHealthHistory = value;
    } else {
      (window as any).historyFormData = { hasMentalHealthHistory: value };
    }
    
    const currentFormData = (window as any).historyFormData || {};
    sessionStorage.setItem('historyFormData', JSON.stringify({
      ...currentFormData,
      hasMentalHealthHistory: value,
      lastUpdated: new Date().toISOString()
    }));
    
    // Also update localStorage immediately
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      const savedProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
      
      localStorage.setItem('medicalProfile', JSON.stringify({
        ...savedProfile,
        history: {
          ...(savedProfile.history || {}),
          hasMentalHealthHistory: value,
          lastUpdated: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('Error saving mental health history to localStorage:', error);
    }
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.history || {};
      
      let newFormData = (window as any).historyFormData || {};
      newFormData.hasMentalHealthHistory = hasMentalHealthHistory;
      
      console.log('Saving medical history form data:', newFormData);
      
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
          hasMentalHealthHistory: hasMentalHealthHistory, // Ensure this is included
          completed: true,
          lastUpdated: currentTimestamp
        };
        
        const updatedProfile = {
          ...existingProfile,
          history: updatedFormData
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage and window object
        sessionStorage.setItem('historyFormData', JSON.stringify(updatedFormData));
        (window as any).historyFormData = updatedFormData;
        
        if (changes.length > 0) {
          logChanges('history', changes);
        }
        
        setIsSaving(false);
        toast.success('Medical history saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving medical history:', error);
      setIsSaving(false);
      toast.error('Error saving medical history');
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
      
      {isLoaded && (
        <MedicalProfileHistoryForm onMentalHealthHistoryChange={handleMentalHealthHistoryChange} />
      )}
      
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

export default HistorySection;
