
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileCulturalPreferencesForm from '@/components/forms/MedicalProfileCulturalPreferencesForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { loadSectionData, saveSectionData } from '@/utils/medicalProfileService';

interface SectionContext {
  isEditing: boolean;
}

const CulturalSection = () => {
  const { isEditing } = useOutletContext<SectionContext>();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const loadCulturalData = () => {
      try {
        console.log('Loading cultural preferences data');
        const culturalData = loadSectionData('cultural');
        setIsLoaded(true);
        
        window.dispatchEvent(new CustomEvent('culturalDataLoaded'));
      } catch (error) {
        console.error('Error loading cultural preferences data:', error);
        setIsLoaded(true);
      }
    };
    
    loadCulturalData();
    
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading cultural preferences data');
      loadCulturalData();
    };
    
    const handleDataChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.section === 'cultural') {
        console.log('Cultural preferences data changed externally, reloading');
        loadCulturalData();
      }
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('culturalDataRequest', handleNavChange);
    window.addEventListener('medicalDataChange', handleDataChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('culturalDataRequest', handleNavChange);
      window.removeEventListener('medicalDataChange', handleDataChange);
    };
  }, []);
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const newFormData = (window as any).culturalPreferencesFormData || {};
      
      console.log('Saving cultural preferences form data:', newFormData);
      
      const saved = await saveSectionData('cultural', newFormData);
      
      if (saved) {
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        const existingSectionData = existingProfile.cultural || {};
        
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
        
        if (changes.length > 0) {
          logChanges('cultural', changes);
        }
        
        setIsSaving(false);
        toast.success('Cultural preferences saved successfully');
      } else {
        setIsSaving(false);
        toast.error('Error saving cultural preferences');
      }
    } catch (error) {
      console.error('Error saving cultural preferences:', error);
      setIsSaving(false);
      toast.error('Error saving cultural preferences');
    }
  };

  return (
    <div className={`${!isEditing ? 'opacity-90' : ''}`}>
      {isEditing && (
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
      )}
      
      {isLoaded && (
        <div className={`${!isEditing ? 'pointer-events-none' : ''}`}>
          <MedicalProfileCulturalPreferencesForm />
        </div>
      )}
      
      {isEditing && (
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
      )}
    </div>
  );
};

export default CulturalSection;
