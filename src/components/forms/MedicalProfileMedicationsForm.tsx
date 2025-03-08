
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Clock, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define medication form types
interface DoseTime {
  time: string; // Format: HH:MM
  quantity: string;
}

interface Medication {
  name: string;
  totalDosage: string;
  unitOfMeasure: string;
  numberOfPills: string;
  dosagePerPill: string;
  medicationForm: string;
  withFood: string;
  prescriptionType: string;
  brandName: string;
  reason: string;
  doseTimes: DoseTime[];
}

interface SimpleMedication {
  name: string;
  reason: string;
}

const MedicalProfileMedicationsForm = () => {
  // State for prescription medications
  const [medications, setMedications] = useState<Medication[]>([]);
  
  // State for over-the-counter medications
  const [otcMedications, setOtcMedications] = useState<SimpleMedication[]>([]);
  
  // State for supplements
  const [supplements, setSupplements] = useState<SimpleMedication[]>([]);
  
  // State for medication allergies
  const [medicationAllergies, setMedicationAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  
  // Handler for prescription medications
  const handleAddMedication = () => {
    setMedications([...medications, { 
      name: '', 
      totalDosage: '', 
      unitOfMeasure: '', 
      numberOfPills: '', 
      dosagePerPill: '', 
      medicationForm: '',
      withFood: 'no_preference',
      prescriptionType: 'prescription',
      brandName: '',
      reason: '',
      doseTimes: [{ time: '', quantity: '1' }]
    }]);
  };
  
  const handleUpdateMedication = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...medications];
    updatedMedications[index][field] = value;
    setMedications(updatedMedications);
  };
  
  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };
  
  // Dose time handlers
  const handleAddDoseTime = (medicationIndex: number) => {
    const updatedMedications = [...medications];
    updatedMedications[medicationIndex].doseTimes.push({ time: '', quantity: '1' });
    setMedications(updatedMedications);
  };
  
  const handleUpdateDoseTime = (medicationIndex: number, doseTimeIndex: number, field: keyof DoseTime, value: string) => {
    const updatedMedications = [...medications];
    updatedMedications[medicationIndex].doseTimes[doseTimeIndex][field] = value;
    setMedications(updatedMedications);
  };
  
  const handleRemoveDoseTime = (medicationIndex: number, doseTimeIndex: number) => {
    const updatedMedications = [...medications];
    updatedMedications[medicationIndex].doseTimes = updatedMedications[medicationIndex].doseTimes.filter((_, i) => i !== doseTimeIndex);
    setMedications(updatedMedications);
  };
  
  // Handler for OTC medications
  const handleAddOtcMedication = () => {
    setOtcMedications([...otcMedications, { name: '', reason: '' }]);
  };
  
  const handleUpdateOtcMedication = (index: number, field: keyof SimpleMedication, value: string) => {
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
  
  const handleUpdateSupplement = (index: number, field: keyof SimpleMedication, value: string) => {
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
  
  // Options for form dropdowns
  const unitOptions = [
    "mg", "mcg", "g", "mL", "L", "IU", "tsp", "tbsp", "drops", "puffs", "patches", "applications", "units"
  ];
  
  const medicationFormOptions = [
    "Tablet", "Capsule", "Liquid", "Injection", "Patch", "Cream", "Ointment", "Gel", 
    "Spray", "Inhaler", "Drops", "Suppository", "Powder", "Lozenges", "Other"
  ];
  
  const withFoodOptions = [
    { value: "with_food", label: "With food" },
    { value: "without_food", label: "Without food" },
    { value: "no_preference", label: "No preference" }
  ];
  
  const prescriptionTypeOptions = [
    { value: "prescription", label: "Prescription" },
    { value: "over_the_counter", label: "Over-the-counter" }
  ];

  return (
    <div className="space-y-8">
      <Tabs defaultValue="prescription" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="prescription">Prescription Medications</TabsTrigger>
          <TabsTrigger value="otc">OTC Medications</TabsTrigger>
          <TabsTrigger value="supplements">Supplements & Vitamins</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prescription" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Prescription Medications</h3>
            <p className="text-sm text-gray-600 mb-4">List all prescribed medications you are currently taking.</p>
            
            {medications.length === 0 ? (
              <p className="text-sm text-gray-600 mb-2">No prescription medications added yet.</p>
            ) : (
              <div className="space-y-4">
                {medications.map((medication, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50 relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveMedication(index)}
                      className="absolute top-3 right-3"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor={`med-name-${index}`}>Medication Name*</Label>
                        <Input
                          id={`med-name-${index}`}
                          value={medication.name}
                          onChange={(e) => handleUpdateMedication(index, 'name', e.target.value)}
                          placeholder="Medication name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`med-brand-${index}`}>Brand Name</Label>
                        <Input
                          id={`med-brand-${index}`}
                          value={medication.brandName}
                          onChange={(e) => handleUpdateMedication(index, 'brandName', e.target.value)}
                          placeholder="Brand name (if known)"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`med-form-${index}`}>Medication Form</Label>
                        <Select 
                          value={medication.medicationForm}
                          onValueChange={(value) => handleUpdateMedication(index, 'medicationForm', value)}
                        >
                          <SelectTrigger id={`med-form-${index}`}>
                            <SelectValue placeholder="Select form" />
                          </SelectTrigger>
                          <SelectContent>
                            {medicationFormOptions.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`med-type-${index}`}>Prescription Type</Label>
                        <Select 
                          value={medication.prescriptionType}
                          onValueChange={(value) => handleUpdateMedication(index, 'prescriptionType', value)}
                        >
                          <SelectTrigger id={`med-type-${index}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {prescriptionTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`med-total-dosage-${index}`}>Total Dosage at Time</Label>
                        <Input
                          id={`med-total-dosage-${index}`}
                          value={medication.totalDosage}
                          onChange={(e) => handleUpdateMedication(index, 'totalDosage', e.target.value)}
                          placeholder="Total dosage"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`med-unit-${index}`}>Unit of Measure</Label>
                        <Select 
                          value={medication.unitOfMeasure}
                          onValueChange={(value) => handleUpdateMedication(index, 'unitOfMeasure', value)}
                        >
                          <SelectTrigger id={`med-unit-${index}`}>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {unitOptions.map((option) => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`med-num-pills-${index}`}>Number of Pills/Measures at Time</Label>
                        <Input
                          id={`med-num-pills-${index}`}
                          value={medication.numberOfPills}
                          onChange={(e) => handleUpdateMedication(index, 'numberOfPills', e.target.value)}
                          placeholder="Number of pills/measures"
                          type="number"
                          min="0"
                          step="0.5"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`med-dosage-per-pill-${index}`}>Dosage Per Pill</Label>
                        <Input
                          id={`med-dosage-per-pill-${index}`}
                          value={medication.dosagePerPill}
                          onChange={(e) => handleUpdateMedication(index, 'dosagePerPill', e.target.value)}
                          placeholder="Dosage per pill"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`med-food-${index}`}>With or Without Food</Label>
                        <Select 
                          value={medication.withFood}
                          onValueChange={(value) => handleUpdateMedication(index, 'withFood', value)}
                        >
                          <SelectTrigger id={`med-food-${index}`}>
                            <SelectValue placeholder="Select preference" />
                          </SelectTrigger>
                          <SelectContent>
                            {withFoodOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor={`med-reason-${index}`}>Reason/Condition</Label>
                      <Textarea
                        id={`med-reason-${index}`}
                        value={medication.reason}
                        onChange={(e) => handleUpdateMedication(index, 'reason', e.target.value)}
                        placeholder="What it's prescribed for"
                      />
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">Times of Day for Doses</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleAddDoseTime(index)}
                          className="h-8"
                        >
                          <Clock className="h-3.5 w-3.5 mr-1" /> Add Time
                        </Button>
                      </div>
                      
                      {medication.doseTimes.length === 0 ? (
                        <p className="text-sm text-gray-600">No dose times added yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {medication.doseTimes.map((doseTime, doseIndex) => (
                            <div key={doseIndex} className="flex items-center gap-2 bg-white p-2 rounded-md border border-gray-100">
                              <div className="flex-grow grid grid-cols-2 gap-2">
                                <div>
                                  <Label htmlFor={`dose-time-${index}-${doseIndex}`} className="sr-only">Time of Day</Label>
                                  <Input
                                    id={`dose-time-${index}-${doseIndex}`}
                                    type="time"
                                    value={doseTime.time}
                                    onChange={(e) => handleUpdateDoseTime(index, doseIndex, 'time', e.target.value)}
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`dose-quantity-${index}-${doseIndex}`} className="sr-only">Quantity</Label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      id={`dose-quantity-${index}-${doseIndex}`}
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={doseTime.quantity}
                                      onChange={(e) => handleUpdateDoseTime(index, doseIndex, 'quantity', e.target.value)}
                                      className="h-9"
                                      placeholder="Dose quantity"
                                    />
                                    <span className="text-sm whitespace-nowrap">{medication.medicationForm || 'dose'}{Number(doseTime.quantity) !== 1 ? 's' : ''}</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveDoseTime(index, doseIndex)}
                                disabled={medication.doseTimes.length <= 1}
                                className="h-9 w-9"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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
        </TabsContent>
        
        <TabsContent value="otc" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Over-the-Counter Medications</h3>
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
        </TabsContent>
        
        <TabsContent value="supplements" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Supplements & Vitamins</h3>
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
        </TabsContent>
      </Tabs>
      
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
