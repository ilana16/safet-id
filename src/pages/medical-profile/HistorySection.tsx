
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileHistoryForm from '@/components/forms/MedicalProfileHistoryForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const HistorySection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  
  const handleMentalHealthHistoryChange = (value: string) => {
    setHasMentalHealthHistory(value);
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
            completed: true,
            lastUpdated: new Date().toISOString(),
            hasMentalHealthHistory
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
      <MedicalProfileHistoryForm onMentalHealthHistoryChange={handleMentalHealthHistoryChange} />
      
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
