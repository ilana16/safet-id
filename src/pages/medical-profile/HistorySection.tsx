
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileHistoryForm from '@/components/forms/MedicalProfileHistoryForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const HistorySection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  
  useEffect(() => {
    try {
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('historyFormData');
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          (window as any).historyFormData = parsedData;
          console.log('Setting history form data from session storage:', parsedData);
          
          if (parsedData.hasMentalHealthHistory) {
            setHasMentalHealthHistory(parsedData.hasMentalHealthHistory);
          }
          
          return;
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.history) {
          (window as any).historyFormData = savedProfile.history;
          console.log('Setting history form data in window object:', savedProfile.history);
          
          if (savedProfile.history.hasMentalHealthHistory) {
            setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
          }
          
          // Also save to session storage for better persistence
          sessionStorage.setItem('historyFormData', JSON.stringify(savedProfile.history));
        }
      }
    } catch (error) {
      console.error('Error loading history data:', error);
    }
  }, []);
  
  // Save form data periodically with auto-save
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const currentFormData = (window as any).historyFormData;
      if (currentFormData) {
        sessionStorage.setItem('historyFormData', JSON.stringify(currentFormData));
        console.log('Auto-saved history data to session storage:', currentFormData);
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => {
      clearInterval(autoSaveInterval);
    };
  }, []);
  
  // Add event listener for page unload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormData = (window as any).historyFormData;
      if (currentFormData) {
        sessionStorage.setItem('historyFormData', JSON.stringify(currentFormData));
        console.log('Saving history form data to session storage before unload:', currentFormData);
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
      const currentFormData = (window as any).historyFormData;
      if (currentFormData) {
        sessionStorage.setItem('historyFormData', JSON.stringify(currentFormData));
        console.log('Saving history form data to session storage on unmount:', currentFormData);
      }
    };
  }, []);
  
  const handleMentalHealthHistoryChange = (value: string) => {
    setHasMentalHealthHistory(value);
    
    if ((window as any).historyFormData) {
      (window as any).historyFormData.hasMentalHealthHistory = value;
    } else {
      (window as any).historyFormData = { hasMentalHealthHistory: value };
    }
    
    // Update session storage immediately when this value changes
    const currentFormData = (window as any).historyFormData || {};
    sessionStorage.setItem('historyFormData', JSON.stringify({
      ...currentFormData,
      hasMentalHealthHistory: value
    }));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.history || {};
      
      let newFormData = (window as any).historyFormData || {};
      
      newFormData.hasMentalHealthHistory = hasMentalHealthHistory;
      
      console.log('Saving history form data:', newFormData);
      
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
          history: {
            ...newFormData,
            completed: true
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('historyFormData', JSON.stringify({
          ...newFormData,
          completed: true
        }));
        
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
      
      <MedicalProfileHistoryForm 
        onMentalHealthHistoryChange={handleMentalHealthHistoryChange}
      />
      
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
