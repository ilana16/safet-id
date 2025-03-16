
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
import { Info, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#335B95]">Add {medicationInfo?.name} to Your Medications</DialogTitle>
          <DialogDescription className="text-gray-600">
            Please provide details about your use of this medication.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-5 py-4">
          {/* Main medication info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="bg-white p-2 rounded-full border border-blue-200">
                <div className="w-8 h-8 flex items-center justify-center text-[#335B95] font-bold text-xl">
                  {medicationInfo?.name?.charAt(0)?.toUpperCase() || 'M'}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-[#335B95]">{medicationInfo?.name}</h3>
                <p className="text-sm text-gray-600">{medicationInfo?.genericName || 'Generic name not available'}</p>
                <p className="text-xs mt-1 text-[#335B95]">{medicationInfo?.drugClass || 'Drug class not available'}</p>
              </div>
            </div>
          </div>
          
          {/* Form fields in two columns */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="medication-name" className="font-medium">Medication Name</Label>
              <Input
                id="medication-name"
                value={newMedication.name || ''}
                readOnly
                className="bg-gray-50 border-gray-300"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="medication-start-date" className="font-medium">Start Date</Label>
              <div className="relative">
                <Input
                  id="medication-start-date"
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                  className="pl-10 border-gray-300"
                />
                <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="medication-dosage" className="font-medium flex items-center">
                Dosage <span className="text-red-500">*</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                      <Info className="h-4 w-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm text-gray-600">
                      The amount of medication you take each time (e.g., 10mg, 500mg, etc.)
                    </p>
                  </PopoverContent>
                </Popover>
              </Label>
              <Input
                id="medication-dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                placeholder="e.g., 10mg, 500mg, etc."
                required
                className="border-gray-300"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="medication-frequency" className="font-medium flex items-center">
                Frequency <span className="text-red-500">*</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                      <Info className="h-4 w-4 text-gray-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm text-gray-600">
                      How often you take this medication
                    </p>
                  </PopoverContent>
                </Popover>
              </Label>
              <Select 
                value={newMedication.frequency}
                onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}
                required
              >
                <SelectTrigger id="medication-frequency" className="border-gray-300">
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
                  <SelectItem value="Custom">Custom schedule</SelectItem>
                </SelectContent>
              </Select>
              {newMedication.frequency === 'Custom' && (
                <Input
                  placeholder="Specify custom schedule"
                  value={newMedication.customFrequency || ''}
                  onChange={(e) => setNewMedication({...newMedication, customFrequency: e.target.value})}
                  className="mt-2 border-gray-300"
                />
              )}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="medication-reason" className="font-medium flex items-center">
              Reason for Taking <span className="text-red-500">*</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-sm text-gray-600">
                    The medical condition or symptoms this medication is treating
                  </p>
                </PopoverContent>
              </Popover>
            </Label>
            <Input
              id="medication-reason"
              value={newMedication.reason}
              onChange={(e) => setNewMedication({...newMedication, reason: e.target.value})}
              placeholder="e.g., High blood pressure, Diabetes, etc."
              required
              className="border-gray-300"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="medication-notes" className="font-medium">Notes</Label>
            <Textarea
              id="medication-notes"
              value={newMedication.notes || ''}
              onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
              placeholder="Any special instructions or additional information (optional)"
              rows={3}
              className="border-gray-300"
            />
          </div>
          
          {/* Information box about medication side effects */}
          {medicationInfo?.sideEffects && medicationInfo.sideEffects.length > 0 && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-sm">
              <h4 className="font-medium text-amber-800 mb-1">Common Side Effects</h4>
              <ul className="list-disc pl-5 text-amber-700 space-y-1">
                {medicationInfo.sideEffects.slice(0, 4).map((effect, idx) => (
                  <li key={idx}>{effect}</li>
                ))}
              </ul>
              <p className="text-xs mt-2 text-amber-600">
                This information is for reference only. Please consult with your healthcare provider about potential side effects.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitNewMedication} 
            className="bg-[#335B95] hover:bg-[#1A3C70]"
          >
            Add Medication
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicationAddForm;
