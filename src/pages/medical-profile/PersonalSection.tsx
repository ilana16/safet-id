
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Save, PencilIcon } from 'lucide-react';
import MedicalProfilePersonalForm from '@/components/forms/MedicalProfilePersonalForm';
import { toast } from 'sonner';
import { logChanges } from '@/utils/changeLog';
import { useFieldPersistence } from '@/hooks/useFieldPersistence';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';

interface SectionContext {
  isEditing: boolean;
}

const PersonalSection = () => {
  const { isEditing } = useOutletContext<SectionContext>();
  const [isSaving, setIsSaving] = useState(false);
  const { saveSection } = useMedicalProfile();
  const [formData, updateFormData, saveData, isLoading] = useFieldPersistence('personal', {});
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).personalFormData || {};
      
      console.log('Saving personal form data:', newFormData);
      
      // Save the data and record changes
      updateFormData(newFormData);
      const saved = saveSection('personal');
      
      if (saved) {
        // Log changes for audit trail
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        const existingSectionData = existingProfile.personal || {};
        
        const changes: {field: string; oldValue: any; newValue: any}[] = [];
        
        // For personal section, we need to handle nested objects
        Object.keys(newFormData).forEach(key => {
          const oldValue = existingSectionData[key];
          const newValue = newFormData[key];
          
          // For objects, compare stringified versions
          if (typeof newValue === 'object' && newValue !== null) {
            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
              changes.push({
                field: key,
                oldValue: oldValue,
                newValue: newValue
              });
            }
          } else if (oldValue !== newValue) {
            // For primitive values
            changes.push({
              field: key,
              oldValue: oldValue,
              newValue: newValue
            });
          }
        });
        
        if (changes.length > 0) {
          logChanges('personal', changes);
        }
        
        toast.success('Personal information saved successfully');
      } else {
        toast.error('Error saving personal information');
      }
    } catch (error) {
      console.error('Error saving personal information:', error);
      toast.error('Error saving personal information');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-safet-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-safet-100 rounded mb-3"></div>
          <div className="h-3 w-24 bg-safet-50 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${!isEditing ? 'opacity-90' : ''}`}>
      <div className={`${!isEditing ? 'pointer-events-none' : ''}`}>
        <MedicalProfilePersonalForm />
      </div>
      
      {isEditing && (
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave} 
            className="bg-safet-500 hover:bg-safet-600 text-white"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Information'}
            {!isSaving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalSection;
