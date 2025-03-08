
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, ImagePlus, X } from 'lucide-react';

const MedicalProfilePersonalForm = () => {
  const [hasEmergencyContact, setHasEmergencyContact] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([{ id: 1, name: '', relationship: '', phone: '', email: '' }]);
  const [insuranceImages, setInsuranceImages] = useState<string[]>([]);

  const addEmergencyContact = () => {
    const newId = emergencyContacts.length > 0 
      ? Math.max(...emergencyContacts.map(contact => contact.id)) + 1 
      : 1;
    setEmergencyContacts([...emergencyContacts, { id: newId, name: '', relationship: '', phone: '', email: '' }]);
  };

  const removeEmergencyContact = (id: number) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
    }
  };

  const updateEmergencyContact = (id: number, field: string, value: string) => {
    setEmergencyContacts(emergencyContacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  const handleInsuranceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setInsuranceImages([...insuranceImages, reader.result as string]);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const removeInsuranceImage = (index: number) => {
    setInsuranceImages(insuranceImages.filter((_, i) => i !== index));
  };

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
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Emergency Contacts</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-safet-600 border-safet-200"
                onClick={addEmergencyContact}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Contact
              </Button>
            </div>
            
            {emergencyContacts.map((contact, index) => (
              <div key={contact.id} className="space-y-4 pt-2 border-t border-gray-100 first:border-t-0 first:pt-0">
                {index > 0 && (
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-medium text-gray-700">Contact #{index + 1}</h5>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
                      onClick={() => removeEmergencyContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`emergencyName-${contact.id}`}>Contact Name</Label>
                    <Input 
                      id={`emergencyName-${contact.id}`} 
                      placeholder="Full name" 
                      value={contact.name}
                      onChange={(e) => updateEmergencyContact(contact.id, 'name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`emergencyRelationship-${contact.id}`}>Relationship</Label>
                    <Input 
                      id={`emergencyRelationship-${contact.id}`} 
                      placeholder="e.g., Spouse, Parent" 
                      value={contact.relationship}
                      onChange={(e) => updateEmergencyContact(contact.id, 'relationship', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`emergencyPhone-${contact.id}`}>Phone Number</Label>
                    <Input 
                      id={`emergencyPhone-${contact.id}`} 
                      type="tel" 
                      placeholder="Contact phone number" 
                      value={contact.phone}
                      onChange={(e) => updateEmergencyContact(contact.id, 'phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`emergencyEmail-${contact.id}`}>Email (Optional)</Label>
                    <Input 
                      id={`emergencyEmail-${contact.id}`} 
                      type="email" 
                      placeholder="Contact email" 
                      value={contact.email}
                      onChange={(e) => updateEmergencyContact(contact.id, 'email', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
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
            
            <div className="space-y-2">
              <Label htmlFor="insuranceUpload">Upload Insurance Card Images</Label>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <Input
                    id="insuranceUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleInsuranceImageUpload}
                  />
                  <Label 
                    htmlFor="insuranceUpload" 
                    className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 w-full hover:border-safet-300 transition-colors"
                  >
                    <div className="text-center">
                      <ImagePlus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload insurance card image</span>
                      <span className="text-xs text-gray-500 block mt-1">(Front or back of card)</span>
                    </div>
                  </Label>
                </div>
                
                {insuranceImages.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {insuranceImages.map((image, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden border border-gray-200 group">
                        <img 
                          src={image} 
                          alt={`Insurance card ${index + 1}`} 
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeInsuranceImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload images of your insurance card (front and back) instead of manually entering the information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalProfilePersonalForm;
