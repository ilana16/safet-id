
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MedicationInfo } from '@/utils/medicationData';
import { Medication } from '@/pages/medical-profile/MedicationsSection';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const handleSubmitNewMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.reason) {
      toast.error('Please fill out all required fields');
      return;
    }

    if (onAddMedication && newMedication.name) {
      onAddMedication(newMedication as Medication);
      toast.success(`${newMedication.name} added to your medications`);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add {medicationInfo?.name} to Your Medications</DialogTitle>
          <DialogDescription>
            Please provide details about your use of this medication.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="medication-name">Medication Name</Label>
            <Input
              id="medication-name"
              value={newMedication.name || ''}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="medication-dosage">Dosage <span className="text-red-500">*</span></Label>
              <Input
                id="medication-dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                placeholder="e.g., 10mg"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="medication-frequency">Frequency <span className="text-red-500">*</span></Label>
              <Select 
                value={newMedication.frequency}
                onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}
                required
              >
                <SelectTrigger id="medication-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once daily">Once daily</SelectItem>
                  <SelectItem value="Twice daily">Twice daily</SelectItem>
                  <SelectItem value="Three times daily">Three times daily</SelectItem>
                  <SelectItem value="Four times daily">Four times daily</SelectItem>
                  <SelectItem value="Every morning">Every morning</SelectItem>
                  <SelectItem value="Every evening">Every evening</SelectItem>
                  <SelectItem value="As needed">As needed</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="medication-reason">Reason for Taking <span className="text-red-500">*</span></Label>
            <Input
              id="medication-reason"
              value={newMedication.reason}
              onChange={(e) => setNewMedication({...newMedication, reason: e.target.value})}
              placeholder="e.g., High blood pressure"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="medication-start-date">Start Date</Label>
            <Input
              id="medication-start-date"
              type="date"
              value={newMedication.startDate}
              onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="medication-notes">Notes</Label>
            <Textarea
              id="medication-notes"
              value={newMedication.notes || ''}
              onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
              placeholder="Any special instructions or notes"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitNewMedication} 
            className="bg-safet-500 hover:bg-safet-600"
          >
            Add Medication
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationAddForm;
