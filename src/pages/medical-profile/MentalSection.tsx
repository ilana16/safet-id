
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileMentalHealthForm from '@/components/forms/MedicalProfileMentalHealthForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const MentalSection = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  
  useEffect(() => {
    try {
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('mentalHealthFormData');
      if (sessionData) {
        (window as any).mentalHealthFormData = JSON.parse(sessionData);
        console.log('Setting mental health form data from session storage:', JSON.parse(sessionData));
        
        // Still check if the user has mental health history to determine if we should show this section
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
        
        return;
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (!savedProfileJson) return;
      
      const savedProfile = JSON.parse(savedProfileJson);
      
      if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
        setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
        if (savedProfile.history.hasMentalHealthHistory === 'no') {
          navigate('/profile/functional');
        }
      }
      
      if (savedProfile && savedProfile.mental) {
        (window as any).mentalHealthFormData = savedProfile.mental;
        console.log('Setting mental health form data in window object:', savedProfile.mental);
        
        // Also save to session storage for better persistence
        sessionStorage.setItem('mentalHealthFormData', JSON.stringify(savedProfile.mental));
      }
    } catch (error) {
      console.error('Error loading mental health data:', error);
    }
  }, [navigate]);
  
  // Add event listener for page unload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormData = (window as any).mentalHealthFormData;
      if (currentFormData) {
        sessionStorage.setItem('mentalHealthFormData', JSON.stringify(currentFormData));
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.mental || {};
      
      let newFormData = (window as any).mentalHealthFormData || {};
      
      console.log('Saving mental health form data:', newFormData);
      
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
          mental: {
            ...newFormData,
            completed: true
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('mentalHealthFormData', JSON.stringify({
          ...newFormData,
          completed: true
        }));
        
        if (changes.length > 0) {
          logChanges('mental', changes);
        }
        
        setIsSaving(false);
        toast.success('Mental health information saved successfully');
      }, 500);
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
      
      <MedicalProfileMentalHealthForm />
      
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
