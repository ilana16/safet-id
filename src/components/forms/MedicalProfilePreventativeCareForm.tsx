
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const MedicalProfilePreventativeCareForm = () => {
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
                    <Checkbox id="covid" />
                    <div>
                      <Label htmlFor="covid" className="text-sm font-normal">COVID-19 Vaccine</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          type="date" 
                          className="w-full" 
                          placeholder="Date" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="influenza" />
                    <div>
                      <Label htmlFor="influenza" className="text-sm font-normal">Influenza (Flu) Shot</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          type="date" 
                          className="w-full" 
                          placeholder="Date" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tetanus" />
                    <div>
                      <Label htmlFor="tetanus" className="text-sm font-normal">Tetanus (Tdap/Td)</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          type="date" 
                          className="w-full" 
                          placeholder="Date" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pneumonia" />
                    <div>
                      <Label htmlFor="pneumonia" className="text-sm font-normal">Pneumonia</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          type="date" 
                          className="w-full" 
                          placeholder="Date" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="shingles" />
                    <div>
                      <Label htmlFor="shingles" className="text-sm font-normal">Shingles (Zoster)</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          type="date" 
                          className="w-full" 
                          placeholder="Date" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hpv" />
                    <div>
                      <Label htmlFor="hpv" className="text-sm font-normal">HPV</Label>
                      <div className="flex items-center mt-1">
                        <Input 
                          type="date" 
                          className="w-full" 
                          placeholder="Date" 
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
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastDental">Last Dental Check-up</Label>
                    <Input 
                      id="lastDental" 
                      type="date" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastEyeExam">Last Eye Exam</Label>
                    <Input 
                      id="lastEyeExam" 
                      type="date" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastBloodwork">Last Blood Work</Label>
                    <Input 
                      id="lastBloodwork" 
                      type="date" 
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
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="mammogram">Last Mammogram</Label>
                      <Input 
                        id="mammogram" 
                        type="date" 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="papSmear">Last Pap Smear</Label>
                      <Input 
                        id="papSmear" 
                        type="date" 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="prostateExam">Last Prostate Exam</Label>
                      <Input 
                        id="prostateExam" 
                        type="date" 
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="skinCancer">Last Skin Cancer Screening</Label>
                      <Input 
                        id="skinCancer" 
                        type="date" 
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
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalProfilePreventativeCareForm;
