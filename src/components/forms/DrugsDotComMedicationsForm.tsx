
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Clock, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchDrugsCom } from '@/utils/drugsComApi';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

const DrugsDotComMedicationsForm = () => {
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

  // State for search suggestions
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('prescriptions');

  // Form tabs
  const tabs = [
    { id: 'prescriptions', label: 'Prescription Drugs' },
    { id: 'otc', label: 'Over-the-Counter' },
    { id: 'supplements', label: 'Vitamins & Supplements' }
  ];

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

  // Search for medication suggestions
  const handleSearch = async (name: string, type: 'prescription' | 'otc' | 'supplement', id: string) => {
    if (name.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    setSearchTerm(name);
    setShowSuggestions(true);

    try {
      const results = await searchDrugsCom(name);
      setSuggestions(results);
    } catch (error) {
      console.error('Error searching medications:', error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Handler for selecting a suggestion
  const selectSuggestion = (suggestion: string, type: 'prescription' | 'otc' | 'supplement', id: string) => {
    if (type === 'prescription') {
      updateMedication(id, 'name', suggestion);
    } else if (type === 'otc') {
      updateOtcMedication(id, 'name', suggestion);
    } else {
      updateSupplement(id, 'name', suggestion);
    }
    
    setShowSuggestions(false);
  };

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

  // Render medication item based on type
  const renderMedicationItem = (
    type: 'prescription' | 'otc' | 'supplement',
    item: Medication | OTCMedication | Supplement,
    index: number
  ) => {
    return (
      <div key={item.id} className="bg-white rounded-md border border-gray-200 p-6 mb-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {type === 'prescription' ? 'Prescription' : type === 'otc' ? 'OTC Medication' : 'Supplement'} #{index + 1}
          </h3>
          
          {/* Remove button */}
          {(
            (type === 'prescription' && medications.length > 1) || 
            (type === 'otc' && otcMedications.length > 1) || 
            (type === 'supplement' && supplements.length > 1)
          ) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => {
                if (type === 'prescription') removeMedication(item.id);
                else if (type === 'otc') removeOtcMedication(item.id);
                else removeSupplement(item.id);
              }}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Remove
            </Button>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Medication name with autocomplete */}
          <div className="space-y-2">
            <Label htmlFor={`${type}-name-${item.id}`} className="font-medium">
              {type === 'supplement' ? 'Supplement Name' : 'Medication Name'} <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id={`${type}-name-${item.id}`}
                value={item.name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (type === 'prescription') updateMedication(item.id, 'name', value);
                  else if (type === 'otc') updateOtcMedication(item.id, 'name', value);
                  else updateSupplement(item.id, 'name', value);
                  
                  handleSearch(value, type, item.id);
                }}
                placeholder={`Enter ${type === 'supplement' ? 'supplement' : 'medication'} name`}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                autoComplete="off"
              />
              
              {/* Suggestions dropdown */}
              {showSuggestions && item.name === searchTerm && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {loadingSuggestions ? (
                    <div className="p-2 text-gray-500">Loading suggestions...</div>
                  ) : (
                    suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => selectSuggestion(suggestion, type, item.id)}
                      >
                        {suggestion}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Two-column layout for form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Name */}
            <div className="space-y-2">
              <Label htmlFor={`${type}-brand-${item.id}`} className="font-medium">
                Brand/Manufacturer Name
              </Label>
              <Input
                id={`${type}-brand-${item.id}`}
                value={item.brandName}
                onChange={(e) => {
                  if (type === 'prescription') updateMedication(item.id, 'brandName', e.target.value);
                  else if (type === 'otc') updateOtcMedication(item.id, 'brandName', e.target.value);
                  else updateSupplement(item.id, 'brandName', e.target.value);
                }}
                placeholder="e.g., Pfizer, Johnson & Johnson"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* Medication Form */}
            <div className="space-y-2">
              <Label htmlFor={`${type}-form-${item.id}`} className="font-medium">
                Form
              </Label>
              <Select
                value={item.form}
                onValueChange={(value) => {
                  if (type === 'prescription') updateMedication(item.id, 'form', value);
                  else if (type === 'otc') updateOtcMedication(item.id, 'form', value);
                  else updateSupplement(item.id, 'form', value);
                }}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent>
                  {type === 'prescription' && (
                    <>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                      <SelectItem value="liquid">Liquid</SelectItem>
                      <SelectItem value="injection">Injection</SelectItem>
                      <SelectItem value="patch">Patch</SelectItem>
                      <SelectItem value="cream">Cream/Ointment</SelectItem>
                      <SelectItem value="inhaler">Inhaler</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  )}
                  
                  {type === 'otc' && (
                    <>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                      <SelectItem value="liquid">Liquid</SelectItem>
                      <SelectItem value="spray">Spray</SelectItem>
                      <SelectItem value="cream">Cream/Ointment</SelectItem>
                      <SelectItem value="drop">Drops</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  )}
                  
                  {type === 'supplement' && (
                    <>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                      <SelectItem value="softgel">Softgel</SelectItem>
                      <SelectItem value="gummy">Gummy</SelectItem>
                      <SelectItem value="powder">Powder</SelectItem>
                      <SelectItem value="liquid">Liquid</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              
              {item.form === 'other' && (
                <Input
                  className="mt-2"
                  placeholder="Specify form"
                  value={item.customForm}
                  onChange={(e) => {
                    if (type === 'prescription') updateMedication(item.id, 'customForm', e.target.value);
                    else if (type === 'otc') updateOtcMedication(item.id, 'customForm', e.target.value);
                    else updateSupplement(item.id, 'customForm', e.target.value);
                  }}
                />
              )}
            </div>
            
            {/* Strength per unit/pill */}
            <div className="space-y-2">
              <Label htmlFor={`${type}-strength-${item.id}`} className="font-medium flex items-center">
                Strength 
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                      <Info className="h-4 w-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm text-gray-600">
                      The amount of active ingredient in each pill/unit (e.g., 10mg per tablet)
                    </p>
                  </PopoverContent>
                </Popover>
              </Label>
              <div className="flex space-x-2">
                <Input
                  id={`${type}-dosage-per-pill-${item.id}`}
                  value={item.dosagePerPill}
                  onChange={(e) => {
                    if (type === 'prescription') updateMedication(item.id, 'dosagePerPill', e.target.value);
                    else if (type === 'otc') updateOtcMedication(item.id, 'dosagePerPill', e.target.value);
                    else updateSupplement(item.id, 'dosagePerPill', e.target.value);
                  }}
                  placeholder="e.g., 10"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Select
                  value={item.unit}
                  onValueChange={(value) => {
                    if (type === 'prescription') updateMedication(item.id, 'unit', value);
                    else if (type === 'otc') updateOtcMedication(item.id, 'unit', value);
                    else updateSupplement(item.id, 'unit', value);
                  }}
                >
                  <SelectTrigger className="border-gray-300 w-24">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="mcg">mcg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="%">%</SelectItem>
                    <SelectItem value="IU">IU</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Dose - pills per time */}
            <div className="space-y-2">
              <Label htmlFor={`${type}-pills-${item.id}`} className="font-medium flex items-center">
                Dose (units per time)
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                      <Info className="h-4 w-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm text-gray-600">
                      How many pills/units you take each time (e.g., 2 tablets)
                    </p>
                  </PopoverContent>
                </Popover>
              </Label>
              <Input
                id={`${type}-pills-${item.id}`}
                value={item.pillsPerDose}
                onChange={(e) => {
                  if (type === 'prescription') updateMedication(item.id, 'pillsPerDose', e.target.value);
                  else if (type === 'otc') updateOtcMedication(item.id, 'pillsPerDose', e.target.value);
                  else updateSupplement(item.id, 'pillsPerDose', e.target.value);
                }}
                placeholder="e.g., 1, 2, 0.5"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {/* With or without food */}
            <div className="space-y-2">
              <Label htmlFor={`${type}-food-${item.id}`} className="font-medium">
                With or Without Food
              </Label>
              <Select
                value={item.withFood}
                onValueChange={(value) => {
                  if (type === 'prescription') updateMedication(item.id, 'withFood', value);
                  else if (type === 'otc') updateOtcMedication(item.id, 'withFood', value);
                  else updateSupplement(item.id, 'withFood', value);
                }}
              >
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="with">With Food</SelectItem>
                  <SelectItem value="without">Without Food</SelectItem>
                  <SelectItem value="either">Either is Fine</SelectItem>
                  <SelectItem value="other">Other/Special Instructions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Prescription Type (only for prescription) */}
            {type === 'prescription' && (
              <div className="space-y-2">
                <Label htmlFor={`med-type-${item.id}`} className="font-medium">
                  Prescription Type
                </Label>
                <Select
                  value={(item as Medication).prescriptionType}
                  onValueChange={(value) => updateMedication(item.id, 'prescriptionType', value)}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prescription">Regular Prescription</SelectItem>
                    <SelectItem value="controlled">Controlled Substance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* Reason for taking (full width) */}
          <div className="space-y-2">
            <Label htmlFor={`${type}-reason-${item.id}`} className="font-medium">
              Reason for Taking
            </Label>
            <Textarea
              id={`${type}-reason-${item.id}`}
              value={item.reason}
              onChange={(e) => {
                if (type === 'prescription') updateMedication(item.id, 'reason', e.target.value);
                else if (type === 'otc') updateOtcMedication(item.id, 'reason', e.target.value);
                else updateSupplement(item.id, 'reason', e.target.value);
              }}
              placeholder={
                type === 'prescription' 
                  ? "What condition or symptom is this medication treating?" 
                  : type === 'otc' 
                    ? "What condition or symptom is this medication treating?"
                    : "What health goal or deficiency is this supplement addressing?"
              }
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          {/* Dose times */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium">Dosing Schedule</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addDoseTime(type, item.id)}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Clock className="mr-2 h-4 w-4" />
                Add Time
              </Button>
            </div>
            
            <div className="space-y-3">
              {item.doseTimes.map((doseTime) => (
                <div key={doseTime.id} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={doseTime.time}
                    onChange={(e) => updateDoseTime(type, item.id, doseTime.id, e.target.value)}
                    className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {item.doseTimes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDoseTime(type, item.id, doseTime.id)}
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
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs to switch between medication types */}
      <Tabs defaultValue="prescriptions" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          {tabs.map(tab => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {/* Prescription medications */}
        <TabsContent value="prescriptions" className="space-y-4">
          {medications.map((med, index) => renderMedicationItem('prescription', med, index))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addMedication}
            className="w-full mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Prescription Medication
          </Button>
        </TabsContent>
        
        {/* OTC medications */}
        <TabsContent value="otc" className="space-y-4">
          {otcMedications.map((otc, index) => renderMedicationItem('otc', otc, index))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addOtcMedication}
            className="w-full mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another OTC Medication
          </Button>
        </TabsContent>
        
        {/* Supplements */}
        <TabsContent value="supplements" className="space-y-4">
          {supplements.map((supp, index) => renderMedicationItem('supplement', supp, index))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addSupplement}
            className="w-full mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another Supplement
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DrugsDotComMedicationsForm;
