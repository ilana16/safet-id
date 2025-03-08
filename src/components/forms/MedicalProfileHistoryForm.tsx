import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Trash2, CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MedicalProfileHistoryFormProps {
  onMentalHealthHistoryChange?: (value: string) => void;
}

const MedicalProfileHistoryForm = ({ onMentalHealthHistoryChange }: MedicalProfileHistoryFormProps) => {
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [surgeries, setSurgeries] = useState<Array<{procedure: string, year: string, hospital?: string}>>([]);
  const [hospitalization, setHospitalization] = useState<Array<{reason: string, year: string, duration?: string}>>([]);
  const [familyHistory, setFamilyHistory] = useState('');
  
  const [childbirthHistory, setChildbirthHistory] = useState<Array<{year: string, deliveryType: string, complications: string}>>([]);
  
  // Changed from array to string for yes/no selection
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState<string>('no');
  
  const [physicalDisabilities, setPhysicalDisabilities] = useState('');
  const [previousDiagnoses, setPreviousDiagnoses] = useState<Array<{condition: string, year: string, status: string}>>([]);
  const [bloodType, setBloodType] = useState('');
  const [lastPhysicalDate, setLastPhysicalDate] = useState<Date | undefined>(undefined);
  
  const [otherMentalHealthCondition, setOtherMentalHealthCondition] = useState('');
  const [otherMentalHealthConditions, setOtherMentalHealthConditions] = useState<string[]>([]);

  // Check localStorage for saved values on component mount
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
    if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
      const savedValue = savedProfile.history.hasMentalHealthHistory;
      setHasMentalHealthHistory(savedValue);
      
      // Notify parent component of the loaded value
      if (onMentalHealthHistoryChange) {
        onMentalHealthHistoryChange(savedValue);
      }
    }
  }, [onMentalHealthHistoryChange]);

  // Handle changes to the mental health history selection
  const handleMentalHealthHistoryChange = (value: string) => {
    setHasMentalHealthHistory(value);
    
    // Notify parent component of the change
    if (onMentalHealthHistoryChange) {
      onMentalHealthHistoryChange(value);
    }
  };

  const commonConditions = [
    "Hypertension (High Blood Pressure)",
    "Diabetes",
    "Asthma",
    "Heart Disease",
    "Stroke",
    "Cancer",
    "Arthritis",
    "Depression/Anxiety",
    "Thyroid Disorder",
    "COPD",
    "Kidney Disease",
    "Liver Disease",
  ];

  const mentalHealthConditions = [
    "Depression",
    "Anxiety",
    "Bipolar Disorder",
    "ADHD/ADD",
    "OCD",
    "PTSD",
    "Schizophrenia",
    "Eating Disorder",
    "Substance Use Disorder",
    "Autism Spectrum Disorder"
  ];

  const bloodTypeOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown", "Other"];

  const deliveryTypeOptions = ["Vaginal", "C-Section", "VBAC", "Other"];

  const conditionStatusOptions = ["Active", "Managed", "Resolved", "In Remission", "Other"];

  const handleAddCondition = () => {
    if (newCondition.trim() !== '') {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleAddSurgery = () => {
    setSurgeries([...surgeries, { procedure: '', year: '', hospital: '' }]);
  };

  const handleUpdateSurgery = (index: number, field: keyof (typeof surgeries)[0], value: string) => {
    const updatedSurgeries = [...surgeries];
    updatedSurgeries[index][field] = value;
    setSurgeries(updatedSurgeries);
  };

  const handleRemoveSurgery = (index: number) => {
    setSurgeries(surgeries.filter((_, i) => i !== index));
  };

  const handleAddHospitalization = () => {
    setHospitalization([...hospitalization, { reason: '', year: '', duration: '' }]);
  };

  const handleUpdateHospitalization = (index: number, field: keyof (typeof hospitalization)[0], value: string) => {
    const updatedHospitalizations = [...hospitalization];
    updatedHospitalizations[index][field] = value;
    setHospitalization(updatedHospitalizations);
  };

  const handleRemoveHospitalization = (index: number) => {
    setHospitalization(hospitalization.filter((_, i) => i !== index));
  };

  const toggleCondition = (condition: string) => {
    if (conditions.includes(condition)) {
      setConditions(conditions.filter(c => c !== condition));
    } else {
      setConditions([...conditions, condition]);
    }
  };

  const handleAddChildbirth = () => {
    setChildbirthHistory([...childbirthHistory, { year: '', deliveryType: '', complications: '' }]);
  };

  const handleUpdateChildbirth = (index: number, field: keyof (typeof childbirthHistory)[0], value: string) => {
    const updatedChildbirthHistory = [...childbirthHistory];
    updatedChildbirthHistory[index][field] = value;
    setChildbirthHistory(updatedChildbirthHistory);
  };

  const handleRemoveChildbirth = (index: number) => {
    setChildbirthHistory(childbirthHistory.filter((_, i) => i !== index));
  };

  const handleAddDiagnosis = () => {
    setPreviousDiagnoses([...previousDiagnoses, { condition: '', year: '', status: '' }]);
  };

  const handleUpdateDiagnosis = (index: number, field: keyof (typeof previousDiagnoses)[0], value: string) => {
    const updatedDiagnoses = [...previousDiagnoses];
    updatedDiagnoses[index][field] = value;
    setPreviousDiagnoses(updatedDiagnoses);
  };

  const handleRemoveDiagnosis = (index: number) => {
    setPreviousDiagnoses(previousDiagnoses.filter((_, i) => i !== index));
  };

  const handleAddOtherMentalHealthCondition = () => {
    if (otherMentalHealthCondition.trim() !== '') {
      setOtherMentalHealthConditions([...otherMentalHealthConditions, otherMentalHealthCondition.trim()]);
      setOtherMentalHealthCondition('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Medical Conditions</h3>
        <p className="text-sm text-gray-600 mb-4">Select any conditions that apply:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-4">
          {commonConditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox 
                id={`condition-${condition}`} 
                checked={conditions.includes(condition)}
                onCheckedChange={() => toggleCondition(condition)}
              />
              <Label 
                htmlFor={`condition-${condition}`} 
                className="text-sm cursor-pointer"
              >
                {condition}
              </Label>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Label htmlFor="other-condition" className="text-sm">Other condition not listed:</Label>
          <div className="flex gap-2 mt-1">
            <Input 
              id="other-condition" 
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Enter other condition"
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={handleAddCondition}
              disabled={!newCondition.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          {conditions.filter(c => !commonConditions.includes(c)).length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-gray-700">Added conditions:</p>
              <ul className="text-sm pl-5 list-disc space-y-1">
                {conditions.filter(c => !commonConditions.includes(c)).map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Previous Diagnoses</h3>
        <p className="text-sm text-gray-600 mb-4">List any significant past diagnoses and their current status.</p>
        
        {previousDiagnoses.length === 0 ? (
          <p className="text-sm text-gray-600 mb-2">No diagnoses added yet.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {previousDiagnoses.map((diagnosis, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`diagnosis-${index}`}>Condition</Label>
                    <Input
                      id={`diagnosis-${index}`}
                      value={diagnosis.condition}
                      onChange={(e) => handleUpdateDiagnosis(index, 'condition', e.target.value)}
                      placeholder="Medical condition"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`diagnosis-year-${index}`}>Year Diagnosed</Label>
                    <Input
                      id={`diagnosis-year-${index}`}
                      value={diagnosis.year}
                      onChange={(e) => handleUpdateDiagnosis(index, 'year', e.target.value)}
                      placeholder="Year (e.g., 2020)"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`diagnosis-status-${index}`}>Current Status</Label>
                    <Select
                      value={diagnosis.status}
                      onValueChange={(value) => handleUpdateDiagnosis(index, 'status', value)}
                    >
                      <SelectTrigger id={`diagnosis-status-${index}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionStatusOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddDiagnosis}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Diagnosis
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Surgical History</h3>
        
        {surgeries.length === 0 ? (
          <p className="text-sm text-gray-600 mb-2">No surgeries added yet.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {surgeries.map((surgery, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`surgery-${index}`}>Procedure</Label>
                    <Input
                      id={`surgery-${index}`}
                      value={surgery.procedure}
                      onChange={(e) => handleUpdateSurgery(index, 'procedure', e.target.value)}
                      placeholder="Procedure name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`surgery-year-${index}`}>Year</Label>
                    <Input
                      id={`surgery-year-${index}`}
                      value={surgery.year}
                      onChange={(e) => handleUpdateSurgery(index, 'year', e.target.value)}
                      placeholder="Year (e.g., 2020)"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`surgery-hospital-${index}`}>Hospital</Label>
                    <Input
                      id={`surgery-hospital-${index}`}
                      value={surgery.hospital}
                      onChange={(e) => handleUpdateSurgery(index, 'hospital', e.target.value)}
                      placeholder="Hospital name (optional)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddSurgery}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Surgery
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Hospitalization History</h3>
        
        {hospitalization.length === 0 ? (
          <p className="text-sm text-gray-600 mb-2">No hospitalizations added yet.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {hospitalization.map((hospital, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50 relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`hospital-${index}`}>Reason</Label>
                    <Input
                      id={`hospital-${index}`}
                      value={hospital.reason}
                      onChange={(e) => handleUpdateHospitalization(index, 'reason', e.target.value)}
                      placeholder="Reason for hospitalization"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`hospital-year-${index}`}>Year</Label>
                    <Input
                      id={`hospital-year-${index}`}
                      value={hospital.year}
                      onChange={(e) => handleUpdateHospitalization(index, 'year', e.target.value)}
                      placeholder="Year (e.g., 2020)"
                      type="number" 
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`hospital-duration-${index}`}>Duration</Label>
                    <Input
                      id={`hospital-duration-${index}`}
                      value={hospital.duration}
                      onChange={(e) => handleUpdateHospitalization(index, 'duration', e.target.value)}
                      placeholder="Length of stay (e.g., 3 days)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddHospitalization}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Hospitalization
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Childbirth History</h3>
        <p className="text-sm text-gray-600 mb-4">If applicable, provide information about any pregnancies and childbirths.</p>
        
        {childbirthHistory.length === 0 ? (
          <div className="flex mb-4 space-x-2 items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddChildbirth}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Childbirth
            </Button>
            <span className="text-sm text-gray-500">(Skip if not applicable)</span>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {childbirthHistory.map((birth, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50 relative">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor={`birth-year-${index}`}>Year</Label>
                      <Input
                        id={`birth-year-${index}`}
                        value={birth.year}
                        onChange={(e) => handleUpdateChildbirth(index, 'year', e.target.value)}
                        placeholder="Year (e.g., 2020)"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`birth-type-${index}`}>Delivery Type</Label>
                      <Select
                        value={birth.deliveryType}
                        onValueChange={(value) => handleUpdateChildbirth(index, 'deliveryType', value)}
                      >
                        <SelectTrigger id={`birth-type-${index}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryTypeOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`birth-complications-${index}`}>Complications</Label>
                      <Input
                        id={`birth-complications-${index}`}
                        value={birth.complications}
                        onChange={(e) => handleUpdateChildbirth(index, 'complications', e.target.value)}
                        placeholder="Any complications (or 'None')"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddChildbirth}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Another
            </Button>
          </>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Mental Health History</h3>
        <p className="text-sm text-gray-600 mb-4">Do you have a history of mental illness?</p>
        
        <RadioGroup 
          value={hasMentalHealthHistory} 
          onValueChange={handleMentalHealthHistoryChange}
          className="flex space-x-4 mb-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="r-yes" />
            <Label htmlFor="r-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="r-no" />
            <Label htmlFor="r-no">No</Label>
          </div>
        </RadioGroup>
        
        {hasMentalHealthHistory === 'yes' && (
          <div className="mt-4">
            <Label htmlFor="other-mental-condition" className="text-sm">Other condition not listed:</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                id="other-mental-condition" 
                value={otherMentalHealthCondition}
                onChange={(e) => setOtherMentalHealthCondition(e.target.value)}
                placeholder="Enter mental health condition"
                className="flex-grow"
              />
              <Button 
                type="button" 
                onClick={handleAddOtherMentalHealthCondition}
                disabled={!otherMentalHealthCondition.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            {otherMentalHealthConditions.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-sm font-medium text-gray-700">Added conditions:</p>
                <ul className="text-sm pl-5 list-disc space-y-1">
                  {otherMentalHealthConditions.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Blood Type</h3>
        <div className="w-full md:w-1/3">
          <Select
            value={bloodType}
            onValueChange={setBloodType}
          >
            <SelectTrigger id="blood-type">
              <SelectValue placeholder="Select your blood type" />
            </SelectTrigger>
            <SelectContent>
              {bloodTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Last Physical Examination</h3>
        <div className="w-full md:w-1/3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !lastPhysicalDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {lastPhysicalDate ? format(lastPhysicalDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={lastPhysicalDate}
                onSelect={setLastPhysicalDate}
                initialFocus
                disabled={(date) => date > new Date()}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Physical Disabilities or Limitations</h3>
        <p className="text-sm text-gray-600 mb-2">Please describe any physical disabilities or limitations.</p>
        <Textarea
          placeholder="Enter any physical disabilities or limitations that may be relevant to your care"
          value={physicalDisabilities}
          onChange={(e) => setPhysicalDisabilities(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Family Medical History</h3>
        <p className="text-sm text-gray-600 mb-2">
          Please provide information about significant medical conditions in your immediate family (parents, siblings, children).
        </p>
        <Textarea 
          id="familyHistory"
          value={familyHistory}
          onChange={(e) => setFamilyHistory(e.target.value)}
          placeholder="e.g., Mother: Diabetes, Father: Heart Disease" 
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default MedicalProfileHistoryForm;
