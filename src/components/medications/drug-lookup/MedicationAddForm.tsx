
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Medication } from '@/pages/medical-profile/MedicationsSection';
import { MedicationInfo } from '@/utils/medicationData';
import { toast } from 'sonner';

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setNewMedication(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[field]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newMedication.dosage || newMedication.dosage.trim() === '') {
      errors.dosage = 'Dosage is required';
    }
    
    if (!newMedication.frequency || newMedication.frequency.trim() === '') {
      errors.frequency = 'Frequency is required';
    }
    
    if (!newMedication.reason || newMedication.reason.trim() === '') {
      errors.reason = 'Reason for taking is required';
    }
    
    if (!newMedication.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const medicationToAdd: Medication = {
        id: newMedication.id || '',
        name: medicationInfo.name,
        dosage: newMedication.dosage || '',
        frequency: newMedication.frequency || '',
        customFrequency: newMedication.customFrequency,
        reason: newMedication.reason || '',
        startDate: newMedication.startDate || new Date().toISOString().split('T')[0],
        endDate: newMedication.endDate,
        notes: newMedication.notes,
        discontinued: false
      };
      
      onAddMedication(medicationToAdd);
    } catch (error) {
      console.error('Error adding medication:', error);
      toast.error('Failed to add medication');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add {medicationInfo.name} to Your Medications</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dosage">
              Dosage <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dosage"
              placeholder="e.g. 10mg, 1 tablet, 2 pills"
              value={newMedication.dosage || ''}
              onChange={(e) => handleChange('dosage', e.target.value)}
              className={formErrors.dosage ? 'border-red-500' : ''}
            />
            {formErrors.dosage && (
              <p className="text-red-500 text-sm">{formErrors.dosage}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">
              Frequency <span className="text-red-500">*</span>
            </Label>
            <Select
              value={newMedication.frequency || ''}
              onValueChange={(value) => handleChange('frequency', value)}
            >
              <SelectTrigger
                id="frequency"
                className={formErrors.frequency ? 'border-red-500' : ''}
              >
                <SelectValue placeholder="Select how often you take it" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Once daily">Once daily</SelectItem>
                <SelectItem value="Twice daily">Twice daily</SelectItem>
                <SelectItem value="Three times daily">Three times daily</SelectItem>
                <SelectItem value="Four times daily">Four times daily</SelectItem>
                <SelectItem value="Every morning">Every morning</SelectItem>
                <SelectItem value="Every evening">Every evening</SelectItem>
                <SelectItem value="As needed">As needed (PRN)</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="custom">Custom frequency</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.frequency && (
              <p className="text-red-500 text-sm">{formErrors.frequency}</p>
            )}
            
            {newMedication.frequency === 'custom' && (
              <Input
                id="customFrequency"
                placeholder="Enter custom frequency"
                value={newMedication.customFrequency || ''}
                onChange={(e) => handleChange('customFrequency', e.target.value)}
              />
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for taking <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="What condition is this medication treating?"
              value={newMedication.reason || ''}
              onChange={(e) => handleChange('reason', e.target.value)}
              className={formErrors.reason ? 'border-red-500' : ''}
            />
            {formErrors.reason && (
              <p className="text-red-500 text-sm">{formErrors.reason}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={newMedication.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={formErrors.startDate ? 'border-red-500' : ''}
              />
              {formErrors.startDate && (
                <p className="text-red-500 text-sm">{formErrors.startDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (if applicable)</Label>
              <Input
                id="endDate"
                type="date"
                value={newMedication.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
                min={newMedication.startDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about this medication"
              value={newMedication.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-safet-500 hover:bg-safet-600"
            >
              Add to My Medications
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationAddForm;
