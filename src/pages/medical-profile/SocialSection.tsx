
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileSocialHistoryForm from '@/components/forms/MedicalProfileSocialHistoryForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const SocialSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Load saved data when component mounts
  useEffect(() => {
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.social) {
          // Make the data available to the form via window object
          (window as any).socialHistoryFormData = savedProfile.social;
          console.log('Setting social history form data in window object:', savedProfile.social);
        }
      }
    } catch (error) {
      console.error('Error loading social history data:', error);
    }
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.social || {};
      
      let newFormData = (window as any).socialHistoryFormData || {};
      
      console.log('Saving social history form data:', newFormData);
      
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
          social: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        if (changes.length > 0) {
          logChanges('social', changes);
        }
        
        setIsSaving(false);
        toast.success('Social history saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving social history:', error);
      setIsSaving(false);
      toast.error('Error saving social history');
    }
  };

  return (
    <div>
      <MedicalProfileSocialHistoryForm />
      
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

export default SocialSection;
