
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfilePersonalForm from '@/components/forms/MedicalProfilePersonalForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const PersonalSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved data when component mounts
  useEffect(() => {
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.personal) {
          // Make the data available to the form via window object
          (window as any).personalFormData = savedProfile.personal;
          console.log('Setting personal form data in window object:', savedProfile.personal);
        }
      }
    } catch (error) {
      console.error('Error loading personal profile data:', error);
    }
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
      Object.entries(windowFormData.formData || {}).forEach(([key, value]) => {
        if (existingSectionData.formData && existingSectionData.formData[key] !== value) {
          changes.push({
            field: key,
            oldValue: existingSectionData.formData ? existingSectionData.formData[key] : undefined,
            newValue: value
          });
        }
      });
      
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
        const updatedProfile = {
          ...existingProfile,
          personal: {
            ...windowFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
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
      <MedicalProfilePersonalForm />
      
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

export default PersonalSection;
