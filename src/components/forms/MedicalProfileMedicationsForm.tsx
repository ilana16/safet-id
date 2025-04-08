
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Clock, Pill, Search, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { searchDrugsCom } from '@/utils/drugsComApi';

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
  type: 'prescription' | 'otc' | 'supplement';
  brandName: string;
  reason: string;
  doseTimes: DoseTime[];
  frequency: string;
  customFrequency: string;
  customDays: string;
  selectedDaysOfWeek?: string[];
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
  type: 'prescription',
  brandName: '',
  reason: '',
  doseTimes: [{ id: `time_${Date.now()}`, time: '' }],
  frequency: 'Once daily',
  customFrequency: '',
  customDays: '',
  selectedDaysOfWeek: []
};

const frequencyOptions = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every morning',
  'Every evening',
  'Every night at bedtime',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'Once a week',
  'Twice a week',
  'X days a week',
  'Once a month',
  'Every X days',
  'As needed',
  'Other'
];

const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

const MedicalProfileMedicationsForm = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [activeSearchMedicationId, setActiveSearchMedicationId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
    
    if (savedProfile && savedProfile.medications) {
      const allMeds: Medication[] = [];
      
      if (savedProfile.medications.prescriptions && savedProfile.medications.prescriptions.length > 0) {
        const prescriptions = savedProfile.medications.prescriptions.map((med: any) => ({
          ...med,
          type: 'prescription'
        }));
        allMeds.push(...prescriptions);
      }
      
      if (savedProfile.medications.otc && savedProfile.medications.otc.length > 0) {
        const otcMeds = savedProfile.medications.otc.map((med: any) => ({
          ...med,
          type: 'otc'
        }));
        allMeds.push(...otcMeds);
      }
      
      if (savedProfile.medications.supplements && savedProfile.medications.supplements.length > 0) {
        const supplements = savedProfile.medications.supplements.map((med: any) => ({
          ...med,
          type: 'supplement'
        }));
        allMeds.push(...supplements);
      }
      
      if (allMeds.length > 0) {
        setMedications(allMeds);
      }
    }
  }, []);

  const handleSearchMedication = async (query: string, medicationId: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setActiveSearchMedicationId(null);
      return;
    }

    setIsSearching(true);
    setActiveSearchMedicationId(medicationId);

    try {
      const results = await searchDrugsCom(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching medications:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectDrugSuggestion = (medicationId: string, drugName: string) => {
    updateMedication(medicationId, 'name', drugName);
    setSearchResults([]);
    setActiveSearchMedicationId(null);
  };

  const addMedication = () => {
    const newMed: Medication = {
      ...defaultMedication,
      id: `med_${Date.now()}`
    };
    setMedications([...medications, newMed]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const addDoseTime = (medId: string) => {
    const newDoseTime = { id: `time_${Date.now()}`, time: '' };
    
    setMedications(medications.map(med => 
      med.id === medId ? { ...med, doseTimes: [...med.doseTimes, newDoseTime] } : med
    ));
  };

  const removeDoseTime = (medId: string, timeId: string) => {
    setMedications(medications.map(med => {
      if (med.id === medId && med.doseTimes.length > 1) {
        return {
          ...med,
          doseTimes: med.doseTimes.filter(time => time.id !== timeId)
        };
      }
      return med;
    }));
  };

  const updateDoseTime = (medId: string, timeId: string, value: string) => {
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
  };

  const toggleDayOfWeek = (medId: string, day: string) => {
    setMedications(medications.map(med => {
      if (med.id === medId) {
        const selectedDays = med.selectedDaysOfWeek || [];
        if (selectedDays.includes(day)) {
          return {
            ...med,
            selectedDaysOfWeek: selectedDays.filter(d => d !== day)
          };
        } else {
          return {
            ...med,
            selectedDaysOfWeek: [...selectedDays, day]
          };
        }
      }
      return med;
    }));
  };

  const filteredMedications = medications.filter(med => {
    const matchesType = filterType === 'all' || med.type === filterType;
    const matchesSearch = searchQuery === '' || 
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      med.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const prepareFormData = () => {
    const prescriptions = medications.filter(med => med.type === 'prescription');
    const otc = medications.filter(med => med.type === 'otc');
    const supplements = medications.filter(med => med.type === 'supplement');
    
    return {
      prescriptions,
      otc,
      supplements
    };
  };

  React.useEffect(() => {
    (window as any).medicationsFormData = prepareFormData();
  }, [medications]);

  if (medications.length === 0) {
    return (
      <div className="text-center py-12">
        <Pill className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No medications added</h3>
        <p className="mt-2 text-sm text-gray-500">Get started by adding your first medication.</p>
        <Button
          onClick={() => {
            const newMed: Medication = {
              ...defaultMedication,
              id: `med_${Date.now()}`
            };
            setMedications([newMed]);
          }}
          className="mt-6"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3">
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your medications..." 
              className="pl-10 pr-4 py-2 w-full"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1.5 h-7 w-7 p-0" 
                onClick={() => setSearchQuery('')}
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Label htmlFor="filter-type" className="whitespace-nowrap">Filter by type:</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filter-type" className="w-full md:w-[180px]">
                <SelectValue placeholder="All medications" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All medications</SelectItem>
                <SelectItem value="prescription">Prescription only</SelectItem>
                <SelectItem value="otc">Over-the-counter only</SelectItem>
                <SelectItem value="supplement">Supplements only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {filteredMedications.length} medication{filteredMedications.length !== 1 ? 's' : ''} found
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addMedication}
            className="text-safet-600 border-safet-200"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMedications.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500">No medications found. Add a new medication to get started.</p>
          </Card>
        ) : (
          filteredMedications.map((med, index) => (
            <Card key={med.id} className="p-4 border border-gray-200 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Pill className="h-5 w-5 text-[#335B95]" />
                  <h3 className="font-medium text-lg">
                    {med.name || 'New Medication'}
                    {med.name && med.brandName && <span className="text-sm text-gray-500 ml-2">({med.brandName})</span>}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`
                    ${med.type === 'prescription' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                    ${med.type === 'otc' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                    ${med.type === 'supplement' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
                  `}>
                    {med.type === 'prescription' ? 'Prescription' : 
                     med.type === 'otc' ? 'Over-the-counter' : 
                     'Supplement'}
                  </Badge>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeMedication(med.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`med-name-${med.id}`}>Medication Name</Label>
                  <div className="relative">
                    <Input
                      id={`med-name-${med.id}`}
                      value={med.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateMedication(med.id, 'name', value);
                        handleSearchMedication(value, med.id);
                      }}
                      placeholder="Enter medication name"
                      autoComplete="off"
                    />
                    {isSearching && activeSearchMedicationId === med.id && (
                      <div className="absolute right-2 top-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}
                    
                    {searchResults.length > 0 && activeSearchMedicationId === med.id && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                        <ul>
                          {searchResults.map((result, idx) => (
                            <li 
                              key={idx}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                              onClick={() => selectDrugSuggestion(med.id, result)}
                            >
                              <Pill className="h-4 w-4 text-[#335B95] mr-2" />
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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
                  <Label htmlFor={`med-type-${med.id}`}>Medication Type</Label>
                  <Select 
                    value={med.type} 
                    onValueChange={(value: any) => updateMedication(med.id, 'type', value)}
                  >
                    <SelectTrigger id={`med-type-${med.id}`} className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="otc">Over-the-counter</SelectItem>
                      <SelectItem value="supplement">Vitamin/Supplement</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="drops">Drops</SelectItem>
                      <SelectItem value="spray">Spray</SelectItem>
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
                  <Label htmlFor={`med-dosage-${med.id}`}>Total Dosage</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`med-dosage-${med.id}`}
                      value={med.totalDosage}
                      onChange={(e) => updateMedication(med.id, 'totalDosage', e.target.value)}
                      placeholder="e.g., 500"
                      className="flex-1"
                    />
                    <Select
                      value={med.unit}
                      onValueChange={(value) => updateMedication(med.id, 'unit', value)}
                    >
                      <SelectTrigger id={`med-unit-${med.id}`} className="w-1/3">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mg">mg</SelectItem>
                        <SelectItem value="mcg">mcg</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="IU">IU</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  <Label htmlFor={`med-frequency-${med.id}`}>Frequency</Label>
                  <Select
                    value={med.frequency}
                    onValueChange={(value) => {
                      updateMedication(med.id, 'frequency', value);
                      if (value !== 'Other' && value !== 'Every X days' && value !== 'X days a week') {
                        updateMedication(med.id, 'customFrequency', '');
                        updateMedication(med.id, 'customDays', '');
                        setMedications(medications.map(m => 
                          m.id === med.id ? { ...m, selectedDaysOfWeek: [] } : m
                        ));
                      }
                    }}
                  >
                    <SelectTrigger id={`med-frequency-${med.id}`}>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {med.frequency === 'Every X days' && (
                    <div className="mt-2">
                      <Label htmlFor={`med-days-${med.id}`}>Number of days</Label>
                      <Input
                        id={`med-days-${med.id}`}
                        type="number"
                        min="1"
                        placeholder="Enter number of days"
                        value={med.customDays || ''}
                        onChange={(e) => updateMedication(med.id, 'customDays', e.target.value)}
                      />
                    </div>
                  )}
                  
                  {med.frequency === 'X days a week' && (
                    <div className="mt-2 space-y-2">
                      <Label>Select days of the week</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {daysOfWeek.map((day) => (
                          <div key={day.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`day-${med.id}-${day.id}`} 
                              checked={(med.selectedDaysOfWeek || []).includes(day.id)}
                              onCheckedChange={() => toggleDayOfWeek(med.id, day.id)}
                            />
                            <Label 
                              htmlFor={`day-${med.id}-${day.id}`} 
                              className="text-sm font-normal cursor-pointer"
                            >
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {med.frequency === 'Other' && (
                    <Input
                      className="mt-2"
                      placeholder="Specify custom frequency"
                      value={med.customFrequency || ''}
                      onChange={(e) => updateMedication(med.id, 'customFrequency', e.target.value)}
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
                    onClick={() => addDoseTime(med.id)}
                    className="text-safet-600 border-safet-200"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Add Time
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {med.doseTimes.map((doseTime) => (
                    <div key={doseTime.id} className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={doseTime.time}
                        onChange={(e) => updateDoseTime(med.id, doseTime.id, e.target.value)}
                        className="flex-1"
                      />
                      {med.doseTimes.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDoseTime(med.id, doseTime.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {filteredMedications.length > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={addMedication}
          className="w-full text-safet-600 border-safet-200"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Medication
        </Button>
      )}
    </div>
  );
};

export default MedicalProfileMedicationsForm;
