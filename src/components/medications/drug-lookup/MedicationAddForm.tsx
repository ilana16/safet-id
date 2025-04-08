import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';
import { MedicationInfo } from '@/utils/medicationData.d';
import { Medication } from '@/types/medication';
import { Checkbox } from '@/components/ui/checkbox';

interface MedicationAddFormProps {
  medicationInfo: MedicationInfo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMedication: (medication: Medication) => void;
  newMedication: Partial<Medication>;
  setNewMedication: React.Dispatch<React.SetStateAction<Partial<Medication>>>;
}

const frequencyOptions = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every morning',
  'Every evening',
  'Every night at bedtime',
  'Every 4 hours',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'Once a week',
  'Twice a week',
  'X days a week',
  'Once a month',
  'Every X days',
  'As needed',
  'Other'
];

const daysOfWeek = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

const MedicationAddForm: React.FC<MedicationAddFormProps> = ({
  medicationInfo,
  open,
  onOpenChange,
  onAddMedication,
  newMedication,
  setNewMedication
}) => {
  const handleChange = (field: keyof Medication, value: string) => {
    setNewMedication(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMedication.name) {
      return;
    }
    
    const medication: Medication = {
      id: newMedication.id || `med_${Date.now()}`,
      name: newMedication.name || medicationInfo.name,
      dosage: newMedication.dosage || '',
      frequency: newMedication.frequency || 'Once daily',
      customFrequency: newMedication.customFrequency,
      customDays: newMedication.customDays,
      selectedDaysOfWeek: newMedication.selectedDaysOfWeek || [],
      reason: newMedication.reason || '',
      startDate: newMedication.startDate || new Date().toISOString().split('T')[0],
      notes: newMedication.notes || '',
      foodInteractions: newMedication.foodInteractions || [],
      conditionInteractions: newMedication.conditionInteractions || [],
      therapeuticDuplications: newMedication.therapeuticDuplications || [],
      interactionClassifications: {
        ...(medicationInfo.interactionClassifications ? 
          Object.fromEntries(
            Object.entries(medicationInfo.interactionClassifications).map(
              ([key, value]) => [key, Array.isArray(value) ? value.join(', ') : value]
            )
          ) : {}
        )
      },
      pregnancy: medicationInfo.pregnancy,
      breastfeeding: medicationInfo.breastfeeding,
    };
    
    onAddMedication(medication);
  };
  
  const handleDayOfWeekToggle = (day: string) => {
    setNewMedication(prev => {
      const selectedDays = prev.selectedDaysOfWeek || [];
      if (selectedDays.includes(day)) {
        return {
          ...prev,
          selectedDaysOfWeek: selectedDays.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          selectedDaysOfWeek: [...selectedDays, day]
        };
      }
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add {medicationInfo.name} to Your Medications</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              placeholder="e.g., 500mg"
              value={newMedication.dosage}
              onChange={(e) => handleChange('dosage', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={newMedication.frequency}
              onValueChange={(value) => {
                handleChange('frequency', value);
                if (value !== 'Other' && value !== 'Every X days' && value !== 'X days a week') {
                  handleChange('customFrequency', '');
                  handleChange('customDays', '');
                  setNewMedication(prev => ({
                    ...prev,
                    selectedDaysOfWeek: []
                  }));
                }
              }}
            >
              <SelectTrigger id="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {newMedication.frequency === 'Every X days' && (
              <div className="mt-2">
                <Label htmlFor="customDays">Number of days</Label>
                <Input
                  id="customDays"
                  type="number"
                  min="1"
                  placeholder="Enter number of days"
                  value={newMedication.customDays || ''}
                  onChange={(e) => handleChange('customDays', e.target.value)}
                />
              </div>
            )}
            
            {newMedication.frequency === 'X days a week' && (
              <div className="mt-2 space-y-2">
                <Label>Select days of the week</Label>
                <div className="grid grid-cols-2 gap-2">
                  {daysOfWeek.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={day.id} 
                        checked={(newMedication.selectedDaysOfWeek || []).includes(day.id)}
                        onCheckedChange={() => handleDayOfWeekToggle(day.id)}
                      />
                      <Label htmlFor={day.id} className="text-sm font-normal cursor-pointer">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {newMedication.frequency === 'Other' && (
              <Input
                className="mt-2"
                placeholder="Specify custom frequency"
                value={newMedication.customFrequency || ''}
                onChange={(e) => handleChange('customFrequency', e.target.value)}
              />
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Taking</Label>
            <Textarea
              id="reason"
              placeholder="e.g., To control blood pressure"
              value={newMedication.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={newMedication.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this medication"
              value={newMedication.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add to My Medications
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationAddForm;
