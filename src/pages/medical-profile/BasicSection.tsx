
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BasicSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bloodType: '',
    primaryLanguage: '',
    preferredPronoun: '',
    completed: false,
    lastUpdated: ''
  });
  
  // Load saved data
  React.useEffect(() => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
      if (savedProfile && savedProfile.basic) {
        setFormData(savedProfile.basic);
      }
    } catch (error) {
      console.error('Error loading basic information:', error);
    }
  }, []);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.basic || {};
      
      const changes: {field: string; oldValue: any; newValue: any}[] = [];
      
      Object.entries(formData).forEach(([key, value]) => {
        if (existingSectionData[key] !== value && key !== 'completed' && key !== 'lastUpdated') {
          changes.push({
            field: key,
            oldValue: existingSectionData[key],
            newValue: value
          });
        }
      });
      
      setTimeout(() => {
        const updatedProfile = {
          ...existingProfile,
          basic: {
            ...formData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved basic information:', updatedProfile);
        
        if (changes.length > 0) {
          logChanges('basic', changes);
        }
        
        setIsSaving(false);
        toast.success('Basic information saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving basic information:', error);
      setIsSaving(false);
      toast.error('Error saving basic information');
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">Basic Health Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input 
              id="height" 
              type="number" 
              placeholder="Height in centimeters" 
              value={formData.height}
              onChange={(e) => handleInputChange('height', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input 
              id="weight" 
              type="number" 
              placeholder="Weight in kilograms" 
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bloodType">Blood Type</Label>
            <Select value={formData.bloodType} onValueChange={(value) => handleInputChange('bloodType', value)}>
              <SelectTrigger id="bloodType">
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a+">A+</SelectItem>
                <SelectItem value="a-">A-</SelectItem>
                <SelectItem value="b+">B+</SelectItem>
                <SelectItem value="b-">B-</SelectItem>
                <SelectItem value="ab+">AB+</SelectItem>
                <SelectItem value="ab-">AB-</SelectItem>
                <SelectItem value="o+">O+</SelectItem>
                <SelectItem value="o-">O-</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="primaryLanguage">Primary Language</Label>
            <Input 
              id="primaryLanguage" 
              placeholder="e.g., English" 
              value={formData.primaryLanguage}
              onChange={(e) => handleInputChange('primaryLanguage', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferredPronoun">Preferred Pronouns (Optional)</Label>
            <Select value={formData.preferredPronoun} onValueChange={(value) => handleInputChange('preferredPronoun', value)}>
              <SelectTrigger id="preferredPronoun">
                <SelectValue placeholder="Select pronouns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="he/him">He/Him</SelectItem>
                <SelectItem value="she/her">She/Her</SelectItem>
                <SelectItem value="they/them">They/Them</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end gap-3">
        <Button 
          onClick={handleSave} 
          className="bg-safet-500 hover:bg-safet-600"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save'}
          {!isSaving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default BasicSection;
