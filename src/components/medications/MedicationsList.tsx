
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Edit, XCircle, Calendar, Clock, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Medication } from '@/pages/medical-profile/MedicationsSection';
import { formatDistanceToNow } from 'date-fns';

interface MedicationsListProps {
  medications: Medication[];
  isEditing: boolean;
  onUpdate: (medication: Medication) => void;
  onDiscontinue: (id: string, reason: string) => void;
  onDelete: (id: string) => void;
}

const MedicationsList: React.FC<MedicationsListProps> = ({ 
  medications, 
  isEditing,
  onUpdate,
  onDiscontinue,
  onDelete
}) => {
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [discontinuingMedication, setDiscontinuingMedication] = useState<Medication | null>(null);
  const [discontinueReason, setDiscontinueReason] = useState('');

  const handleSaveEdit = () => {
    if (editingMedication) {
      onUpdate(editingMedication);
      setEditingMedication(null);
    }
  };

  const handleDiscontinue = () => {
    if (discontinuingMedication) {
      onDiscontinue(discontinuingMedication.id, discontinueReason);
      setDiscontinuingMedication(null);
      setDiscontinueReason('');
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <div className="space-y-4">
      {medications.map((medication) => (
        <Card key={medication.id} className="border-l-4 border-l-safet-500">
          <CardHeader className="py-4 px-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-safet-600" />
                <CardTitle className="text-lg font-medium">{medication.name}</CardTitle>
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingMedication(medication)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive border-destructive hover:bg-destructive/10"
                    onClick={() => setDiscontinuingMedication(medication)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Discontinue
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mt-1">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {medication.dosage}
                  </Badge>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{medication.frequency}</span>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span><strong>For:</strong> {medication.reason}</span>
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span><strong>Started:</strong> {medication.startDate} ({getTimeAgo(medication.startDate)})</span>
                </p>
                
                {medication.notes && (
                  <p className="text-sm text-gray-700 mt-2 italic">
                    "{medication.notes}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Medication Dialog */}
      <Dialog open={!!editingMedication} onOpenChange={(open) => !open && setEditingMedication(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
            <DialogDescription>
              Update the details of your medication below.
            </DialogDescription>
          </DialogHeader>
          
          {editingMedication && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="medication-name">Medication Name</Label>
                <Input
                  id="medication-name"
                  value={editingMedication.name}
                  onChange={(e) => setEditingMedication({...editingMedication, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="medication-dosage">Dosage</Label>
                  <Input
                    id="medication-dosage"
                    value={editingMedication.dosage}
                    onChange={(e) => setEditingMedication({...editingMedication, dosage: e.target.value})}
                    placeholder="e.g., 10mg"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="medication-frequency">Frequency</Label>
                  <Select 
                    value={editingMedication.frequency}
                    onValueChange={(value) => setEditingMedication({...editingMedication, frequency: value})}
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
                <Label htmlFor="medication-reason">Reason for Taking</Label>
                <Input
                  id="medication-reason"
                  value={editingMedication.reason}
                  onChange={(e) => setEditingMedication({...editingMedication, reason: e.target.value})}
                  placeholder="e.g., High blood pressure"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="medication-start-date">Start Date</Label>
                <Input
                  id="medication-start-date"
                  type="date"
                  value={editingMedication.startDate}
                  onChange={(e) => setEditingMedication({...editingMedication, startDate: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="medication-notes">Notes</Label>
                <Textarea
                  id="medication-notes"
                  value={editingMedication.notes || ''}
                  onChange={(e) => setEditingMedication({...editingMedication, notes: e.target.value})}
                  placeholder="Any special instructions or notes"
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMedication(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-safet-500 hover:bg-safet-600">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discontinue Medication Dialog */}
      <Dialog open={!!discontinuingMedication} onOpenChange={(open) => !open && setDiscontinuingMedication(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Discontinue Medication</DialogTitle>
            <DialogDescription>
              Please provide a reason for discontinuing {discontinuingMedication?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="discontinue-reason">Reason for Discontinuing</Label>
              <Select 
                value={discontinueReason}
                onValueChange={setDiscontinueReason}
              >
                <SelectTrigger id="discontinue-reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed treatment">Completed treatment</SelectItem>
                  <SelectItem value="Side effects">Side effects</SelectItem>
                  <SelectItem value="Not effective">Not effective</SelectItem>
                  <SelectItem value="Doctor's recommendation">Doctor's recommendation</SelectItem>
                  <SelectItem value="Replaced with another medication">Replaced with another medication</SelectItem>
                  <SelectItem value="No longer needed">No longer needed</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {discontinueReason === 'Other' && (
              <div className="grid gap-2">
                <Label htmlFor="other-reason">Specify Reason</Label>
                <Input
                  id="other-reason"
                  placeholder="Enter reason"
                  onChange={(e) => setDiscontinueReason(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDiscontinuingMedication(null);
              setDiscontinueReason('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleDiscontinue}
              className="bg-destructive hover:bg-destructive/90"
              disabled={!discontinueReason}
            >
              Discontinue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationsList;
