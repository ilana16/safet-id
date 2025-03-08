
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

const MedicalProfileHistoryForm = () => {
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [surgeries, setSurgeries] = useState<Array<{procedure: string, year: string}>>([]);
  const [hospitalization, setHospitalization] = useState<Array<{reason: string, year: string}>>([]);
  
  // Common medical conditions for checkbox selection
  const commonConditions = [
    "Hypertension (High Blood Pressure)",
    "Diabetes",
    "Asthma",
    "Heart Disease",
    "Stroke",
    "Cancer",
    "Arthritis",
    "Depression/Anxiety",
    "Thyroid Disorder",
    "COPD",
    "Kidney Disease",
    "Liver Disease",
  ];

  const handleAddCondition = () => {
    if (newCondition.trim() !== '') {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const handleAddSurgery = () => {
    setSurgeries([...surgeries, { procedure: '', year: '' }]);
  };

  const handleUpdateSurgery = (index: number, field: 'procedure' | 'year', value: string) => {
    const updatedSurgeries = [...surgeries];
    updatedSurgeries[index][field] = value;
    setSurgeries(updatedSurgeries);
  };

  const handleRemoveSurgery = (index: number) => {
    setSurgeries(surgeries.filter((_, i) => i !== index));
  };

  const handleAddHospitalization = () => {
    setHospitalization([...hospitalization, { reason: '', year: '' }]);
  };

  const handleUpdateHospitalization = (index: number, field: 'reason' | 'year', value: string) => {
    const updatedHospitalizations = [...hospitalization];
    updatedHospitalizations[index][field] = value;
    setHospitalization(updatedHospitalizations);
  };

  const handleRemoveHospitalization = (index: number) => {
    setHospitalization(hospitalization.filter((_, i) => i !== index));
  };

  const toggleCondition = (condition: string) => {
    if (conditions.includes(condition)) {
      setConditions(conditions.filter(c => c !== condition));
    } else {
      setConditions([...conditions, condition]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Medical Conditions</h3>
        <p className="text-sm text-gray-600 mb-4">Select any conditions that apply:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-4">
          {commonConditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox 
                id={`condition-${condition}`} 
                checked={conditions.includes(condition)}
                onCheckedChange={() => toggleCondition(condition)}
              />
              <Label 
                htmlFor={`condition-${condition}`} 
                className="text-sm cursor-pointer"
              >
                {condition}
              </Label>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Label htmlFor="other-condition" className="text-sm">Other condition not listed:</Label>
          <div className="flex gap-2 mt-1">
            <Input 
              id="other-condition" 
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              placeholder="Enter other condition"
              className="flex-grow"
            />
            <Button 
              type="button" 
              onClick={handleAddCondition}
              disabled={!newCondition.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
          
          {conditions.filter(c => !commonConditions.includes(c)).length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-gray-700">Added conditions:</p>
              <ul className="text-sm pl-5 list-disc space-y-1">
                {conditions.filter(c => !commonConditions.includes(c)).map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Surgical History</h3>
        
        {surgeries.length === 0 ? (
          <p className="text-sm text-gray-600 mb-2">No surgeries added yet.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {surgeries.map((surgery, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                  <Input
                    value={surgery.procedure}
                    onChange={(e) => handleUpdateSurgery(index, 'procedure', e.target.value)}
                    placeholder="Procedure name"
                  />
                  <Input
                    value={surgery.year}
                    onChange={(e) => handleUpdateSurgery(index, 'year', e.target.value)}
                    placeholder="Year (e.g., 2020)"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleRemoveSurgery(index)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddSurgery}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Surgery
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Hospitalization History</h3>
        
        {hospitalization.length === 0 ? (
          <p className="text-sm text-gray-600 mb-2">No hospitalizations added yet.</p>
        ) : (
          <div className="space-y-3 mb-4">
            {hospitalization.map((hospital, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                  <Input
                    value={hospital.reason}
                    onChange={(e) => handleUpdateHospitalization(index, 'reason', e.target.value)}
                    placeholder="Reason for hospitalization"
                  />
                  <Input
                    value={hospital.year}
                    onChange={(e) => handleUpdateHospitalization(index, 'year', e.target.value)}
                    placeholder="Year (e.g., 2020)"
                    type="number" 
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleRemoveHospitalization(index)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAddHospitalization}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Hospitalization
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Family Medical History</h3>
        <p className="text-sm text-gray-600 mb-4">Please provide information about significant medical conditions in your immediate family (parents, siblings, children).</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="familyHistory">Family Health History</Label>
            <Input 
              id="familyHistory" 
              placeholder="e.g., Mother: Diabetes, Father: Heart Disease" 
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalProfileHistoryForm;
