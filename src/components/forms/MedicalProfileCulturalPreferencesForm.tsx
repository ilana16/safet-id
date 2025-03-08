
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const MedicalProfileCulturalPreferencesForm = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-lg font-medium mb-4">Cultural & Religious Preferences</div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="religion">Religious Affiliation (if any)</Label>
                <Select defaultValue="">
                  <SelectTrigger id="religion">
                    <SelectValue placeholder="Select religious affiliation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Prefer not to say</SelectItem>
                    <SelectItem value="christianity">Christianity</SelectItem>
                    <SelectItem value="islam">Islam</SelectItem>
                    <SelectItem value="hinduism">Hinduism</SelectItem>
                    <SelectItem value="buddhism">Buddhism</SelectItem>
                    <SelectItem value="judaism">Judaism</SelectItem>
                    <SelectItem value="sikhism">Sikhism</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="otherReligion">If other, please specify</Label>
                <Input id="otherReligion" placeholder="Please specify your religious affiliation" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="culturalConsiderations">Cultural considerations important for your care</Label>
              <Textarea 
                id="culturalConsiderations" 
                placeholder="Are there any cultural factors that you'd like your healthcare providers to know about?" 
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Healthcare Decision Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="familyInvolvement" />
                  <Label htmlFor="familyInvolvement" className="text-sm font-normal">
                    I prefer family involvement in healthcare decisions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="religiousLeader" />
                  <Label htmlFor="religiousLeader" className="text-sm font-normal">
                    I prefer involving a religious/spiritual leader in major healthcare decisions
                  </Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="languagePreferences">Language Preferences</Label>
              <Select defaultValue="english">
                <SelectTrigger id="languagePreferences">
                  <SelectValue placeholder="Select preferred language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="mandarin">Mandarin</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="russian">Russian</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="interpreterNeeded">Need for Interpreter</Label>
              <Select defaultValue="no">
                <SelectTrigger id="interpreterNeeded">
                  <SelectValue placeholder="Do you need an interpreter?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dietaryRestrictions">Dietary Restrictions or Preferences</Label>
              <Textarea 
                id="dietaryRestrictions" 
                placeholder="Please describe any dietary restrictions or preferences based on religious/cultural beliefs" 
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea 
                id="additionalInfo" 
                placeholder="Any other cultural or religious considerations that might impact your healthcare" 
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalProfileCulturalPreferencesForm;
