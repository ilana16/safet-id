
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const MedicalProfilePreventativeCareForm = () => {
  // Immunization states
  const [covid, setCovid] = useState<boolean>(false);
  const [covidDate, setCovidDate] = useState<string>('');
  const [influenza, setInfluenza] = useState<boolean>(false);
  const [influenzaDate, setInfluenzaDate] = useState<string>('');
  const [tetanus, setTetanus] = useState<boolean>(false);
  const [tetanusDate, setTetanusDate] = useState<string>('');
  const [pneumonia, setPneumonia] = useState<boolean>(false);
  const [pneumoniaDate, setPneumoniaDate] = useState<string>('');
  const [shingles, setShingles] = useState<boolean>(false);
  const [shinglesDate, setShinglesDate] = useState<string>('');
  const [hpv, setHpv] = useState<boolean>(false);
  const [hpvDate, setHpvDate] = useState<string>('');
  
  // Health screenings
  const [lastPhysical, setLastPhysical] = useState<string>('');
  const [lastDental, setLastDental] = useState<string>('');
  const [lastEyeExam, setLastEyeExam] = useState<string>('');
  const [lastBloodwork, setLastBloodwork] = useState<string>('');
  
  // Cancer screenings
  const [colonoscopy, setColonoscopy] = useState<string>('');
  const [mammogram, setMammogram] = useState<string>('');
  const [papSmear, setPapSmear] = useState<string>('');
  const [prostateExam, setProstateExam] = useState<string>('');
  const [skinCancer, setSkinCancer] = useState<string>('');
  
  // Additional notes
  const [preventativeNotes, setPreventativeNotes] = useState<string>('');

  // Load saved data on component mount
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
    if (savedProfile && savedProfile.preventative) {
      const data = savedProfile.preventative;
      
      // Immunizations
      setCovid(data.covid === 'true' || false);
      setCovidDate(data.covidDate || '');
      setInfluenza(data.influenza === 'true' || false);
      setInfluenzaDate(data.influenzaDate || '');
      setTetanus(data.tetanus === 'true' || false);
      setTetanusDate(data.tetanusDate || '');
      setPneumonia(data.pneumonia === 'true' || false);
      setPneumoniaDate(data.pneumoniaDate || '');
      setShingles(data.shingles === 'true' || false);
      setShinglesDate(data.shinglesDate || '');
      setHpv(data.hpv === 'true' || false);
      setHpvDate(data.hpvDate || '');
      
      // Health screenings
      setLastPhysical(data.lastPhysical || '');
      setLastDental(data.lastDental || '');
      setLastEyeExam(data.lastEyeExam || '');
      setLastBloodwork(data.lastBloodwork || '');
      
      // Cancer screenings
      setColonoscopy(data.colonoscopy || '');
      setMammogram(data.mammogram || '');
      setPapSmear(data.papSmear || '');
      setProstateExam(data.prostateExam || '');
      setSkinCancer(data.skinCancer || '');
      
      // Additional notes
      setPreventativeNotes(data.preventativeNotes || '');
    }
  }, []);

  // Make form data available to the parent component for saving
  useEffect(() => {
    const formData = {
      // Immunizations
      covid: covid.toString(),
      covidDate,
      influenza: influenza.toString(),
      influenzaDate,
      tetanus: tetanus.toString(),
      tetanusDate,
      pneumonia: pneumonia.toString(),
      pneumoniaDate,
      shingles: shingles.toString(),
      shinglesDate,
      hpv: hpv.toString(),
      hpvDate,
      
      // Health screenings
      lastPhysical,
      lastDental,
      lastEyeExam,
      lastBloodwork,
      
      // Cancer screenings
      colonoscopy,
      mammogram,
      papSmear,
      prostateExam,
      skinCancer,
      
      // Additional notes
      preventativeNotes
    };
    
    // Store the current form state in window for the parent component to access
    (window as any).preventativeCareFormData = formData;
    
    return () => {
      // Clean up when component unmounts
      delete (window as any).preventativeCareFormData;
    };
  }, [
    covid, covidDate, influenza, influenzaDate, tetanus, tetanusDate,
    pneumonia, pneumoniaDate, shingles, shinglesDate, hpv, hpvDate,
    lastPhysical, lastDental, lastEyeExam, lastBloodwork,
    colonoscopy, mammogram, papSmear, prostateExam, skinCancer,
    preventativeNotes
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-lg font-medium mb-4">Preventative Care History</div>
          
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Immunizations</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="covid" 
                      checked={covid}
                      onCheckedChange={(checked) => setCovid(checked === true)}
                    />
                    <div>
                      <Label htmlFor="covid" className="text-sm font-normal">COVID-19 Vaccine</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          id="covidDate"
                          type="date" 
                          className="w-full" 
                          placeholder="Date"
                          value={covidDate}
                          onChange={(e) => setCovidDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="influenza" 
                      checked={influenza}
                      onCheckedChange={(checked) => setInfluenza(checked === true)}
                    />
                    <div>
                      <Label htmlFor="influenza" className="text-sm font-normal">Influenza (Flu) Shot</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          id="influenzaDate"
                          type="date" 
                          className="w-full" 
                          placeholder="Date"
                          value={influenzaDate}
                          onChange={(e) => setInfluenzaDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="tetanus" 
                      checked={tetanus}
                      onCheckedChange={(checked) => setTetanus(checked === true)}
                    />
                    <div>
                      <Label htmlFor="tetanus" className="text-sm font-normal">Tetanus (Tdap/Td)</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          id="tetanusDate"
                          type="date" 
                          className="w-full" 
                          placeholder="Date"
                          value={tetanusDate}
                          onChange={(e) => setTetanusDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pneumonia" 
                      checked={pneumonia}
                      onCheckedChange={(checked) => setPneumonia(checked === true)}
                    />
                    <div>
                      <Label htmlFor="pneumonia" className="text-sm font-normal">Pneumonia</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          id="pneumoniaDate"
                          type="date" 
                          className="w-full" 
                          placeholder="Date"
                          value={pneumoniaDate}
                          onChange={(e) => setPneumoniaDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="shingles" 
                      checked={shingles}
                      onCheckedChange={(checked) => setShingles(checked === true)}
                    />
                    <div>
                      <Label htmlFor="shingles" className="text-sm font-normal">Shingles (Zoster)</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          id="shinglesDate"
                          type="date" 
                          className="w-full" 
                          placeholder="Date"
                          value={shinglesDate}
                          onChange={(e) => setShinglesDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hpv" 
                      checked={hpv}
                      onCheckedChange={(checked) => setHpv(checked === true)}
                    />
                    <div>
                      <Label htmlFor="hpv" className="text-sm font-normal">HPV</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          id="hpvDate"
                          type="date" 
                          className="w-full" 
                          placeholder="Date"
                          value={hpvDate}
                          onChange={(e) => setHpvDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-base font-medium">Health Screenings</Label>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastPhysical">Last Physical Exam</Label>
                    <Input 
                      id="lastPhysical" 
                      type="date"
                      value={lastPhysical}
                      onChange={(e) => setLastPhysical(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastDental">Last Dental Check-up</Label>
                    <Input 
                      id="lastDental" 
                      type="date"
                      value={lastDental}
                      onChange={(e) => setLastDental(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastEyeExam">Last Eye Exam</Label>
                    <Input 
                      id="lastEyeExam" 
                      type="date"
                      value={lastEyeExam}
                      onChange={(e) => setLastEyeExam(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastBloodwork">Last Blood Work</Label>
                    <Input 
                      id="lastBloodwork" 
                      type="date"
                      value={lastBloodwork}
                      onChange={(e) => setLastBloodwork(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Cancer Screenings</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="colonoscopy">Last Colonoscopy</Label>
                      <Input 
                        id="colonoscopy" 
                        type="date"
                        value={colonoscopy}
                        onChange={(e) => setColonoscopy(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="mammogram">Last Mammogram</Label>
                      <Input 
                        id="mammogram" 
                        type="date"
                        value={mammogram}
                        onChange={(e) => setMammogram(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="papSmear">Last Pap Smear</Label>
                      <Input 
                        id="papSmear" 
                        type="date"
                        value={papSmear}
                        onChange={(e) => setPapSmear(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="prostateExam">Last Prostate Exam</Label>
                      <Input 
                        id="prostateExam" 
                        type="date"
                        value={prostateExam}
                        onChange={(e) => setProstateExam(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="skinCancer">Last Skin Cancer Screening</Label>
                      <Input 
                        id="skinCancer" 
                        type="date"
                        value={skinCancer}
                        onChange={(e) => setSkinCancer(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="preventativeNotes" className="text-base font-medium">Additional Preventative Care Notes</Label>
              <Textarea 
                id="preventativeNotes" 
                placeholder="Any other information about screenings, tests, or preventative measures you'd like to share" 
                className="mt-2"
                rows={4}
                value={preventativeNotes}
                onChange={(e) => setPreventativeNotes(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalProfilePreventativeCareForm;
