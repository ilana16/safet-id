
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileFunctionalStatusForm from '@/components/forms/MedicalProfileFunctionalStatusForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

const FunctionalSection = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.functional || {};
      
      let newFormData = (window as any).functionalStatusFormData || {};
      
      console.log('Saving functional status form data:', newFormData);
      
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
          functional: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        if (changes.length > 0) {
          logChanges('functional', changes);
        }
        
        setIsSaving(false);
        toast.success('Functional status information saved successfully');
        
        navigate('/profile/cultural');
      }, 500);
    } catch (error) {
      console.error('Error saving functional status information:', error);
      setIsSaving(false);
      toast.error('Error saving functional status information');
    }
  };

  return (
    <div>
      <MedicalProfileFunctionalStatusForm />
      
      <div className="mt-8 flex justify-end gap-3">
        <Button 
          variant="outline"
          onClick={() => {
            // Check if we should go back to mental health or reproductive
            const savedProfileJson = localStorage.getItem('medicalProfile');
            if (savedProfileJson) {
              const savedProfile = JSON.parse(savedProfileJson);
              if (savedProfile.history?.hasMentalHealthHistory === 'yes') {
                navigate('/profile/mental');
                return;
              }
            }
            navigate('/profile/reproductive');
          }}
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

export default FunctionalSection;
