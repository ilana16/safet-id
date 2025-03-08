
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const MedicalProfileMentalHealthForm = () => {
  const [hasMentalHealthConditions, setHasMentalHealthConditions] = useState(false);
  const [hasTreatmentHistory, setHasTreatmentHistory] = useState(false);
  const [treatments, setTreatments] = useState<Array<{
    id: number;
    type: string;
    provider: string;
    startDate: string;
    endDate: string;
    outcome: string;
  }>>([]);

  // Handlers for treatment history
  const addTreatment = () => {
    const newId = treatments.length > 0 
      ? Math.max(...treatments.map(t => t.id)) + 1 
      : 1;
    setTreatments([...treatments, { 
      id: newId, 
      type: '', 
      provider: '', 
      startDate: '', 
      endDate: '', 
      outcome: '' 
    }]);
  };

  const removeTreatment = (id: number) => {
    setTreatments(treatments.filter(t => t.id !== id));
  };

  const updateTreatment = (id: number, field: keyof (typeof treatments)[0], value: string) => {
    setTreatments(treatments.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Mental Health Overview</h3>
        <p className="text-sm text-gray-600 mb-4">
          This information helps your healthcare providers understand your mental health history and provide appropriate care.
          All information is confidential.
        </p>
        
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="hasMentalHealthConditions" 
            checked={hasMentalHealthConditions}
            onCheckedChange={(checked) => setHasMentalHealthConditions(checked as boolean)} 
          />
          <Label htmlFor="hasMentalHealthConditions" className="text-sm font-medium cursor-pointer">
            I have been diagnosed with a mental health condition
          </Label>
        </div>
        
        {hasMentalHealthConditions && (
          <div className="border-l-2 border-safet-100 pl-4 ml-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mentalHealthDiagnoses">Mental Health Diagnoses</Label>
              <Textarea 
                id="mentalHealthDiagnoses" 
                placeholder="List any diagnosed mental health conditions (e.g., depression, anxiety, bipolar disorder, PTSD, ADHD)"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstDiagnosisDate">First Diagnosis Date (approximate)</Label>
                <Input id="firstDiagnosisDate" type="month" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentStatus">Current Status</Label>
                <Select>
                  <SelectTrigger id="currentStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active - Currently experiencing symptoms</SelectItem>
                    <SelectItem value="managed">Managed - With treatment</SelectItem>
                    <SelectItem value="remission">In remission</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Current Symptoms & Concerns</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentSymptoms">Current Mental Health Symptoms or Concerns</Label>
            <Textarea 
              id="currentSymptoms" 
              placeholder="Describe any current mental health symptoms or concerns you may be experiencing"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="symptomTriggers">Known Triggers</Label>
            <Textarea 
              id="symptomTriggers" 
              placeholder="Describe any situations, circumstances, or events that tend to trigger or worsen symptoms"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stressLevel">Current Stress Level</Label>
            <Select>
              <SelectTrigger id="stressLevel">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minimal stress</SelectItem>
                <SelectItem value="moderate">Moderate - Manageable stress</SelectItem>
                <SelectItem value="high">High - Significant stress</SelectItem>
                <SelectItem value="severe">Severe - Overwhelming stress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sleepQuality">Sleep Quality</Label>
            <Select>
              <SelectTrigger id="sleepQuality">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="good">Good - No significant issues</SelectItem>
                <SelectItem value="fair">Fair - Occasional issues</SelectItem>
                <SelectItem value="poor">Poor - Regular disruptions</SelectItem>
                <SelectItem value="very-poor">Very Poor - Severe insomnia or other sleep problems</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="hasTreatmentHistory" 
            checked={hasTreatmentHistory}
            onCheckedChange={(checked) => setHasTreatmentHistory(checked as boolean)} 
          />
          <Label htmlFor="hasTreatmentHistory" className="text-sm font-medium cursor-pointer">
            I have received mental health treatment
          </Label>
        </div>
        
        {hasTreatmentHistory && (
          <div className="border-l-2 border-safet-100 pl-4 ml-1 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Treatment History</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-safet-600 border-safet-200"
                onClick={addTreatment}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Treatment
              </Button>
            </div>
            
            {treatments.map((treatment) => (
              <div key={treatment.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTreatment(treatment.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                  <div className="space-y-2">
                    <Label htmlFor={`type-${treatment.id}`}>Type of Treatment</Label>
                    <Select 
                      value={treatment.type}
                      onValueChange={(value) => updateTreatment(treatment.id, 'type', value)}
                    >
                      <SelectTrigger id={`type-${treatment.id}`}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="therapy">Therapy/Counseling</SelectItem>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="inpatient">Inpatient Treatment</SelectItem>
                        <SelectItem value="outpatient">Intensive Outpatient Program</SelectItem>
                        <SelectItem value="support">Support Group</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`provider-${treatment.id}`}>Provider/Facility</Label>
                    <Input
                      id={`provider-${treatment.id}`}
                      value={treatment.provider}
                      onChange={(e) => updateTreatment(treatment.id, 'provider', e.target.value)}
                      placeholder="Name of provider or facility"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${treatment.id}`}>Start Date</Label>
                    <Input
                      id={`startDate-${treatment.id}`}
                      type="month"
                      value={treatment.startDate}
                      onChange={(e) => updateTreatment(treatment.id, 'startDate', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${treatment.id}`}>End Date</Label>
                    <Input
                      id={`endDate-${treatment.id}`}
                      type="month"
                      value={treatment.endDate}
                      onChange={(e) => updateTreatment(treatment.id, 'endDate', e.target.value)}
                      placeholder="Leave blank if ongoing"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor={`outcome-${treatment.id}`}>Outcome/Experience</Label>
                    <Textarea
                      id={`outcome-${treatment.id}`}
                      value={treatment.outcome}
                      onChange={(e) => updateTreatment(treatment.id, 'outcome', e.target.value)}
                      placeholder="Describe the effectiveness or your experience with this treatment"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="space-y-2">
              <Label htmlFor="currentMedications">Current Psychiatric Medications</Label>
              <Textarea 
                id="currentMedications" 
                placeholder="List any current psychiatric medications, including dosage and frequency (or note 'None')"
              />
            </div>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Trauma History</h3>
        <p className="text-sm text-gray-600 mb-2">
          This information is completely confidential and helps your providers be sensitive to your needs.
          You can choose to skip this section if you prefer not to share at this time.
        </p>
        
        <div className="space-y-2">
          <Label htmlFor="traumaHistory">Trauma History</Label>
          <Textarea 
            id="traumaHistory" 
            placeholder="If comfortable, briefly describe any significant trauma you have experienced that may affect your health"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Coping & Support</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="copingStrategies">Coping Strategies</Label>
            <Textarea 
              id="copingStrategies" 
              placeholder="Describe strategies or activities that help you cope with stress or difficult emotions"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supportSystems">Support Systems</Label>
            <Textarea 
              id="supportSystems" 
              placeholder="Describe your current support system (e.g., family, friends, community groups, religious/spiritual supports)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="socialSupport">Social Support Level</Label>
            <Select>
              <SelectTrigger id="socialSupport">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strong">Strong - Extensive reliable support</SelectItem>
                <SelectItem value="adequate">Adequate - Some reliable support</SelectItem>
                <SelectItem value="limited">Limited - Minimal reliable support</SelectItem>
                <SelectItem value="none">None - No reliable support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Additional Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="additionalMentalHealth">Other Mental Health Information</Label>
          <Textarea 
            id="additionalMentalHealth" 
            placeholder="Any additional information about your mental health you would like your healthcare providers to know"
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalProfileMentalHealthForm;
