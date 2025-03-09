
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileCulturalPreferencesForm from '@/components/forms/MedicalProfileCulturalPreferencesForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const CulturalSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved data when component mounts
  useEffect(() => {
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.cultural) {
          // Make the data available to the form via window object
          (window as any).culturalPreferencesFormData = savedProfile.cultural;
          console.log('Setting cultural preferences form data in window object:', savedProfile.cultural);
        }
      }
    } catch (error) {
      console.error('Error loading cultural preferences data:', error);
    }
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.cultural || {};
      
      let newFormData = (window as any).culturalPreferencesFormData || {};
      
      console.log('Saving cultural preferences form data:', newFormData);
      
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
          cultural: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        if (changes.length > 0) {
          logChanges('cultural', changes);
        }
        
        setIsSaving(false);
        toast.success('Cultural preferences saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving cultural preferences:', error);
      setIsSaving(false);
      toast.error('Error saving cultural preferences');
    }
  };

  return (
    <div>
      <MedicalProfileCulturalPreferencesForm />
      
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

export default CulturalSection;
