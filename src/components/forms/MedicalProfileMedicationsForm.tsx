
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

// Define types
interface DoseTime {
  id: string;
  time: string;
}

interface Medication {
  id: string;
  name: string;
  totalDosage: string;
  unit: string;
  pillsPerDose: string;
  dosagePerPill: string;
  form: string;
  customForm: string;
  withFood: string;
  prescriptionType: string;
  brandName: string;
  reason: string;
  doseTimes: DoseTime[];
}

interface OTCMedication {
  id: string;
  name: string;
  totalDosage: string;
  unit: string;
  pillsPerDose: string;
  dosagePerPill: string;
  form: string;
  customForm: string;
  withFood: string;
  brandName: string;
  reason: string;
  doseTimes: DoseTime[];
}

interface Supplement {
  id: string;
  name: string;
  totalDosage: string;
  unit: string;
  pillsPerDose: string;
  dosagePerPill: string;
  form: string;
  customForm: string;
  withFood: string;
  brandName: string;
  reason: string;
  doseTimes: DoseTime[];
}

const defaultMedication: Medication = {
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
};

const defaultOtcMedication: OTCMedication = {
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
};

const defaultSupplement: Supplement = {
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
};

const MedicalProfileMedicationsForm = () => {
  // State for prescription medications
  const [medications, setMedications] = useState<Medication[]>([
    { ...defaultMedication }
  ]);

  // State for OTC medications
  const [otcMedications, setOtcMedications] = useState<OTCMedication[]>([
    { ...defaultOtcMedication }
  ]);

  // State for supplements
  const [supplements, setSupplements] = useState<Supplement[]>([
    { ...defaultSupplement }
  ]);

  // Load saved data when component mounts
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
    
    if (savedProfile && savedProfile.medications) {
      // Load saved medications
      if (savedProfile.medications.prescriptions && savedProfile.medications.prescriptions.length > 0) {
        setMedications(savedProfile.medications.prescriptions);
      }
      
      // Load saved OTC medications
      if (savedProfile.medications.otc && savedProfile.medications.otc.length > 0) {
        setOtcMedications(savedProfile.medications.otc);
      }
      
      // Load saved supplements
      if (savedProfile.medications.supplements && savedProfile.medications.supplements.length > 0) {
        setSupplements(savedProfile.medications.supplements);
      }
    }
  }, []);

  // Handler for adding a new prescription medication
  const addMedication = () => {
    const newMed: Medication = {
      ...defaultMedication,
      id: `med_${Date.now()}`
    };
    setMedications([...medications, newMed]);
  };

  // Handler for removing a prescription medication
  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  // Handler for adding a new OTC medication
  const addOtcMedication = () => {
    const newOtc: OTCMedication = {
      ...defaultOtcMedication,
      id: `otc_${Date.now()}`
    };
    setOtcMedications([...otcMedications, newOtc]);
  };

  // Handler for removing an OTC medication
  const removeOtcMedication = (id: string) => {
    if (otcMedications.length > 1) {
      setOtcMedications(otcMedications.filter(otc => otc.id !== id));
    }
  };

  // Handler for adding a new supplement
  const addSupplement = () => {
    const newSupplement: Supplement = {
      ...defaultSupplement,
      id: `supp_${Date.now()}`
    };
    setSupplements([...supplements, newSupplement]);
  };

  // Handler for removing a supplement
  const removeSupplement = (id: string) => {
    if (supplements.length > 1) {
      setSupplements(supplements.filter(supp => supp.id !== id));
    }
  };

  // Handler for updating medication fields
  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  // Handler for updating OTC medication fields
  const updateOtcMedication = (id: string, field: keyof OTCMedication, value: string) => {
    setOtcMedications(otcMedications.map(otc => 
      otc.id === id ? { ...otc, [field]: value } : otc
    ));
  };

  // Handler for updating supplement fields
  const updateSupplement = (id: string, field: keyof Supplement, value: string) => {
    setSupplements(supplements.map(supp => 
      supp.id === id ? { ...supp, [field]: value } : supp
    ));
  };

  // Handler for adding a dose time to a medication
  const addDoseTime = (medicationType: 'prescription' | 'otc' | 'supplement', medId: string) => {
    const newDoseTime = { id: `time_${Date.now()}`, time: '' };
    
    if (medicationType === 'prescription') {
      setMedications(medications.map(med => 
        med.id === medId ? { ...med, doseTimes: [...med.doseTimes, newDoseTime] } : med
      ));
    } else if (medicationType === 'otc') {
      setOtcMedications(otcMedications.map(otc => 
        otc.id === medId ? { ...otc, doseTimes: [...otc.doseTimes, newDoseTime] } : otc
      ));
    } else {
      setSupplements(supplements.map(supp => 
        supp.id === medId ? { ...supp, doseTimes: [...supp.doseTimes, newDoseTime] } : supp
      ));
    }
  };

  // Handler for removing a dose time from a medication
  const removeDoseTime = (medicationType: 'prescription' | 'otc' | 'supplement', medId: string, timeId: string) => {
    if (medicationType === 'prescription') {
      setMedications(medications.map(med => {
        if (med.id === medId && med.doseTimes.length > 1) {
          return {
            ...med,
            doseTimes: med.doseTimes.filter(time => time.id !== timeId)
          };
        }
        return med;
      }));
    } else if (medicationType === 'otc') {
      setOtcMedications(otcMedications.map(otc => {
        if (otc.id === medId && otc.doseTimes.length > 1) {
          return {
            ...otc,
            doseTimes: otc.doseTimes.filter(time => time.id !== timeId)
          };
        }
        return otc;
      }));
    } else {
      setSupplements(supplements.map(supp => {
        if (supp.id === medId && supp.doseTimes.length > 1) {
          return {
            ...supp,
            doseTimes: supp.doseTimes.filter(time => time.id !== timeId)
          };
        }
        return supp;
      }));
    }
  };

  // Handler for updating a dose time
  const updateDoseTime = (
    medicationType: 'prescription' | 'otc' | 'supplement',
    medId: string,
    timeId: string,
    value: string
  ) => {
    if (medicationType === 'prescription') {
      setMedications(medications.map(med => {
        if (med.id === medId) {
          return {
            ...med,
            doseTimes: med.doseTimes.map(time => 
              time.id === timeId ? { ...time, time: value } : time
            )
          };
        }
        return med;
      }));
    } else if (medicationType === 'otc') {
      setOtcMedications(otcMedications.map(otc => {
        if (otc.id === medId) {
          return {
            ...otc,
            doseTimes: otc.doseTimes.map(time => 
              time.id === timeId ? { ...time, time: value } : time
            )
          };
        }
        return otc;
      }));
    } else {
      setSupplements(supplements.map(supp => {
        if (supp.id === medId) {
          return {
            ...supp,
            doseTimes: supp.doseTimes.map(time => 
              time.id === timeId ? { ...time, time: value } : time
            )
          };
        }
        return supp;
      }));
    }
  };

  // This function prepares the form data for submission
  const prepareFormData = () => {
    return {
      prescriptions: medications,
      otc: otcMedications,
      supplements: supplements
    };
  };

  // Export the form data for the parent component to access
  React.useEffect(() => {
    // Attach the form data to the window object for the parent component to access
    (window as any).medicationsFormData = prepareFormData();
  }, [medications, otcMedications, supplements]);

  return (
    <div className="space-y-8">
      {/* Prescription Medications Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Prescription Medications</h3>
        
        {medications.map((med, index) => (
          <div key={med.id} className="p-4 border border-gray-200 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Medication #{index + 1}</h4>
              {medications.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeMedication(med.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`med-name-${med.id}`}>Medication Name</Label>
                <Input
                  id={`med-name-${med.id}`}
                  value={med.name}
                  onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                  placeholder="Enter medication name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-brand-${med.id}`}>Brand Name</Label>
                <Input
                  id={`med-brand-${med.id}`}
                  value={med.brandName}
                  onChange={(e) => updateMedication(med.id, 'brandName', e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`med-dosage-${med.id}`}>Total Dosage at Time</Label>
                <Input
                  id={`med-dosage-${med.id}`}
                  value={med.totalDosage}
                  onChange={(e) => updateMedication(med.id, 'totalDosage', e.target.value)}
                  placeholder="e.g., 500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-unit-${med.id}`}>Unit of Measure</Label>
                <Select
                  value={med.unit}
                  onValueChange={(value) => updateMedication(med.id, 'unit', value)}
                >
                  <SelectTrigger id={`med-unit-${med.id}`}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg">mg (milligram)</SelectItem>
                    <SelectItem value="mcg">mcg (microgram)</SelectItem>
                    <SelectItem value="g">g (gram)</SelectItem>
                    <SelectItem value="ml">ml (milliliter)</SelectItem>
                    <SelectItem value="IU">IU (International Unit)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {med.unit === 'other' && (
                  <Input
                    className="mt-2"
                    placeholder="Specify unit"
                    value={med.customForm}
                    onChange={(e) => updateMedication(med.id, 'customForm', e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-pills-${med.id}`}>Number of Pills/Measures at time</Label>
                <Input
                  id={`med-pills-${med.id}`}
                  value={med.pillsPerDose}
                  onChange={(e) => updateMedication(med.id, 'pillsPerDose', e.target.value)}
                  placeholder="e.g., 1, 2, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-dosage-per-pill-${med.id}`}>Dosage Per Pill</Label>
                <Input
                  id={`med-dosage-per-pill-${med.id}`}
                  value={med.dosagePerPill}
                  onChange={(e) => updateMedication(med.id, 'dosagePerPill', e.target.value)}
                  placeholder="e.g., 250mg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-form-${med.id}`}>Medication Form</Label>
                <Select
                  value={med.form}
                  onValueChange={(value) => updateMedication(med.id, 'form', value)}
                >
                  <SelectTrigger id={`med-form-${med.id}`}>
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="capsule">Capsule</SelectItem>
                    <SelectItem value="liquid">Liquid</SelectItem>
                    <SelectItem value="injection">Injection</SelectItem>
                    <SelectItem value="patch">Patch</SelectItem>
                    <SelectItem value="cream">Cream/Ointment</SelectItem>
                    <SelectItem value="inhaler">Inhaler</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {med.form === 'other' && (
                  <Input
                    className="mt-2"
                    placeholder="Specify form"
                    value={med.customForm}
                    onChange={(e) => updateMedication(med.id, 'customForm', e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-food-${med.id}`}>With or Without Food</Label>
                <Select
                  value={med.withFood}
                  onValueChange={(value) => updateMedication(med.id, 'withFood', value)}
                >
                  <SelectTrigger id={`med-food-${med.id}`}>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="with">With Food</SelectItem>
                    <SelectItem value="without">Without Food</SelectItem>
                    <SelectItem value="either">Either is Fine</SelectItem>
                    <SelectItem value="other">Other/Special Instructions</SelectItem>
                  </SelectContent>
                </Select>
                {med.withFood === 'other' && (
                  <Textarea
                    className="mt-2"
                    placeholder="Specify special instructions"
                    value={med.reason}
                    onChange={(e) => updateMedication(med.id, 'reason', e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`med-type-${med.id}`}>Prescription Type</Label>
                <Select
                  value={med.prescriptionType}
                  onValueChange={(value) => updateMedication(med.id, 'prescriptionType', value)}
                >
                  <SelectTrigger id={`med-type-${med.id}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="controlled">Controlled Substance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {med.prescriptionType === 'other' && (
                  <Input
                    className="mt-2"
                    placeholder="Specify type"
                    value={med.customForm}
                    onChange={(e) => updateMedication(med.id, 'customForm', e.target.value)}
                  />
                )}
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor={`med-reason-${med.id}`}>Reason for Taking</Label>
                <Textarea
                  id={`med-reason-${med.id}`}
                  value={med.reason}
                  onChange={(e) => updateMedication(med.id, 'reason', e.target.value)}
                  placeholder="What condition or symptom is this medication treating?"
                />
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label>Times of Day for Doses</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addDoseTime('prescription', med.id)}
                  className="text-safet-600 border-safet-200"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Add Time
                </Button>
              </div>
              
              <div className="space-y-2">
                {med.doseTimes.map((doseTime, timeIndex) => (
                  <div key={doseTime.id} className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={doseTime.time}
                      onChange={(e) => updateDoseTime('prescription', med.id, doseTime.id, e.target.value)}
                      className="flex-1"
                    />
                    {med.doseTimes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDoseTime('prescription', med.id, doseTime.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addMedication}
          className="w-full text-safet-600 border-safet-200"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Prescription Medication
        </Button>
      </div>
      
      {/* OTC Medications Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium">Over-the-Counter Medications</h3>
        
        {otcMedications.map((otc, index) => (
          <div key={otc.id} className="p-4 border border-gray-200 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">OTC Medication #{index + 1}</h4>
              {otcMedications.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeOtcMedication(otc.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`otc-name-${otc.id}`}>Medication Name</Label>
                <Input
                  id={`otc-name-${otc.id}`}
                  value={otc.name}
                  onChange={(e) => updateOtcMedication(otc.id, 'name', e.target.value)}
                  placeholder="Enter medication name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`otc-brand-${otc.id}`}>Brand Name</Label>
                <Input
                  id={`otc-brand-${otc.id}`}
                  value={otc.brandName}
                  onChange={(e) => updateOtcMedication(otc.id, 'brandName', e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`otc-dosage-${otc.id}`}>Total Dosage at Time</Label>
                <Input
                  id={`otc-dosage-${otc.id}`}
                  value={otc.totalDosage}
                  onChange={(e) => updateOtcMedication(otc.id, 'totalDosage', e.target.value)}
                  placeholder="e.g., 500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`otc-unit-${otc.id}`}>Unit of Measure</Label>
                <Select
                  value={otc.unit}
                  onValueChange={(value) => updateOtcMedication(otc.id, 'unit', value)}
                >
                  <SelectTrigger id={`otc-unit-${otc.id}`}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg">mg (milligram)</SelectItem>
                    <SelectItem value="mcg">mcg (microgram)</SelectItem>
                    <SelectItem value="g">g (gram)</SelectItem>
                    <SelectItem value="ml">ml (milliliter)</SelectItem>
                    <SelectItem value="IU">IU (International Unit)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {otc.unit === 'other' && (
                  <Input
                    className="mt-2"
                    placeholder="Specify unit"
                    value={otc.customForm}
                    onChange={(e) => updateOtcMedication(otc.id, 'customForm', e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`otc-pills-${otc.id}`}>Number of Pills/Measures at time</Label>
                <Input
                  id={`otc-pills-${otc.id}`}
                  value={otc.pillsPerDose}
                  onChange={(e) => updateOtcMedication(otc.id, 'pillsPerDose', e.target.value)}
                  placeholder="e.g., 1, 2, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`otc-dosage-per-pill-${otc.id}`}>Dosage Per Pill</Label>
                <Input
                  id={`otc-dosage-per-pill-${otc.id}`}
                  value={otc.dosagePerPill}
                  onChange={(e) => updateOtcMedication(otc.id, 'dosagePerPill', e.target.value)}
                  placeholder="e.g., 250mg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`otc-form-${otc.id}`}>Medication Form</Label>
                <Select
                  value={otc.form}
                  onValueChange={(value) => updateOtcMedication(otc.id, 'form', value)}
                >
                  <SelectTrigger id={`otc-form-${otc.id}`}>
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="capsule">Capsule</SelectItem>
                    <SelectItem value="liquid">Liquid</SelectItem>
                    <SelectItem value="spray">Spray</SelectItem>
                    <SelectItem value="cream">Cream/Ointment</SelectItem>
                    <SelectItem value="drop">Drops</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {otc.form === 'other' && (
                  <Input
                    className="mt-2"
                    placeholder="Specify form"
                    value={otc.customForm}
                    onChange={(e) => updateOtcMedication(otc.id, 'customForm', e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`otc-food-${otc.id}`}>With or Without Food</Label>
                <Select
                  value={otc.withFood}
                  onValueChange={(value) => updateOtcMedication(otc.id, 'withFood', value)}
                >
                  <SelectTrigger id={`otc-food-${otc.id}`}>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="with">With Food</SelectItem>
                    <SelectItem value="without">Without Food</SelectItem>
                    <SelectItem value="either">Either is Fine</SelectItem>
                    <SelectItem value="other">Other/Special Instructions</SelectItem>
                  </SelectContent>
                </Select>
                {otc.withFood === 'other' && (
                  <Textarea
                    className="mt-2"
                    placeholder="Specify special instructions"
                    value={otc.reason}
                    onChange={(e) => updateOtcMedication(otc.id, 'reason', e.target.value)}
                  />
                )}
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor={`otc-reason-${otc.id}`}>Reason for Taking</Label>
                <Textarea
                  id={`otc-reason-${otc.id}`}
                  value={otc.reason}
                  onChange={(e) => updateOtcMedication(otc.id, 'reason', e.target.value)}
                  placeholder="What condition or symptom is this medication treating?"
                />
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label>Times of Day for Doses</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addDoseTime('otc', otc.id)}
                  className="text-safet-600 border-safet-200"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Add Time
                </Button>
              </div>
              
              <div className="space-y-2">
                {otc.doseTimes.map((doseTime, timeIndex) => (
                  <div key={doseTime.id} className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={doseTime.time}
                      onChange={(e) => updateDoseTime('otc', otc.id, doseTime.id, e.target.value)}
                      className="flex-1"
                    />
                    {otc.doseTimes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDoseTime('otc', otc.id, doseTime.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addOtcMedication}
          className="w-full text-safet-600 border-safet-200"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another OTC Medication
        </Button>
      </div>
      
      {/* Supplements Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium">Vitamins & Supplements</h3>
        
        {supplements.map((supp, index) => (
          <div key={supp.id} className="p-4 border border-gray-200 rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Supplement #{index + 1}</h4>
              {supplements.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeSupplement(supp.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`supp-name-${supp.id}`}>Supplement Name</Label>
                <Input
                  id={`supp-name-${supp.id}`}
                  value={supp.name}
                  onChange={(e) => updateSupplement(supp.id, 'name', e.target.value)}
                  placeholder="Enter supplement name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`supp-brand-${supp.id}`}>Brand Name</Label>
                <Input
                  id={`supp-brand-${supp.id}`}
                  value={supp.brandName}
                  onChange={(e) => updateSupplement(supp.id, 'brandName', e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`supp-dosage-${supp.id}`}>Total Dosage at Time</Label>
                <Input
                  id={`supp-dosage-${supp.id}`}
                  value={supp.totalDosage}
                  onChange={(e) => updateSupplement(supp.id, 'totalDosage', e.target.value)}
                  placeholder="e.g., 500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`supp-unit-${supp.id}`}>Unit of Measure</Label>
                <Select
                  value={supp.unit}
                  onValueChange={(value) => updateSupplement(supp.id, 'unit', value)}
                >
                  <SelectTrigger id={`supp-unit-${supp.id}`}>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg">mg (milligram)</SelectItem>
                    <SelectItem value="mcg">mcg (microgram)</SelectItem>
                    <SelectItem value="g">g (gram)</SelectItem>
                    <SelectItem value="IU">IU (International Unit)</SelectItem>
                    <SelectItem value="%">% (Daily Value)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {supp.unit === 'other' && (
                  <Input
                    className="mt-2"
                    placeholder="Specify unit"
                    value={supp.customForm}
                    onChange={(e) => updateSupplement(supp.id, 'customForm', e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`supp-pills-${supp.id}`}>Number of Pills/Measures at time</Label>
                <Input
                  id={`supp-pills-${supp.id}`}
                  value={supp.pillsPerDose}
                  onChange={(e) => updateSupplement(supp.id, 'pillsPerDose', e.target.value)}
                  placeholder="e.g., 1, 2, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`supp-dosage-per-pill-${supp.id}`}>Dosage Per Pill</Label>
                <Input
                  id={`supp-dosage-per-pill-${supp.id}`}
                  value={supp.dosagePerPill}
                  onChange={(e) => updateSupplement(supp.id, 'dosagePerPill', e.target.value)}
                  placeholder="e.g., 250mg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`supp-form-${supp.id}`}>Supplement Form</Label>
                <Select
                  value={supp.form}
                  onValueChange={(value) => updateSupplement(supp.id, 'form', value)}
                >
                  <SelectTrigger id={`supp-form-${supp.id}`}>
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="capsule">Capsule</SelectItem>
                    <SelectItem value="softgel">Softgel</SelectItem>
                    <SelectItem value="gummy">Gummy</SelectItem>
                    <SelectItem value="powder">Powder</SelectItem>
                    <SelectItem value="liquid">Liquid</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {supp.form === 'other' && (
                  <Input
                    className="mt-2"
                    placeholder="Specify form"
                    value={supp.customForm}
                    onChange={(e) => updateSupplement(supp.id, 'customForm', e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`supp-food-${supp.id}`}>With or Without Food</Label>
                <Select
                  value={supp.withFood}
                  onValueChange={(value) => updateSupplement(supp.id, 'withFood', value)}
                >
                  <SelectTrigger id={`supp-food-${supp.id}`}>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="with">With Food</SelectItem>
                    <SelectItem value="without">Without Food</SelectItem>
                    <SelectItem value="either">Either is Fine</SelectItem>
                    <SelectItem value="other">Other/Special Instructions</SelectItem>
                  </SelectContent>
                </Select>
                {supp.withFood === 'other' && (
                  <Textarea
                    className="mt-2"
                    placeholder="Specify special instructions"
                    value={supp.reason}
                    onChange={(e) => updateSupplement(supp.id, 'reason', e.target.value)}
                  />
                )}
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor={`supp-reason-${supp.id}`}>Reason for Taking</Label>
                <Textarea
                  id={`supp-reason-${supp.id}`}
                  value={supp.reason}
                  onChange={(e) => updateSupplement(supp.id, 'reason', e.target.value)}
                  placeholder="What health goal or deficiency is this supplement addressing?"
                />
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label>Times of Day for Doses</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addDoseTime('supplement', supp.id)}
                  className="text-safet-600 border-safet-200"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Add Time
                </Button>
              </div>
              
              <div className="space-y-2">
                {supp.doseTimes.map((doseTime, timeIndex) => (
                  <div key={doseTime.id} className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={doseTime.time}
                      onChange={(e) => updateDoseTime('supplement', supp.id, doseTime.id, e.target.value)}
                      className="flex-1"
                    />
                    {supp.doseTimes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDoseTime('supplement', supp.id, doseTime.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addSupplement}
          className="w-full text-safet-600 border-safet-200"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Supplement
        </Button>
      </div>
    </div>
  );
};

export default MedicalProfileMedicationsForm;
