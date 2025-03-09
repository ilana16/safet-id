
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const MedicalProfileCulturalPreferencesForm = () => {
  const [religion, setReligion] = useState<string>('');
  const [otherReligion, setOtherReligion] = useState<string>('');
  const [culturalConsiderations, setCulturalConsiderations] = useState<string>('');
  const [familyInvolvement, setFamilyInvolvement] = useState<boolean>(false);
  const [religiousLeader, setReligiousLeader] = useState<boolean>(false);
  const [languagePreferences, setLanguagePreferences] = useState<string>('english');
  const [interpreterNeeded, setInterpreterNeeded] = useState<string>('no');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  // Load saved data on component mount and when route changes
  useEffect(() => {
    const loadSavedData = () => {
      try {
        console.log('Loading cultural preferences data...');
        // First check if data is available in the window object (from parent component)
        if ((window as any).culturalPreferencesFormData) {
          const culturalData = (window as any).culturalPreferencesFormData;
          
          setReligion(culturalData.religion || '');
          setOtherReligion(culturalData.otherReligion || '');
          setCulturalConsiderations(culturalData.culturalConsiderations || '');
          setFamilyInvolvement(culturalData.familyInvolvement === 'true' || false);
          setReligiousLeader(culturalData.religiousLeader === 'true' || false);
          setLanguagePreferences(culturalData.languagePreferences || 'english');
          setInterpreterNeeded(culturalData.interpreterNeeded || 'no');
          setDietaryRestrictions(culturalData.dietaryRestrictions || '');
          setAdditionalNotes(culturalData.additionalNotes || '');
          
          console.log('Loaded cultural preferences from window object:', culturalData);
        } 
        // Fallback to localStorage if window object doesn't have the data
        else {
          const savedProfile = localStorage.getItem('medicalProfile');
          
          if (savedProfile) {
            const profileData = JSON.parse(savedProfile);
            if (profileData && profileData.cultural) {
              const culturalData = profileData.cultural;
              
              setReligion(culturalData.religion || '');
              setOtherReligion(culturalData.otherReligion || '');
              setCulturalConsiderations(culturalData.culturalConsiderations || '');
              setFamilyInvolvement(culturalData.familyInvolvement === 'true' || false);
              setReligiousLeader(culturalData.religiousLeader === 'true' || false);
              setLanguagePreferences(culturalData.languagePreferences || 'english');
              setInterpreterNeeded(culturalData.interpreterNeeded || 'no');
              setDietaryRestrictions(culturalData.dietaryRestrictions || '');
              setAdditionalNotes(culturalData.additionalNotes || '');
              
              console.log('Loaded cultural preferences from localStorage:', culturalData);
              
              // Also update the window object so other components can access it
              (window as any).culturalPreferencesFormData = culturalData;
            }
          }
        }
      } catch (error) {
        console.error('Error loading cultural preferences data:', error);
      }
    };

    // Load data when component mounts
    loadSavedData();
    
    // Update when the route changes to ensure data persistence between tabs
    window.addEventListener('popstate', loadSavedData);
    
    return () => {
      window.removeEventListener('popstate', loadSavedData);
    };
  }, []);

  // Make form data available to the parent component for saving
  // Update more frequently to ensure data persistence
  useEffect(() => {
    const formData = {
      religion,
      otherReligion,
      culturalConsiderations,
      familyInvolvement: familyInvolvement.toString(),
      religiousLeader: religiousLeader.toString(),
      languagePreferences,
      interpreterNeeded,
      dietaryRestrictions,
      additionalNotes
    };
    
    // Store the current form state in window for the parent component to access
    (window as any).culturalPreferencesFormData = formData;
    
    // Additionally, store in sessionStorage for route changes
    sessionStorage.setItem('culturalPreferencesFormData', JSON.stringify(formData));
    
    return () => {
      // Don't clean up when component unmounts - we want to persist this data
      // Only clean up session storage
      sessionStorage.removeItem('culturalPreferencesFormData');
    };
  }, [
    religion, 
    otherReligion, 
    culturalConsiderations, 
    familyInvolvement, 
    religiousLeader, 
    languagePreferences, 
    interpreterNeeded, 
    dietaryRestrictions, 
    additionalNotes
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-lg font-medium mb-4">Cultural & Religious Preferences</div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="religion">Religious Affiliation (if any)</Label>
                <Select value={religion} onValueChange={setReligion}>
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
                <Input 
                  id="otherReligion" 
                  placeholder="Please specify your religious affiliation" 
                  value={otherReligion}
                  onChange={(e) => setOtherReligion(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="culturalConsiderations">Cultural considerations important for your care</Label>
              <Textarea 
                id="culturalConsiderations" 
                placeholder="Are there any cultural factors that you'd like your healthcare providers to know about?" 
                rows={3}
                value={culturalConsiderations}
                onChange={(e) => setCulturalConsiderations(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Healthcare Decision Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="familyInvolvement" 
                    checked={familyInvolvement}
                    onCheckedChange={(checked) => setFamilyInvolvement(checked === true)}
                  />
                  <Label htmlFor="familyInvolvement" className="text-sm font-normal">
                    I prefer family involvement in healthcare decisions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="religiousLeader" 
                    checked={religiousLeader}
                    onCheckedChange={(checked) => setReligiousLeader(checked === true)}
                  />
                  <Label htmlFor="religiousLeader" className="text-sm font-normal">
                    I prefer involving a religious/spiritual leader in major healthcare decisions
                  </Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="languagePreferences">Language Preferences</Label>
              <Select value={languagePreferences} onValueChange={setLanguagePreferences}>
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
              <Select value={interpreterNeeded} onValueChange={setInterpreterNeeded}>
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
                value={dietaryRestrictions}
                onChange={(e) => setDietaryRestrictions(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea 
                id="additionalNotes" 
                placeholder="Any other information you would like to share with your healthcare providers" 
                rows={4}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalProfileCulturalPreferencesForm;
