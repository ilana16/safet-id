
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileAllergiesForm from '@/components/forms/MedicalProfileAllergiesForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const AllergiesSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved data when component mounts
  useEffect(() => {
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.allergies) {
          // Make the data available to the form via window object
          (window as any).allergiesFormData = savedProfile.allergies;
          console.log('Setting allergies form data in window object:', savedProfile.allergies);
        }
      }
    } catch (error) {
      console.error('Error loading allergies profile data:', error);
    }
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.allergies || {};
      
      let newFormData = (window as any).allergiesFormData || {};
      
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
        const updatedProfile = {
          ...existingProfile,
          allergies: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
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
      <MedicalProfileAllergiesForm />
      
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
