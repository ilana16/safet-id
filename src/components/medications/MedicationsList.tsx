
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  Edit, 
  Trash, 
  ClipboardX, 
  Pill, 
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Medication } from '@/pages/medical-profile/MedicationsSection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

interface MedicationsListProps {
  medications: Medication[];
  isEditing?: boolean;
  onUpdate?: (medication: Medication) => void;
  onDiscontinue?: (id: string, reason: string) => void;
  onDelete?: (id: string) => void;
}

const MedicationsList: React.FC<MedicationsListProps> = ({
  medications,
  isEditing = false,
  onUpdate,
  onDiscontinue,
  onDelete
}) => {
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDiscontinueDialogOpen, setIsDiscontinueDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [discontinueReason, setDiscontinueReason] = useState('');
  const [medicationToDiscontinue, setMedicationToDiscontinue] = useState<string | null>(null);
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  const handleEditMedication = (medication: Medication) => {
    setEditingMedication({ ...medication });
    setIsEditDialogOpen(true);
  };

  const handleUpdateMedication = () => {
    if (editingMedication && onUpdate) {
      onUpdate(editingMedication);
    }
    setIsEditDialogOpen(false);
  };

  const handleOpenDiscontinueDialog = (id: string) => {
    setMedicationToDiscontinue(id);
    setDiscontinueReason('');
    setIsDiscontinueDialogOpen(true);
  };

  const handleDiscontinueMedication = () => {
    if (medicationToDiscontinue && onDiscontinue) {
      onDiscontinue(medicationToDiscontinue, discontinueReason);
    }
    setIsDiscontinueDialogOpen(false);
    setMedicationToDiscontinue(null);
    setDiscontinueReason('');
  };

  const handleOpenDeleteDialog = (id: string) => {
    setMedicationToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMedication = () => {
    if (medicationToDelete && onDelete) {
      onDelete(medicationToDelete);
    }
    setIsDeleteDialogOpen(false);
    setMedicationToDelete(null);
  };

  const handleChange = (field: keyof Medication, value: string) => {
    setEditingMedication(prev => prev ? { ...prev, [field]: value } : null);
  };

  const toggleNotes = (id: string) => {
    setExpandedNotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleDetails = (id: string) => {
    setExpandedDetailsId(expandedDetailsId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {medications.length === 0 ? (
        <Card>
          <CardContent className="py-6 flex flex-col items-center justify-center text-center">
            <Pill className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">No medications added yet</p>
            {isEditing && (
              <p className="text-sm text-muted-foreground">
                Click "Add Medication" to start building your medication list
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        medications.map(med => (
          <Card key={med.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Pill className="h-5 w-5 text-safet-500" />
                    <h3 className="font-medium">{med.name}</h3>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {med.dosage && <span className="mr-4">{med.dosage}</span>}
                    {med.frequency && (
                      <span className="flex items-center gap-1 mr-4">
                        <Clock className="h-3.5 w-3.5" />
                        {med.frequency === 'Other' && med.customFrequency ? med.customFrequency : med.frequency}
                      </span>
                    )}
                  </div>
                  {med.reason && (
                    <div className="mt-1 text-sm text-gray-600">
                      For: {med.reason}
                    </div>
                  )}
                  {med.notes && (
                    <div className="mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs flex items-center gap-1 text-safet-600"
                        onClick={() => toggleNotes(med.id)}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Notes {expandedNotes[med.id] ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </Button>
                      
                      {expandedNotes[med.id] && (
                        <div className="mt-2 pl-2 border-l-2 border-safet-200 text-sm">
                          {med.notes}
                        </div>
                      )}
                    </div>
                  )}

                  {(med.foodInteractions?.length > 0 || 
                   med.conditionInteractions?.length > 0 || 
                   med.therapeuticDuplications?.length > 0) && (
                    <div className="mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs flex items-center gap-1 text-amber-600"
                        onClick={() => toggleDetails(med.id)}
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        Additional Information {expandedDetailsId === med.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </Button>
                      
                      {expandedDetailsId === med.id && (
                        <div className="mt-2">
                          <Accordion type="single" collapsible className="w-full">
                            {med.foodInteractions && med.foodInteractions.length > 0 && (
                              <AccordionItem value="food">
                                <AccordionTrigger className="py-2 text-xs">
                                  Food Interactions
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ScrollArea className="h-24">
                                    <ul className="list-disc pl-5 text-xs space-y-1 text-gray-600">
                                      {med.foodInteractions.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                      ))}
                                    </ul>
                                  </ScrollArea>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {med.conditionInteractions && med.conditionInteractions.length > 0 && (
                              <AccordionItem value="condition">
                                <AccordionTrigger className="py-2 text-xs">
                                  Medical Condition Interactions
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ScrollArea className="h-24">
                                    <ul className="list-disc pl-5 text-xs space-y-1 text-gray-600">
                                      {med.conditionInteractions.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                      ))}
                                    </ul>
                                  </ScrollArea>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {med.therapeuticDuplications && med.therapeuticDuplications.length > 0 && (
                              <AccordionItem value="duplications">
                                <AccordionTrigger className="py-2 text-xs">
                                  Therapeutic Duplications
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ScrollArea className="h-24">
                                    <ul className="list-disc pl-5 text-xs space-y-1 text-gray-600">
                                      {med.therapeuticDuplications.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                      ))}
                                    </ul>
                                  </ScrollArea>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {med.pregnancy && (
                              <AccordionItem value="pregnancy">
                                <AccordionTrigger className="py-2 text-xs">
                                  Pregnancy
                                </AccordionTrigger>
                                <AccordionContent>
                                  <p className="text-xs text-gray-600">{med.pregnancy}</p>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            {med.breastfeeding && (
                              <AccordionItem value="breastfeeding">
                                <AccordionTrigger className="py-2 text-xs">
                                  Breastfeeding
                                </AccordionTrigger>
                                <AccordionContent>
                                  <p className="text-xs text-gray-600">{med.breastfeeding}</p>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                          </Accordion>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditMedication(med)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenDiscontinueDialog(med.id)}>
                        <ClipboardX className="h-4 w-4 mr-2" />
                        Discontinue
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenDeleteDialog(med.id)} className="text-red-600 focus:text-red-600">
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              <div className="px-4 pb-2">
                <div className="text-xs flex items-center gap-1 text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Started: {new Date(med.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      
      {/* Edit Medication Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
          </DialogHeader>
          {editingMedication && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  value={editingMedication.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  value={editingMedication.dosage}
                  onChange={(e) => handleChange('dosage', e.target.value)}
                  placeholder="e.g., 500mg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={editingMedication.frequency}
                  onValueChange={(value) => {
                    handleChange('frequency', value);
                    if (value !== 'Other') {
                      handleChange('customFrequency', '');
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
                {editingMedication.frequency === 'Other' && (
                  <Input
                    className="mt-2"
                    placeholder="Specify custom frequency"
                    value={editingMedication.customFrequency || ''}
                    onChange={(e) => handleChange('customFrequency', e.target.value)}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Taking</Label>
                <Textarea
                  id="reason"
                  value={editingMedication.reason}
                  onChange={(e) => handleChange('reason', e.target.value)}
                  placeholder="e.g., To control blood pressure"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editingMedication.startDate}
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
                  value={editingMedication.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Add any additional notes about this medication"
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateMedication}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Discontinue Medication Dialog */}
      <AlertDialog open={isDiscontinueDialogOpen} onOpenChange={setIsDiscontinueDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discontinue Medication</AlertDialogTitle>
            <AlertDialogDescription>
              This will move the medication to your discontinued medications list. You can provide a reason for discontinuation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="discontinueReason">Reason for discontinuation</Label>
            <Textarea
              id="discontinueReason"
              value={discontinueReason}
              onChange={(e) => setDiscontinueReason(e.target.value)}
              placeholder="e.g., Side effects, doctor's advice, etc."
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDiscontinueMedication} className="bg-amber-500 hover:bg-amber-600">
              Discontinue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Delete Medication Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this medication? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMedication} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MedicationsList;
