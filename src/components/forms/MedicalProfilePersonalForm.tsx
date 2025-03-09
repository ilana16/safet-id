import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, ImagePlus, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const MedicalProfilePersonalForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    preferredPronoun: '',
    bloodType: '',
    height: '',
    weight: '',
    primaryLanguage: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });
  
  const [hasEmergencyContact, setHasEmergencyContact] = useState(false);
  const [hasInsurance, setHasInsurance] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([{ id: 1, name: '', relationship: '', phone: '', email: '' }]);
  const [insuranceImages, setInsuranceImages] = useState<string[]>([]);
  const [insuranceData, setInsuranceData] = useState({
    provider: '',
    type: '',
    policyNumber: '',
    groupNumber: ''
  });
  
  // Unit preferences
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  
  // For imperial height
  const [feet, setFeet] = useState<string>('');
  const [inches, setInches] = useState<string>('');

  // Load saved data on component mount
  useEffect(() => {
    // Check if there's data in the window object first (from parent component)
    const windowData = (window as any).personalFormData;

    // Otherwise, try to load from localStorage
    const savedProfile = windowData || JSON.parse(localStorage.getItem('medicalProfile') || '{}');
    
    if (savedProfile && savedProfile.personal) {
      // Load basic form data
      if (savedProfile.personal.formData) {
        setFormData(savedProfile.personal.formData);
        
        // Set unit preferences if saved
        if (savedProfile.personal.heightUnit) {
          setHeightUnit(savedProfile.personal.heightUnit);
        }
        if (savedProfile.personal.weightUnit) {
          setWeightUnit(savedProfile.personal.weightUnit);
        }
        
        // Convert height to feet/inches if needed
        if (heightUnit === 'ft' && savedProfile.personal.formData.height) {
          const heightCm = parseFloat(savedProfile.personal.formData.height);
          if (!isNaN(heightCm)) {
            const heightInches = heightCm / 2.54;
            const feetValue = Math.floor(heightInches / 12);
            const inchesValue = Math.round(heightInches % 12);
            setFeet(feetValue.toString());
            setInches(inchesValue.toString());
          }
        }
      }
      
      // Load emergency contacts
      if (savedProfile.personal.hasEmergencyContact !== undefined) {
        setHasEmergencyContact(savedProfile.personal.hasEmergencyContact);
      }
      if (savedProfile.personal.emergencyContacts && savedProfile.personal.emergencyContacts.length > 0) {
        setEmergencyContacts(savedProfile.personal.emergencyContacts);
      }
      
      // Load insurance data
      if (savedProfile.personal.hasInsurance !== undefined) {
        setHasInsurance(savedProfile.personal.hasInsurance);
      }
      if (savedProfile.personal.insuranceData) {
        setInsuranceData(savedProfile.personal.insuranceData);
      }
      if (savedProfile.personal.insuranceImages) {
        setInsuranceImages(savedProfile.personal.insuranceImages);
      }
    }
  }, []);

  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle height unit change
  const handleHeightUnitChange = (value: 'cm' | 'ft') => {
    setHeightUnit(value);
    
    // Convert current height value
    if (value === 'ft' && formData.height) {
      // Convert cm to feet/inches
      const heightCm = parseFloat(formData.height);
      if (!isNaN(heightCm)) {
        const heightInches = heightCm / 2.54;
        const feetValue = Math.floor(heightInches / 12);
        const inchesValue = Math.round(heightInches % 12);
        setFeet(feetValue.toString());
        setInches(inchesValue.toString());
      }
    } else if (value === 'cm' && feet && inches) {
      // Convert feet/inches to cm
      const feetValue = parseFloat(feet);
      const inchesValue = parseFloat(inches);
      if (!isNaN(feetValue) && !isNaN(inchesValue)) {
        const totalInches = (feetValue * 12) + inchesValue;
        const heightCm = Math.round(totalInches * 2.54);
        handleInputChange('height', heightCm.toString());
      }
    }
  };

  // Handle weight unit change
  const handleWeightUnitChange = (value: 'kg' | 'lb') => {
    setWeightUnit(value);
    
    // Convert current weight value
    if (value === 'lb' && formData.weight) {
      // Convert kg to lb
      const weightKg = parseFloat(formData.weight);
      if (!isNaN(weightKg)) {
        const weightLb = Math.round(weightKg * 2.20462);
        handleInputChange('weight', weightLb.toString());
      }
    } else if (value === 'kg' && formData.weight) {
      // Convert lb to kg
      const weightLb = parseFloat(formData.weight);
      if (!isNaN(weightLb)) {
        const weightKg = Math.round(weightLb / 2.20462);
        handleInputChange('weight', weightKg.toString());
      }
    }
  };

  // Handle feet/inches changes
  const handleFeetChange = (value: string) => {
    setFeet(value);
    updateHeightFromImperial(value, inches);
  };

  const handleInchesChange = (value: string) => {
    setInches(value);
    updateHeightFromImperial(feet, value);
  };

  const updateHeightFromImperial = (ft: string, inch: string) => {
    const feetValue = parseFloat(ft);
    const inchesValue = parseFloat(inch);
    
    if (!isNaN(feetValue) && !isNaN(inchesValue)) {
      const totalInches = (feetValue * 12) + inchesValue;
      const heightCm = Math.round(totalInches * 2.54);
      handleInputChange('height', heightCm.toString());
    }
  };

  // Handle insurance field changes
  const handleInsuranceChange = (field: string, value: string) => {
    setInsuranceData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

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
  
  // Prepare data for parent component/global state
  useEffect(() => {
    // Update the window object with the current form data including unit preferences
    (window as any).personalFormData = {
      formData,
      hasEmergencyContact,
      emergencyContacts,
      hasInsurance,
      insuranceData,
      insuranceImages,
      heightUnit,
      weightUnit,
      feet,
      inches
    };
  }, [formData, hasEmergencyContact, emergencyContacts, hasInsurance, insuranceData, insuranceImages, heightUnit, weightUnit, feet, inches]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              placeholder="Your full legal name" 
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input 
              id="dob" 
              type="date" 
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="transgender">Transgender</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
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
          
          {/* Height input with unit toggle */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="height">Height</Label>
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant={heightUnit === 'cm' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleHeightUnitChange('cm')}
                  className="h-7 px-2 text-xs"
                >
                  cm
                </Button>
                <Button 
                  type="button" 
                  variant={heightUnit === 'ft' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleHeightUnitChange('ft')}
                  className="h-7 px-2 text-xs"
                >
                  ft/in
                </Button>
              </div>
            </div>
            
            {heightUnit === 'cm' ? (
              <Input 
                id="height" 
                type="number" 
                placeholder="Height in centimeters" 
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
              />
            ) : (
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input 
                    id="heightFeet" 
                    type="number" 
                    placeholder="Feet" 
                    value={feet}
                    onChange={(e) => handleFeetChange(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input 
                    id="heightInches" 
                    type="number" 
                    placeholder="Inches" 
                    value={inches}
                    min="0" 
                    max="11"
                    onChange={(e) => handleInchesChange(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Weight input with unit toggle */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="weight">Weight</Label>
              <div className="flex items-center space-x-2">
                <Button 
                  type="button" 
                  variant={weightUnit === 'kg' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleWeightUnitChange('kg')}
                  className="h-7 px-2 text-xs"
                >
                  kg
                </Button>
                <Button 
                  type="button" 
                  variant={weightUnit === 'lb' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleWeightUnitChange('lb')}
                  className="h-7 px-2 text-xs"
                >
                  lb
                </Button>
              </div>
            </div>
            
            <Input 
              id="weight" 
              type="number" 
              placeholder={`Weight in ${weightUnit === 'kg' ? 'kilograms' : 'pounds'}`} 
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
            />
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
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="Your phone number" 
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Your email address" 
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Street Address</Label>
            <Input 
              id="address" 
              placeholder="Street address" 
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              placeholder="City" 
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input 
              id="state" 
              placeholder="State/Province" 
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal/ZIP Code</Label>
            <Input 
              id="postalCode" 
              placeholder="Postal/ZIP Code" 
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input 
              id="country" 
              placeholder="Country" 
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox 
            id="hasEmergencyContact" 
            checked={hasEmergencyContact} 
            onCheckedChange={(checked) => setHasEmergencyContact(checked as boolean)} 
          />
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
          <Checkbox 
            id="hasInsurance" 
            checked={hasInsurance} 
            onCheckedChange={(checked) => setHasInsurance(checked as boolean)} 
          />
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
                <Input 
                  id="insuranceProvider" 
                  placeholder="Provider name" 
                  value={insuranceData.provider}
                  onChange={(e) => handleInsuranceChange('provider', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceType">Insurance Type</Label>
                <Select value={insuranceData.type} onValueChange={(value) => handleInsuranceChange('type', value)}>
                  <SelectTrigger id="insuranceType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="medicare">Medicare</SelectItem>
                    <SelectItem value="medicaid">Medicaid</SelectItem>
                    <SelectItem value="tricare">Tricare</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input 
                  id="policyNumber" 
                  placeholder="Insurance policy number" 
                  value={insuranceData.policyNumber}
                  onChange={(e) => handleInsuranceChange('policyNumber', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="groupNumber">Group Number (if applicable)</Label>
                <Input 
                  id="groupNumber" 
                  placeholder="Insurance group number" 
                  value={insuranceData.groupNumber}
                  onChange={(e) => handleInsuranceChange('groupNumber', e.target.value)}
                />
              </div>
            </div>
            
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
