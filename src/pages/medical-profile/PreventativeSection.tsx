
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfilePreventativeCareForm from '@/components/forms/MedicalProfilePreventativeCareForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const PreventativeSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
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
        const updatedProfile = {
          ...existingProfile,
          preventative: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
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
      <MedicalProfilePreventativeCareForm />
      
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
