
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileHistoryForm from '@/components/forms/MedicalProfileHistoryForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { loadSectionData, saveSectionData, MEDICAL_DATA_CHANGE_EVENT } from '@/utils/medicalProfileService';

interface SectionContext {
  isEditing: boolean;
}

const HistorySection = () => {
  const { isEditing } = useOutletContext<SectionContext>();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load data on initial render and whenever navigation occurs
  useEffect(() => {
    const loadHistoryData = () => {
      try {
        console.log('Loading medical history data');
        const historyData = loadSectionData('history');
        setIsLoaded(true);
        
        // Trigger a UI refresh
        window.dispatchEvent(new CustomEvent('historyDataLoaded'));
      } catch (error) {
        console.error('Error loading medical history data:', error);
        setIsLoaded(true); // Still show the form even if there's an error
      }
    };
    
    loadHistoryData();
    
    // Listen for navigation changes and data requests
    const handleNavChange = () => {
      console.log('Navigation change detected, reloading medical history data');
      loadHistoryData();
    };
    
    const handleDataChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.section === 'history') {
        console.log('History data changed externally, reloading');
        loadHistoryData();
      }
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('historyDataRequest', handleNavChange);
    window.addEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('historyDataRequest', handleNavChange);
      window.removeEventListener(MEDICAL_DATA_CHANGE_EVENT, handleDataChange);
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).historyFormData || {};
      
      console.log('Saving medical history form data:', newFormData);
      
      // Save the data
      const saved = saveSectionData('history', newFormData);
      
      if (saved) {
        // Log changes for audit trail
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        const existingSectionData = existingProfile.history || {};
        
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
          logChanges('history', changes);
        }
        
        setIsSaving(false);
        toast.success('Medical history saved successfully');
      } else {
        setIsSaving(false);
        toast.error('Error saving medical history');
      }
    } catch (error) {
      console.error('Error saving medical history:', error);
      setIsSaving(false);
      toast.error('Error saving medical history');
    }
  };

  return (
    <div className={`${!isEditing ? 'opacity-90' : ''}`}>
      {isLoaded && (
        <div className={`${!isEditing ? 'pointer-events-none' : ''}`}>
          <MedicalProfileHistoryForm />
        </div>
      )}
    </div>
  );
};

export default HistorySection;
