
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileHistoryForm from '@/components/forms/MedicalProfileHistoryForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const HistorySection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  
  // Load saved data when component mounts
  useEffect(() => {
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.history) {
          // Make the data available to the form via window object
          (window as any).historyFormData = savedProfile.history;
          console.log('Setting history form data in window object:', savedProfile.history);
          
          // Also update local state for mental health history
          if (savedProfile.history.hasMentalHealthHistory) {
            setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
          }
        }
      }
    } catch (error) {
      console.error('Error loading history data:', error);
    }
  }, []);
  
  const handleMentalHealthHistoryChange = (value: string) => {
    setHasMentalHealthHistory(value);
    
    // Also update the window object with the new value
    if ((window as any).historyFormData) {
      (window as any).historyFormData.hasMentalHealthHistory = value;
    } else {
      (window as any).historyFormData = { hasMentalHealthHistory: value };
    }
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.history || {};
      
      // Get form data from window object
      let newFormData = (window as any).historyFormData || {};
      
      // Ensure mental health history is included
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
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
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
      <MedicalProfileHistoryForm 
        onMentalHealthHistoryChange={handleMentalHealthHistoryChange}
        initialData={(window as any).historyFormData}
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
