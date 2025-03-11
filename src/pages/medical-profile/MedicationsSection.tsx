
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { useFieldPersistence } from '@/hooks/useFieldPersistence';

// Define the type for medications data
interface MedicationsData {
  prescriptions: any[];
  otc: any[];
  supplements: any[];
  [key: string]: any;
}

const initialMedicationsData: MedicationsData = {
  prescriptions: [{
    id: `med_${Date.now()}`,
    name: '',
    totalDosage: '',
    unit: '',
    pillsPerDose: '',
    dosagePerPill: '',
    form: '',
    customForm: '',
    withFood: 'with',
    prescriptionType: 'prescription',
    brandName: '',
    reason: '',
    doseTimes: [{ id: `time_${Date.now()}`, time: '' }]
  }],
  otc: [{
    id: `otc_${Date.now()}`,
    name: '',
    totalDosage: '',
    unit: '',
    pillsPerDose: '',
    dosagePerPill: '',
    form: '',
    customForm: '',
    withFood: 'with',
    brandName: '',
    reason: '',
    doseTimes: [{ id: `time_${Date.now()}`, time: '' }]
  }],
  supplements: [{
    id: `supp_${Date.now()}`,
    name: '',
    totalDosage: '',
    unit: '',
    pillsPerDose: '',
    dosagePerPill: '',
    form: '',
    customForm: '',
    withFood: 'with',
    brandName: '',
    reason: '',
    doseTimes: [{ id: `time_${Date.now()}`, time: '' }]
  }]
};

const MedicationsSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Use the useFieldPersistence hook for medications data
  const [medicationsData, updateMedicationsData, saveMedicationsData] = useFieldPersistence<MedicationsData>(
    'medications',
    initialMedicationsData
  );
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Make the medications data available to the MedicalProfileMedicationsForm
    if (medicationsData) {
      (window as any).medicationsFormData = medicationsData;
    }
  }, [medicationsData]);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).medicationsFormData || {};
      
      console.log('Saving medications form data:', newFormData);
      
      // Update the context and persist the data
      updateMedicationsData(newFormData);
      saveMedicationsData();
      
      // Get the saved profile from localStorage for comparison
      const savedProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
      const existingSectionData = existingProfile.medications || {};
      
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
        logChanges('medications', changes);
      }
      
      setIsSaving(false);
      toast.success('Medications saved successfully');
    } catch (error) {
      console.error('Error saving medications:', error);
      setIsSaving(false);
      toast.error('Error saving medications');
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
      
      {isLoaded && <MedicalProfileMedicationsForm />}
      
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

export default MedicationsSection;
