
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileReproductiveHistoryForm from '@/components/forms/MedicalProfileReproductiveHistoryForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const ReproductiveSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.reproductive || {};
      
      let newFormData = (window as any).reproductiveHistoryFormData || {};
      
      console.log('Saving reproductive history form data:', newFormData);
      
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
        const updatedProfile = {
          ...existingProfile,
          reproductive: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        if (changes.length > 0) {
          logChanges('reproductive', changes);
        }
        
        setIsSaving(false);
        toast.success('Reproductive history saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving reproductive history:', error);
      setIsSaving(false);
      toast.error('Error saving reproductive history');
    }
  };

  return (
    <div>
      <MedicalProfileReproductiveHistoryForm />
      
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

export default ReproductiveSection;
