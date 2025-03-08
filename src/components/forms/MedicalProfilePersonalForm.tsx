
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const MedicalProfilePersonalForm = () => {
  const [hasEmergencyContact, setHasEmergencyContact] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bloodType">Blood Type</Label>
            <Select>
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
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input id="height" type="number" placeholder="Height in centimeters" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input id="weight" type="number" placeholder="Weight in kilograms" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="primaryLanguage">Primary Language</Label>
            <Input id="primaryLanguage" placeholder="e.g., English" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" placeholder="Your phone number" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Your current address" />
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox id="hasEmergencyContact" checked={hasEmergencyContact} onCheckedChange={(checked) => setHasEmergencyContact(checked as boolean)} />
          <Label htmlFor="hasEmergencyContact" className="text-sm font-medium cursor-pointer">
            I want to add emergency contact information
          </Label>
        </div>
        
        {hasEmergencyContact && (
          <div className="border-l-2 border-safet-100 pl-4 ml-1 space-y-4">
            <h4 className="text-md font-medium">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input id="emergencyName" placeholder="Full name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyRelationship">Relationship</Label>
                <Input id="emergencyRelationship" placeholder="e.g., Spouse, Parent" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input id="emergencyPhone" type="tel" placeholder="Contact phone number" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyEmail">Email (Optional)</Label>
                <Input id="emergencyEmail" type="email" placeholder="Contact email" />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox id="hasInsurance" checked={hasInsurance} onCheckedChange={(checked) => setHasInsurance(checked as boolean)} />
          <Label htmlFor="hasInsurance" className="text-sm font-medium cursor-pointer">
            I want to add insurance information
          </Label>
        </div>
        
        {hasInsurance && (
          <div className="border-l-2 border-safet-100 pl-4 ml-1 space-y-4">
            <h4 className="text-md font-medium">Insurance Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input id="insuranceProvider" placeholder="Provider name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input id="policyNumber" placeholder="Your policy number" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groupNumber">Group Number (if applicable)</Label>
                <Input id="groupNumber" placeholder="Group number" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="policyHolder">Policy Holder (if not self)</Label>
                <Input id="policyHolder" placeholder="Full name of policy holder" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalProfilePersonalForm;
