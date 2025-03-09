
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
    // Check if this section should be shown
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (!savedProfileJson) return;
      
      const savedProfile = JSON.parse(savedProfileJson);
      
      if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
        setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
        if (savedProfile.history.hasMentalHealthHistory === 'no') {
          // If user shouldn't see this page, redirect
          navigate('/profile/functional');
        }
      }
    } catch (error) {
      console.error('Error checking mental health history status:', error);
    }
  }, [navigate]);
  
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
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        if (changes.length > 0) {
          logChanges('mental', changes);
        }
        
        setIsSaving(false);
        toast.success('Mental health information saved successfully');
        
        navigate('/profile/functional');
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
      <MedicalProfileMentalHealthForm />
      
      <div className="mt-8 flex justify-end gap-3">
        <Button 
          variant="outline"
          onClick={() => navigate('/profile/reproductive')}
        >
          Previous
        </Button>
        <Button 
          onClick={handleSave} 
          className="bg-safet-500 hover:bg-safet-600"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save & Continue'}
          {!isSaving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default MentalSection;
