
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';

const MedicalProfileSocialHistoryForm = () => {
  const [hasOccupationalHistory, setHasOccupationalHistory] = useState(false);
  const [occupationalHistory, setOccupationalHistory] = useState<Array<{
    id: number;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    exposureRisks: string;
  }>>([]);

  const [smokingStatus, setSmokingStatus] = useState('never');
  const [alcoholStatus, setAlcoholStatus] = useState('none');
  const [substanceStatus, setSubstanceStatus] = useState('none');

  // Handlers for occupational history
  const addOccupation = () => {
    const newId = occupationalHistory.length > 0 
      ? Math.max(...occupationalHistory.map(job => job.id)) + 1 
      : 1;
    setOccupationalHistory([...occupationalHistory, { 
      id: newId, 
      jobTitle: '', 
      company: '', 
      startDate: '', 
      endDate: '', 
      exposureRisks: '' 
    }]);
  };

  const removeOccupation = (id: number) => {
    setOccupationalHistory(occupationalHistory.filter(job => job.id !== id));
  };

  const updateOccupation = (id: number, field: keyof (typeof occupationalHistory)[0], value: string) => {
    setOccupationalHistory(occupationalHistory.map(job => 
      job.id === id ? { ...job, [field]: value } : job
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Occupation Information</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentOccupation">Current Occupation</Label>
            <Input id="currentOccupation" placeholder="e.g., Software Engineer, Teacher, Nurse" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currentWorkplace">Current Workplace</Label>
            <Input id="currentWorkplace" placeholder="Company or organization name" />
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox 
              id="hasOccupationalHistory" 
              checked={hasOccupationalHistory}
              onCheckedChange={(checked) => setHasOccupationalHistory(checked as boolean)} 
            />
            <Label htmlFor="hasOccupationalHistory" className="text-sm font-medium cursor-pointer">
              I want to add previous employment history
            </Label>
          </div>
          
          {hasOccupationalHistory && (
            <div className="border-l-2 border-safet-100 pl-4 ml-1 mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium">Previous Occupations</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-safet-600 border-safet-200"
                  onClick={addOccupation}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Previous Job
                </Button>
              </div>
              
              {occupationalHistory.map((job) => (
                <div key={job.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOccupation(job.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                    <div className="space-y-2">
                      <Label htmlFor={`jobTitle-${job.id}`}>Job Title</Label>
                      <Input
                        id={`jobTitle-${job.id}`}
                        value={job.jobTitle}
                        onChange={(e) => updateOccupation(job.id, 'jobTitle', e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`company-${job.id}`}>Company/Organization</Label>
                      <Input
                        id={`company-${job.id}`}
                        value={job.company}
                        onChange={(e) => updateOccupation(job.id, 'company', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`startDate-${job.id}`}>Start Date</Label>
                      <Input
                        id={`startDate-${job.id}`}
                        type="date"
                        value={job.startDate}
                        onChange={(e) => updateOccupation(job.id, 'startDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`endDate-${job.id}`}>End Date</Label>
                      <Input
                        id={`endDate-${job.id}`}
                        type="date"
                        value={job.endDate}
                        onChange={(e) => updateOccupation(job.id, 'endDate', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`exposureRisks-${job.id}`}>Occupational Exposure Risks (if any)</Label>
                      <Textarea
                        id={`exposureRisks-${job.id}`}
                        value={job.exposureRisks}
                        onChange={(e) => updateOccupation(job.id, 'exposureRisks', e.target.value)}
                        placeholder="e.g., chemicals, radiation, loud noise, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Lifestyle & Habits</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="physicalActivity">Physical Activity Level</Label>
            <Select onValueChange={(value) => console.log(value)}>
              <SelectTrigger id="physicalActivity">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                <SelectItem value="very-active">Very Active (hard exercise & physical job or training twice a day)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dietType">Diet Description</Label>
            <Textarea id="dietType" placeholder="Describe your typical diet, any dietary restrictions or preferences" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sleepPatterns">Sleep Patterns</Label>
            <Textarea id="sleepPatterns" placeholder="Describe your typical sleep schedule and any sleep issues" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Substance Use History</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="smokingStatus">Tobacco Use</Label>
            <Select value={smokingStatus} onValueChange={setSmokingStatus}>
              <SelectTrigger id="smokingStatus">
                <SelectValue placeholder="Select smoking status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never smoked</SelectItem>
                <SelectItem value="former">Former smoker</SelectItem>
                <SelectItem value="current">Current smoker</SelectItem>
                <SelectItem value="e-cigarette">E-cigarette/Vaping user</SelectItem>
                <SelectItem value="other-tobacco">Other tobacco product user</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {smokingStatus !== 'never' && (
            <div className="border-l-2 border-safet-100 pl-4 ml-1 space-y-4">
              {smokingStatus === 'former' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="quitDate">Quit Date</Label>
                      <Input id="quitDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smokingYears">Years of Use</Label>
                      <Input id="smokingYears" type="number" min="0" />
                    </div>
                  </div>
                </>
              )}
              
              {(smokingStatus === 'current' || smokingStatus === 'e-cigarette' || smokingStatus === 'other-tobacco') && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="tobaccoType">Type of Tobacco/Product</Label>
                      <Input id="tobaccoType" placeholder="e.g., Cigarettes, Pipe, Vape, Chewing tobacco" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amountPerDay">Amount Per Day</Label>
                      <Input id="amountPerDay" placeholder="e.g., 1 pack, 10 cigarettes" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date/Year</Label>
                      <Input id="startDate" type="month" />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="quitAttempts">Quit Attempts</Label>
                <Textarea id="quitAttempts" placeholder="Describe any past quit attempts and methods used" />
              </div>
            </div>
          )}
          
          <div className="space-y-2 mt-6">
            <Label htmlFor="alcoholStatus">Alcohol Consumption</Label>
            <Select value={alcoholStatus} onValueChange={setAlcoholStatus}>
              <SelectTrigger id="alcoholStatus">
                <SelectValue placeholder="Select alcohol use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="occasional">Occasional (less than weekly)</SelectItem>
                <SelectItem value="moderate">Moderate (1-2 drinks a few times a week)</SelectItem>
                <SelectItem value="regular">Regular (daily or almost daily)</SelectItem>
                <SelectItem value="heavy">Heavy use</SelectItem>
                <SelectItem value="former">Former use (in recovery)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {alcoholStatus !== 'none' && (
            <div className="border-l-2 border-safet-100 pl-4 ml-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alcoholDetails">Alcohol Use Details</Label>
                <Textarea 
                  id="alcoholDetails" 
                  placeholder={alcoholStatus === 'former' 
                    ? "Describe your previous alcohol use and when you stopped" 
                    : "Describe your typical alcohol consumption (type, frequency, amount)"
                  } 
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2 mt-6">
            <Label htmlFor="substanceStatus">Recreational Drug Use</Label>
            <Select value={substanceStatus} onValueChange={setSubstanceStatus}>
              <SelectTrigger id="substanceStatus">
                <SelectValue placeholder="Select substance use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="current">Current use</SelectItem>
                <SelectItem value="former">Former use</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(substanceStatus === 'current' || substanceStatus === 'former') && (
            <div className="border-l-2 border-safet-100 pl-4 ml-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="substanceDetails">Substance Use Details</Label>
                <Textarea 
                  id="substanceDetails" 
                  placeholder="Describe substances used, frequency, and duration. This information is confidential and helps ensure your safety during medical treatment." 
                />
              </div>
              
              {substanceStatus === 'former' && (
                <div className="space-y-2">
                  <Label htmlFor="recoveryDetails">Recovery Information</Label>
                  <Textarea 
                    id="recoveryDetails" 
                    placeholder="Describe when you stopped and any treatment programs or support groups" 
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Environmental Exposures</h3>
        <div className="space-y-2">
          <Label htmlFor="environmentalExposures">Environmental Exposures</Label>
          <Textarea 
            id="environmentalExposures" 
            placeholder="Describe any significant environmental exposures (e.g., asbestos, lead, chemicals, radiation, etc.)" 
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Sexual History</h3>
        <p className="text-sm text-gray-600 mb-4">This information is confidential and helps provide appropriate preventive care recommendations.</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sexuallyActive">Are you currently sexually active?</Label>
            <Select>
              <SelectTrigger id="sexuallyActive">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contraceptionMethod">Contraception Method (if applicable)</Label>
            <Input id="contraceptionMethod" placeholder="e.g., Condoms, Birth control pills, IUD" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stiHistory">History of STIs (if any)</Label>
            <Textarea id="stiHistory" placeholder="List any past sexually transmitted infections and treatments" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalProfileSocialHistoryForm;
