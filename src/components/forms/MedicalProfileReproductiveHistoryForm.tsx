
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const MedicalProfileReproductiveHistoryForm = () => {
  const [isFemale, setIsFemale] = useState(true);
  const [pregnancies, setPregnancies] = useState<Array<{
    id: number;
    year: string;
    outcome: string;
    complications: string;
    weeks: string;
  }>>([]);

  // Handler for adding pregnancies
  const addPregnancy = () => {
    const newId = pregnancies.length > 0 
      ? Math.max(...pregnancies.map(p => p.id)) + 1 
      : 1;
    setPregnancies([...pregnancies, { 
      id: newId, 
      year: '', 
      outcome: '', 
      complications: '', 
      weeks: '' 
    }]);
  };

  const removePregnancy = (id: number) => {
    setPregnancies(pregnancies.filter(p => p.id !== id));
  };

  const updatePregnancy = (id: number, field: keyof (typeof pregnancies)[0], value: string) => {
    setPregnancies(pregnancies.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Reproductive History Section</h3>
        <p className="text-sm text-gray-600 mb-4">This information helps provide appropriate reproductive healthcare recommendations.</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="biologicalSex">Biological Sex</Label>
            <RadioGroup id="biologicalSex" defaultValue="female" className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" onClick={() => setIsFemale(true)} />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" onClick={() => setIsFemale(false)} />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intersex" id="intersex" />
                <Label htmlFor="intersex">Intersex</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
      
      {isFemale && (
        <>
          <div>
            <h3 className="text-lg font-medium mb-4">Menstrual History</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="menarcheAge">Age at First Menstruation</Label>
                <Input id="menarcheAge" type="number" min="8" max="20" placeholder="Age" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
                <Input id="cycleLength" type="number" min="20" max="45" placeholder="Days" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="periodLength">Average Period Duration (days)</Label>
                <Input id="periodLength" type="number" min="1" max="10" placeholder="Days" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="periodFlow">Flow Description</Label>
                <Select>
                  <SelectTrigger id="periodFlow">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                    <SelectItem value="variable">Variable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastPeriod">Date of Last Menstrual Period</Label>
                <Input id="lastPeriod" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="menstrualRegularity">Regularity</Label>
                <Select>
                  <SelectTrigger id="menstrualRegularity">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="somewhat-regular">Somewhat Regular</SelectItem>
                    <SelectItem value="irregular">Irregular</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label htmlFor="menstrualSymptoms">Menstrual Symptoms</Label>
              <Textarea 
                id="menstrualSymptoms" 
                placeholder="Describe any symptoms you experience before or during your period (e.g., cramps, bloating, headaches, mood changes)"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Pregnancy History</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalPregnancies">Total Number of Pregnancies</Label>
                <Input id="totalPregnancies" type="number" min="0" placeholder="Number" />
              </div>
              
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium">Pregnancy Details</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-safet-600 border-safet-200"
                  onClick={addPregnancy}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Pregnancy
                </Button>
              </div>
              
              {pregnancies.map((pregnancy) => (
                <div key={pregnancy.id} className="p-3 border border-gray-200 rounded-md bg-gray-50 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePregnancy(pregnancy.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                    <div className="space-y-2">
                      <Label htmlFor={`year-${pregnancy.id}`}>Year</Label>
                      <Input
                        id={`year-${pregnancy.id}`}
                        type="number"
                        min="1970"
                        max={new Date().getFullYear()}
                        value={pregnancy.year}
                        onChange={(e) => updatePregnancy(pregnancy.id, 'year', e.target.value)}
                        placeholder="Year"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`outcome-${pregnancy.id}`}>Outcome</Label>
                      <Select 
                        value={pregnancy.outcome}
                        onValueChange={(value) => updatePregnancy(pregnancy.id, 'outcome', value)}
                      >
                        <SelectTrigger id={`outcome-${pregnancy.id}`}>
                          <SelectValue placeholder="Select outcome" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="liveBirth">Live Birth</SelectItem>
                          <SelectItem value="miscarriage">Miscarriage</SelectItem>
                          <SelectItem value="stillbirth">Stillbirth</SelectItem>
                          <SelectItem value="abortion">Abortion</SelectItem>
                          <SelectItem value="ectopic">Ectopic Pregnancy</SelectItem>
                          <SelectItem value="current">Currently Pregnant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`weeks-${pregnancy.id}`}>Weeks of Gestation</Label>
                      <Input
                        id={`weeks-${pregnancy.id}`}
                        type="number"
                        min="1"
                        max="45"
                        value={pregnancy.weeks}
                        onChange={(e) => updatePregnancy(pregnancy.id, 'weeks', e.target.value)}
                        placeholder="Weeks"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`complications-${pregnancy.id}`}>Complications (if any)</Label>
                      <Textarea
                        id={`complications-${pregnancy.id}`}
                        value={pregnancy.complications}
                        onChange={(e) => updatePregnancy(pregnancy.id, 'complications', e.target.value)}
                        placeholder="Describe any complications during pregnancy or delivery"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Gynecological History</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gynecologicalConditions">Gynecological Conditions</Label>
                <Textarea 
                  id="gynecologicalConditions" 
                  placeholder="List any gynecological conditions (e.g., PCOS, endometriosis, fibroids, ovarian cysts)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gynecologicalProcedures">Gynecological Procedures/Surgeries</Label>
                <Textarea 
                  id="gynecologicalProcedures" 
                  placeholder="List any gynecological procedures or surgeries (e.g., D&C, LEEP, hysteroscopy, laparoscopy)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastPapSmear">Date of Last Pap Smear</Label>
                <Input id="lastPapSmear" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="papSmearResults">Pap Smear Results</Label>
                <Select>
                  <SelectTrigger id="papSmearResults">
                    <SelectValue placeholder="Select results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="abnormal">Abnormal</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastMammogram">Date of Last Mammogram (if applicable)</Label>
                <Input id="lastMammogram" type="date" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mammogramResults">Mammogram Results</Label>
                <Select>
                  <SelectTrigger id="mammogramResults">
                    <SelectValue placeholder="Select results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="abnormal">Abnormal</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                    <SelectItem value="notApplicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Menopause Status (if applicable)</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="menopauseStatus">Menopause Status</Label>
                <Select>
                  <SelectTrigger id="menopauseStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premenopausal">Premenopausal</SelectItem>
                    <SelectItem value="perimenopausal">Perimenopausal</SelectItem>
                    <SelectItem value="postmenopausal">Postmenopausal</SelectItem>
                    <SelectItem value="notApplicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="menopauseAge">Age at Menopause (if applicable)</Label>
                <Input id="menopauseAge" type="number" min="30" max="65" placeholder="Age" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="menopauseSymptoms">Menopausal Symptoms (if applicable)</Label>
                <Textarea 
                  id="menopauseSymptoms" 
                  placeholder="Describe any menopausal symptoms (e.g., hot flashes, night sweats, mood changes)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hrt">Hormone Replacement Therapy</Label>
                <Select>
                  <SelectTrigger id="hrt">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Currently using</SelectItem>
                    <SelectItem value="past">Used in the past</SelectItem>
                    <SelectItem value="never">Never used</SelectItem>
                    <SelectItem value="notApplicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </>
      )}
      
      {!isFemale && (
        <div>
          <h3 className="text-lg font-medium mb-4">Male Reproductive Health</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prostateConcerns">Prostate Health Concerns</Label>
              <Textarea 
                id="prostateConcerns" 
                placeholder="Describe any prostate health concerns or conditions"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastProstate">Date of Last Prostate Exam (if applicable)</Label>
              <Input id="lastProstate" type="date" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="psaResult">PSA Test Result (if known)</Label>
              <Input id="psaResult" placeholder="PSA level" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testicular">Testicular Concerns or Conditions</Label>
              <Textarea 
                id="testicular" 
                placeholder="Describe any testicular concerns or conditions"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fertilityIssues">Fertility Issues or Concerns</Label>
              <Textarea 
                id="fertilityIssues" 
                placeholder="Describe any fertility issues or concerns"
              />
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-4">Contraception</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentContraception">Current Contraception Method</Label>
            <Select>
              <SelectTrigger id="currentContraception">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="condoms">Condoms</SelectItem>
                <SelectItem value="pill">Birth Control Pills</SelectItem>
                <SelectItem value="iud">IUD</SelectItem>
                <SelectItem value="implant">Implant</SelectItem>
                <SelectItem value="injection">Injection</SelectItem>
                <SelectItem value="patch">Patch</SelectItem>
                <SelectItem value="ring">Vaginal Ring</SelectItem>
                <SelectItem value="sterilization">Sterilization</SelectItem>
                <SelectItem value="natural">Natural Family Planning</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="notApplicable">Not Applicable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contraceptionDuration">Duration of Current Method Use</Label>
            <Input id="contraceptionDuration" placeholder="e.g., 2 years, 6 months" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="previousContraception">Previous Contraception Methods</Label>
            <Textarea 
              id="previousContraception" 
              placeholder="List any previous contraception methods you have used"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contraceptionIssues">Issues with Contraception</Label>
            <Textarea 
              id="contraceptionIssues" 
              placeholder="Describe any issues or side effects with current or previous contraception methods"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalProfileReproductiveHistoryForm;
