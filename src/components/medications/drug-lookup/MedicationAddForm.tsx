
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { MedicationInfo } from '@/utils/medicationData';
import { Medication } from '@/pages/medical-profile/MedicationsSection';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MedicationAddFormProps {
  medicationInfo: MedicationInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMedication: (medication: Medication) => void;
  newMedication: Partial<Medication>;
  setNewMedication: React.Dispatch<React.SetStateAction<Partial<Medication>>>;
}

const MedicationAddForm: React.FC<MedicationAddFormProps> = ({
  medicationInfo,
  open,
  onOpenChange,
  onAddMedication,
  newMedication,
  setNewMedication
}) => {
  const [customFrequency, setCustomFrequency] = useState<boolean>(false);
  const [sideEffectsShown, setSideEffectsShown] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'frequency' && value === 'custom') {
      setCustomFrequency(true);
      setNewMedication(prev => ({ ...prev, frequency: '' }));
    } else {
      if (name === 'frequency') {
        setCustomFrequency(false);
      }
      setNewMedication(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency || !newMedication.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Make sure we have an ID
    if (!newMedication.id) {
      setNewMedication(prev => ({ ...prev, id: uuidv4() }));
    }

    try {
      onAddMedication(newMedication as Medication);
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error('Failed to add medication. Please try again.');
    }
  };

  // Prepare prescription-only warning
  const prescriptionWarning = medicationInfo.prescriptionOnly ? (
    <Alert className="mt-4 bg-amber-50 text-amber-800 border-amber-200">
      <AlertCircle className="h-4 w-4 text-amber-800" />
      <AlertDescription className="text-xs">
        This is a prescription-only medication. Do not take without proper medical supervision.
      </AlertDescription>
    </Alert>
  ) : null;

  // Get dosage guidance
  const dosageGuidance = (
    <div className="text-xs text-gray-600 mt-1">
      <p className="font-semibold">Suggested dosage:</p>
      <p>{medicationInfo.dosage.adult}</p>
      {medicationInfo.dosage.frequency && (
        <p className="mt-1"><span className="font-semibold">Frequency:</span> {medicationInfo.dosage.frequency}</p>
      )}
    </div>
  );

  // Get side effects for tooltip
  const getSideEffects = () => {
    let effectsList = [];
    
    if (medicationInfo.sideEffects.common && medicationInfo.sideEffects.common.length > 0) {
      const commonEffects = medicationInfo.sideEffects.common.slice(0, 3).join(", ");
      effectsList.push(`Common: ${commonEffects}`);
    }
    
    if (medicationInfo.sideEffects.serious && medicationInfo.sideEffects.serious.length > 0) {
      const seriousEffects = medicationInfo.sideEffects.serious.slice(0, 2).join(", ");
      effectsList.push(`Serious: ${seriousEffects}`);
    }
    
    return effectsList.join("\n");
  };

  // Format for full side effects display
  const formatSideEffectsList = () => {
    return (
      <div className="space-y-3 p-2">
        {medicationInfo.sideEffects.common && medicationInfo.sideEffects.common.length > 0 && (
          <div>
            <p className="font-semibold text-xs text-gray-700">Common Side Effects:</p>
            <ul className="list-disc pl-4 text-xs text-gray-600">
              {medicationInfo.sideEffects.common.map((effect, i) => (
                <li key={`common-${i}`}>{effect}</li>
              ))}
            </ul>
          </div>
        )}
        
        {medicationInfo.sideEffects.serious && medicationInfo.sideEffects.serious.length > 0 && (
          <div>
            <p className="font-semibold text-xs text-red-700">Serious Side Effects:</p>
            <ul className="list-disc pl-4 text-xs text-red-600">
              {medicationInfo.sideEffects.serious.map((effect, i) => (
                <li key={`serious-${i}`}>{effect}</li>
              ))}
            </ul>
          </div>
        )}
        
        {medicationInfo.sideEffects.rare && medicationInfo.sideEffects.rare.length > 0 && (
          <div>
            <p className="font-semibold text-xs text-gray-700">Rare Side Effects:</p>
            <ul className="list-disc pl-4 text-xs text-gray-600">
              {medicationInfo.sideEffects.rare.map((effect, i) => (
                <li key={`rare-${i}`}>{effect}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            Add {medicationInfo.name} to My Medications
            {medicationInfo.prescriptionOnly && (
              <span className="ml-2 bg-amber-100 text-amber-800 text-xs py-0.5 px-2 rounded-full">
                Prescription Only
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <form className="space-y-4 pt-2">
          <input type="hidden" name="id" value={newMedication.id || uuidv4()} />
          <input type="hidden" name="name" value={medicationInfo.name} />
          
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="mb-1"><span className="font-semibold">Generic name:</span> {medicationInfo.genericName || medicationInfo.name}</p>
              <p className="mb-1"><span className="font-semibold">Drug class:</span> {medicationInfo.drugClass || 'Not specified'}</p>
              <p>{medicationInfo.description}</p>
            </div>
            
            {prescriptionWarning}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dosage" className="text-sm font-medium">
                    Dosage
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5">
                          <HelpCircle className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        {dosageGuidance}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="dosage"
                  name="dosage"
                  value={newMedication.dosage || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. 20mg, 500mg, 5ml"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency" className="text-sm font-medium">
                  How often do you take it?
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <div className="flex gap-2">
                  {!customFrequency ? (
                    <Select
                      value={newMedication.frequency || ''}
                      onValueChange={(value) => handleSelectChange('frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Once daily">Once daily</SelectItem>
                        <SelectItem value="Twice daily">Twice daily</SelectItem>
                        <SelectItem value="Three times daily">Three times daily</SelectItem>
                        <SelectItem value="Four times daily">Four times daily</SelectItem>
                        <SelectItem value="Every morning">Every morning</SelectItem>
                        <SelectItem value="Every evening">Every evening</SelectItem>
                        <SelectItem value="Every other day">Every other day</SelectItem>
                        <SelectItem value="Once weekly">Once weekly</SelectItem>
                        <SelectItem value="As needed">As needed</SelectItem>
                        <SelectItem value="custom">Custom frequency...</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="customFrequency"
                      name="frequency"
                      value={newMedication.frequency || ''}
                      onChange={handleInputChange}
                      placeholder="Enter custom frequency"
                      className="flex-1"
                    />
                  )}
                  
                  {customFrequency && (
                    <Button 
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => {
                        setCustomFrequency(false);
                        setNewMedication(prev => ({ ...prev, frequency: 'Once daily' }));
                      }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium">
                  What are you taking it for?
                </Label>
                <Input
                  id="reason"
                  name="reason"
                  value={newMedication.reason || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. High blood pressure, Diabetes"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium">
                  Start date
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={newMedication.startDate || ''}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Notes (optional)
                </Label>
                <Popover open={sideEffectsShown} onOpenChange={setSideEffectsShown}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                      View Side Effects
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Side Effects of {medicationInfo.name}</h4>
                      {formatSideEffectsList()}
                      <div className="pt-2 text-xs text-gray-500">
                        Source: {medicationInfo.source || 'Unknown'}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Textarea
                id="notes"
                name="notes"
                value={newMedication.notes || ''}
                onChange={handleInputChange}
                placeholder="Add any notes about this medication (e.g., take with food, specific times, etc.)"
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Add any special instructions or notes about how you take this medication.
              </p>
            </div>
          </div>
        </form>
        
        <DialogFooter className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-safet-600 hover:bg-safet-700"
            onClick={handleSubmit}
          >
            Add to My Medications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationAddForm;
