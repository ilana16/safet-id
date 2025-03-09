
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const MedicalProfileAllergiesForm = () => {
  // State for allergies
  const [allergies, setAllergies] = useState<Array<{
    allergen: string,
    reaction: string,
    severity: string,
    otherSeverity?: string
  }>>([]);
  
  // State for immunizations
  const [immunizations, setImmunizations] = useState<Array<{
    vaccine: string,
    date: string,
    otherVaccine?: string
  }>>([]);
  
  const [noKnownAllergies, setNoKnownAllergies] = useState(false);
  
  // Load saved data on component mount
  useEffect(() => {
    try {
      // First check if data is available in the window object (from parent component)
      if ((window as any).allergiesFormData) {
        const data = (window as any).allergiesFormData;
        
        // Load allergies if available
        if (data.allergies) {
          try {
            setAllergies(JSON.parse(data.allergies));
          } catch (e) {
            console.error("Error parsing allergies data:", e);
          }
        }
        
        // Load immunizations if available
        if (data.immunizations) {
          try {
            setImmunizations(JSON.parse(data.immunizations));
          } catch (e) {
            console.error("Error parsing immunizations data:", e);
          }
        }
        
        setNoKnownAllergies(data.noKnownAllergies === 'true' || false);
        console.log('Loaded allergies data from window object:', data);
      } 
      // Fallback to localStorage if window object doesn't have the data
      else {
        const savedProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
        if (savedProfile && savedProfile.allergies) {
          const data = savedProfile.allergies;
          
          // Load allergies if available
          if (data.allergies) {
            try {
              setAllergies(JSON.parse(data.allergies));
            } catch (e) {
              console.error("Error parsing allergies data:", e);
            }
          }
          
          // Load immunizations if available
          if (data.immunizations) {
            try {
              setImmunizations(JSON.parse(data.immunizations));
            } catch (e) {
              console.error("Error parsing immunizations data:", e);
            }
          }
          
          setNoKnownAllergies(data.noKnownAllergies === 'true' || false);
          console.log('Loaded allergies data from localStorage:', data);
        }
      }
    } catch (error) {
      console.error("Error loading allergies profile data:", error);
    }
  }, []);
  
  // Handler for allergies
  const handleAddAllergy = () => {
    setAllergies([...allergies, { allergen: '', reaction: '', severity: '' }]);
    setNoKnownAllergies(false);
  };
  
  const handleUpdateAllergy = (index: number, field: keyof (typeof allergies)[0], value: string) => {
    const updatedAllergies = [...allergies];
    updatedAllergies[index][field] = value;
    setAllergies(updatedAllergies);
  };
  
  const handleRemoveAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };
  
  // Handler for immunizations
  const handleAddImmunization = () => {
    setImmunizations([...immunizations, { vaccine: '', date: '' }]);
  };
  
  const handleUpdateImmunization = (index: number, field: keyof (typeof immunizations)[0], value: string) => {
    const updatedImmunizations = [...immunizations];
    updatedImmunizations[index][field] = value;
    setImmunizations(updatedImmunizations);
  };
  
  const handleRemoveImmunization = (index: number) => {
    setImmunizations(immunizations.filter((_, i) => i !== index));
  };
  
  const handleNoKnownAllergiesChange = (checked: boolean) => {
    setNoKnownAllergies(checked);
    if (checked) {
      setAllergies([]);
    }
  };
  
  // Make form data available to the parent component for saving
  useEffect(() => {
    const formData = {
      allergies: JSON.stringify(allergies),
      immunizations: JSON.stringify(immunizations),
      noKnownAllergies: noKnownAllergies.toString()
    };
    
    // Store the current form state in window for the parent component to access
    (window as any).allergiesFormData = formData;
    
    return () => {
      // Clean up when component unmounts
      delete (window as any).allergiesFormData;
    };
  }, [allergies, immunizations, noKnownAllergies]);
  
  // Common severity options
  const severityOptions = ["Mild", "Moderate", "Severe", "Life-threatening", "Other"];
  
  // Common vaccine options
  const commonVaccines = [
    "COVID-19",
    "Influenza (Flu)",
    "Tetanus, Diphtheria, Pertussis (Tdap/Td)",
    "Measles, Mumps, Rubella (MMR)",
    "Hepatitis A",
    "Hepatitis B",
    "Human Papillomavirus (HPV)",
    "Pneumococcal",
    "Shingles (Herpes Zoster)",
    "Varicella (Chickenpox)",
    "Meningococcal",
    "Other"
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Allergies</h3>
        <p className="text-sm text-gray-600 mb-4">List allergies to foods, environmental factors, or other substances.</p>
        
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox 
              id="no-known-allergies" 
              checked={noKnownAllergies}
              onCheckedChange={handleNoKnownAllergiesChange}
            />
            <Label htmlFor="no-known-allergies" className="text-sm cursor-pointer">
              No known allergies
            </Label>
          </div>
        </div>
        
        {!noKnownAllergies && allergies.map((allergy, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-md bg-gray-50 mb-3 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`allergy-${index}`}>Allergen</Label>
                <Input
                  id={`allergy-${index}`}
                  value={allergy.allergen}
                  onChange={(e) => handleUpdateAllergy(index, 'allergen', e.target.value)}
                  placeholder="e.g., Peanuts, Pollen, Latex"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`reaction-${index}`}>Reaction</Label>
                <Input
                  id={`reaction-${index}`}
                  value={allergy.reaction}
                  onChange={(e) => handleUpdateAllergy(index, 'reaction', e.target.value)}
                  placeholder="e.g., Rash, Swelling, Difficulty breathing"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`severity-${index}`}>Severity</Label>
                <Select
                  value={allergy.severity}
                  onValueChange={(value) => handleUpdateAllergy(index, 'severity', value)}
                >
                  <SelectTrigger id={`severity-${index}`}>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {allergy.severity === "Other" && (
                  <Input
                    className="mt-2"
                    placeholder="Specify severity"
                    value={allergy.otherSeverity || ''}
                    onChange={(e) => handleUpdateAllergy(index, 'otherSeverity', e.target.value)}
                  />
                )}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveAllergy(index)}
              className="absolute top-3 right-3"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {!noKnownAllergies && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddAllergy}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Allergy
          </Button>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Immunizations & Vaccines</h3>
        <p className="text-sm text-gray-600 mb-4">List your vaccination history.</p>
        
        {immunizations.map((immunization, index) => (
          <div key={index} className="flex items-start gap-2 mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
              <div className="space-y-2">
                <Label htmlFor={`vaccine-${index}`}>Vaccine</Label>
                <Select
                  value={immunization.vaccine}
                  onValueChange={(value) => handleUpdateImmunization(index, 'vaccine', value)}
                >
                  <SelectTrigger id={`vaccine-${index}`}>
                    <SelectValue placeholder="Select vaccine" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonVaccines.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {immunization.vaccine === "Other" && (
                  <Input
                    className="mt-2"
                    placeholder="Specify vaccine name"
                    value={immunization.otherVaccine || ''}
                    onChange={(e) => handleUpdateImmunization(index, 'otherVaccine', e.target.value)}
                  />
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`vaccine-date-${index}`} className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> Date Received
                </Label>
                <Input
                  id={`vaccine-date-${index}`}
                  type="date"
                  value={immunization.date}
                  onChange={(e) => handleUpdateImmunization(index, 'date', e.target.value)}
                />
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleRemoveImmunization(index)}
              className="flex-shrink-0 mt-7"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddImmunization}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Immunization
        </Button>
      </div>
    </div>
  );
};

export default MedicalProfileAllergiesForm;
