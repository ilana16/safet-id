
import React, { useState } from 'react';
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
  
  // State for additional notes
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // Handler for allergies
  const handleAddAllergy = () => {
    setAllergies([...allergies, { allergen: '', reaction: '', severity: '' }]);
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
        
        {allergies.length === 0 ? (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox id="no-known-allergies" />
              <Label htmlFor="no-known-allergies" className="text-sm cursor-pointer">
                No known allergies
              </Label>
            </div>
          </div>
        ) : null}
        
        {allergies.map((allergy, index) => (
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
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddAllergy}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Allergy
        </Button>
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
      
      <div>
        <h3 className="text-lg font-medium mb-4">Additional Notes</h3>
        <p className="text-sm text-gray-600 mb-2">Any other relevant information about allergies or immunization history.</p>
        
        <div className="space-y-2">
          <Label htmlFor="allergy-notes">Notes</Label>
          <Textarea
            id="allergy-notes"
            placeholder="Additional information to share with healthcare providers"
            className="w-full"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalProfileAllergiesForm;
