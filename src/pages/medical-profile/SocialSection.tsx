import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileSocialHistoryForm from '@/components/forms/MedicalProfileSocialHistoryForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { loadSectionData, saveSectionData } from '@/utils/medicalProfileService';

const SocialSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  useEffect(() => {
    const loadSocialData = () => {
      try {
        console.log('Loading social history data');
        const socialData = loadSectionData('social');
        setIsLoaded(true);
        
        // Trigger a UI refresh
        window.dispatchEvent(new CustomEvent('socialDataLoaded'));
      } catch (error) {
        console.error('Error loading social history data:', error);
        setIsLoaded(true); // Still show the form even if there's an error
      }
    };
    
    loadSocialData();
    
    // Listen for navigation changes and data requests
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading social history data');
      loadSocialData();
    };
    
    const handleDataChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.section === 'social') {
        console.log('Social history data changed externally, reloading');
        loadSocialData();
      }
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('socialDataRequest', handleNavChange);
    window.addEventListener('medicalDataChange', handleDataChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('socialDataRequest', handleNavChange);
      window.removeEventListener('medicalDataChange', handleDataChange);
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).socialHistoryFormData || {};
      
      console.log('Saving social history form data:', newFormData);
      
      // Save the data
      const saved = saveSectionData('social', newFormData);
      
      if (saved) {
        // Log changes for audit trail
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        const existingSectionData = existingProfile.social || {};
        
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
        
        if (changes.length > 0) {
          logChanges('social', changes);
        }
        
        setIsSaving(false);
        toast.success('Social history saved successfully');
      } else {
        setIsSaving(false);
        toast.error('Error saving social history');
      }
    } catch (error) {
      console.error('Error saving social history:', error);
      setIsSaving(false);
      toast.error('Error saving social history');
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
      
      {isLoaded && <MedicalProfileSocialHistoryForm />}
      
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
