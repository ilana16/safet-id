
import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MedicationInfo } from '@/utils/medicationData.d';
import { Medication } from '@/types/medication';

interface MedicationAddFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMedication: (medication: Medication) => void;
  newMedication: Partial<Medication>;
  setNewMedication: React.Dispatch<React.SetStateAction<Partial<Medication>>>;
  medicationInfo: MedicationInfo;
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
  'Once a month',
  'As needed',
  'Other'
];

const MedicationAddForm: React.FC<MedicationAddFormProps> = ({
  open,
  onOpenChange,
  onAddMedication,
  newMedication,
  setNewMedication,
  medicationInfo
}) => {
  const handleAddMedication = () => {
    const finalMedication = {
      ...newMedication,
      name: medicationInfo.name,
      url: medicationInfo.drugsComUrl || `https://www.drugs.com/${medicationInfo.name.toLowerCase().replace(/\s+/g, '-')}.html`,
      foodInteractions: medicationInfo.foodInteractions || [],
      conditionInteractions: medicationInfo.conditionInteractions || [],
      therapeuticDuplications: medicationInfo.therapeuticDuplications || [],
      pregnancy: medicationInfo.pregnancy || '',
      breastfeeding: medicationInfo.breastfeeding || '',
      added_at: new Date().toISOString()
    } as Medication;
    
    onAddMedication(finalMedication);
  };

  const updateField = (field: keyof Medication, value: string) => {
    setNewMedication(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add {medicationInfo.name} to My Medications</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dosage" className="text-right">
              Dosage
            </Label>
            <Input
              id="dosage"
              value={newMedication.dosage || ''}
              onChange={(e) => updateField('dosage', e.target.value)}
              placeholder="e.g., 10mg"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <Select 
              value={newMedication.frequency || 'Once daily'} 
              onValueChange={(value) => updateField('frequency', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {newMedication.frequency === 'Other' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customFrequency" className="text-right">
                Custom Frequency
              </Label>
              <Input
                id="customFrequency"
                value={newMedication.customFrequency || ''}
                onChange={(e) => updateField('customFrequency', e.target.value)}
                placeholder="Specify custom frequency"
                className="col-span-3"
              />
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={newMedication.startDate || new Date().toISOString().split('T')[0]}
              onChange={(e) => updateField('startDate', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={newMedication.endDate || ''}
              onChange={(e) => updateField('endDate', e.target.value)}
              className="col-span-3"
              min={newMedication.startDate || new Date().toISOString().split('T')[0]}
              placeholder="Optional"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Input
              id="reason"
              value={newMedication.reason || ''}
              onChange={(e) => updateField('reason', e.target.value)}
              placeholder="Why are you taking this medication?"
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={newMedication.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Any additional notes"
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddMedication} disabled={!newMedication.dosage}>
            Add to My Medications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationAddForm;
