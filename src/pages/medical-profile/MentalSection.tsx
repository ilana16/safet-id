
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileMentalHealthForm from '@/components/forms/MedicalProfileMentalHealthForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { loadSectionData, saveSectionData, MEDICAL_DATA_CHANGE_EVENT } from '@/utils/medicalProfileService';

const MentalSection = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  
  // Load data on initial render and whenever navigation occurs
  useEffect(() => {
    const loadMentalData = () => {
      try {
        console.log('Loading mental health data');
        const mentalData = loadSectionData('mental');
        
        // Check if the user has mental health history to determine if we should show this section
        const savedProfileJson = localStorage.getItem('medicalProfile');
        if (savedProfileJson) {
          const savedProfile = JSON.parse(savedProfileJson);
          if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
            setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
            if (savedProfile.history.hasMentalHealthHistory === 'no') {
              navigate('/profile/functional');
            }
          }
        }
        
        setIsLoaded(true);
        
        // Trigger a UI refresh
        window.dispatchEvent(new CustomEvent('mentalDataLoaded'));
      } catch (error) {
        console.error('Error loading mental health data:', error);
        setIsLoaded(true); // Still show the form even if there's an error
      }
    };
    
    loadMentalData();
    
    // Listen for navigation changes and data requests
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading mental health data');
      loadMentalData();
    };
    
    const handleDataChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.section === 'mental') {
        console.log('Mental health data changed externally, reloading');
        loadMentalData();
      }
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('mentalDataRequest', handleNavChange);
    window.addEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('mentalDataRequest', handleNavChange);
      window.removeEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    };
  }, [navigate]);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).mentalHealthFormData || {};
      
      console.log('Saving mental health form data:', newFormData);
      
      // Save the data
      const saved = saveSectionData('mental', newFormData);
      
      if (saved) {
        // Log changes for audit trail
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        const existingSectionData = existingProfile.mental || {};
        
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
          logChanges('mental', changes);
        }
        
        setIsSaving(false);
        toast.success('Mental health information saved successfully');
      } else {
        setIsSaving(false);
        toast.error('Error saving mental health information');
      }
    } catch (error) {
      console.error('Error saving mental health information:', error);
      setIsSaving(false);
      toast.error('Error saving mental health information');
    }
  };

  if (hasMentalHealthHistory === 'no') {
    return null;
  }

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
      
      {isLoaded && <MedicalProfileMentalHealthForm />}
      
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

export default MentalSection;
