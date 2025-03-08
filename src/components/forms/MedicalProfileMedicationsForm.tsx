
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

const MedicalProfileMedicationsForm = () => {
  // State for prescription medications
  const [medications, setMedications] = useState<Array<{
    name: string,
    dosage: string,
    frequency: string,
    reason: string
  }>>([]);
  
  // State for over-the-counter medications
  const [otcMedications, setOtcMedications] = useState<Array<{
    name: string,
    reason: string
  }>>([]);
  
  // State for supplements
  const [supplements, setSupplements] = useState<Array<{
    name: string,
    reason: string
  }>>([]);
  
  // State for medication allergies
  const [medicationAllergies, setMedicationAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  
  // Handler for prescription medications
  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', reason: '' }]);
  };
  
  const handleUpdateMedication = (index: number, field: keyof (typeof medications)[0], value: string) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };
  
  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };
  
  // Handler for OTC medications
  const handleAddOtcMedication = () => {
    setOtcMedications([...otcMedications, { name: '', reason: '' }]);
  };
  
  const handleUpdateOtcMedication = (index: number, field: keyof (typeof otcMedications)[0], value: string) => {
    const updatedOtcMedications = [...otcMedications];
    updatedOtcMedications[index][field] = value;
    setOtcMedications(updatedOtcMedications);
  };
  
  const handleRemoveOtcMedication = (index: number) => {
    setOtcMedications(otcMedications.filter((_, i) => i !== index));
  };
  
  // Handler for supplements
  const handleAddSupplement = () => {
    setSupplements([...supplements, { name: '', reason: '' }]);
  };
  
  const handleUpdateSupplement = (index: number, field: keyof (typeof supplements)[0], value: string) => {
    const updatedSupplements = [...supplements];
    updatedSupplements[index][field] = value;
    setSupplements(updatedSupplements);
  };
  
  const handleRemoveSupplement = (index: number) => {
    setSupplements(supplements.filter((_, i) => i !== index));
  };
  
  // Handler for medication allergies
  const handleAddAllergy = () => {
    if (newAllergy.trim() !== '') {
      setMedicationAllergies([...medicationAllergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };
  
  const handleRemoveAllergy = (index: number) => {
    setMedicationAllergies(medicationAllergies.filter((_, i) => i !== index));
  };
  
  // Common frequencies for medication
  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every morning",
    "Every evening",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Weekly",
    "Monthly",
    "Other"
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Prescription Medications</h3>
        <p className="text-sm text-gray-600 mb-4">List all prescribed medications you are currently taking.</p>
        
        {medications.length === 0 ? (
          <p className="text-sm text-gray-600 mb-2">No prescription medications added yet.</p>
        ) : (
          <div className="space-y-4">
            {medications.map((medication, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`med-name-${index}`}>Medication Name</Label>
                    <Input
                      id={`med-name-${index}`}
                      value={medication.name}
                      onChange={(e) => handleUpdateMedication(index, 'name', e.target.value)}
                      placeholder="Medication name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`med-dosage-${index}`}>Dosage</Label>
                    <Input
                      id={`med-dosage-${index}`}
                      value={medication.dosage}
                      onChange={(e) => handleUpdateMedication(index, 'dosage', e.target.value)}
                      placeholder="e.g., 10mg, 1 tablet"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`med-frequency-${index}`}>Frequency</Label>
                    <Select 
                      value={medication.frequency}
                      onValueChange={(value) => handleUpdateMedication(index, 'frequency', value)}
                    >
                      <SelectTrigger id={`med-frequency-${index}`}>
                        <SelectValue placeholder="How often taken" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`med-reason-${index}`}>Reason</Label>
                    <Input
                      id={`med-reason-${index}`}
                      value={medication.reason}
                      onChange={(e) => handleUpdateMedication(index, 'reason', e.target.value)}
                      placeholder="What it's prescribed for"
                    />
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveMedication(index)}
                  className="absolute top-3 right-3"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddMedication}
          className="mt-4"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Medication
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Over-the-Counter Medications</h3>
        <p className="text-sm text-gray-600 mb-4">List any non-prescription medications you take regularly.</p>
        
        {otcMedications.length === 0 ? (
          <p className="text-sm text-gray-600 mb-2">No over-the-counter medications added yet.</p>
        ) : (
          <div className="space-y-3">
            {otcMedications.map((medication, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                  <Input
                    value={medication.name}
                    onChange={(e) => handleUpdateOtcMedication(index, 'name', e.target.value)}
                    placeholder="Medication name (e.g. Ibuprofen)"
                  />
                  <Input
                    value={medication.reason}
                    onChange={(e) => handleUpdateOtcMedication(index, 'reason', e.target.value)}
                    placeholder="Reason for taking"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveOtcMedication(index)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddOtcMedication}
          className="mt-4"
        >
          <Plus className="h-4 w-4 mr-1" /> Add OTC Medication
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Supplements & Vitamins</h3>
        <p className="text-sm text-gray-600 mb-4">List any supplements or vitamins you take regularly.</p>
        
        {supplements.length === 0 ? (
          <p className="text-sm text-gray-600 mb-2">No supplements added yet.</p>
        ) : (
          <div className="space-y-3">
            {supplements.map((supplement, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                  <Input
                    value={supplement.name}
                    onChange={(e) => handleUpdateSupplement(index, 'name', e.target.value)}
                    placeholder="Supplement name"
                  />
                  <Input
                    value={supplement.reason}
                    onChange={(e) => handleUpdateSupplement(index, 'reason', e.target.value)}
                    placeholder="Reason for taking"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveSupplement(index)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddSupplement}
          className="mt-4"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Supplement
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Medication Allergies</h3>
        <p className="text-sm text-gray-600 mb-4">List any medications you are allergic to and the reaction if known.</p>
        
        <div className="flex gap-2 mb-2">
          <Input
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            placeholder="Medication name and reaction (e.g., Penicillin - rash)"
            className="flex-grow"
          />
          <Button
            onClick={handleAddAllergy}
            disabled={!newAllergy.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        {medicationAllergies.length > 0 && (
          <div className="mt-2">
            <ul className="space-y-2">
              {medicationAllergies.map((allergy, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <span>{allergy}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAllergy(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox id="pharmacy-permission" />
          <Label htmlFor="pharmacy-permission" className="text-sm cursor-pointer">
            I authorize healthcare providers to access my pharmacy records
          </Label>
        </div>
      </div>
    </div>
  );
};

export default MedicalProfileMedicationsForm;
