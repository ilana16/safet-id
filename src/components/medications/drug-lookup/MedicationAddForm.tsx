
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  PlusCircle, 
  Search, 
  Pill,
  AlertCircle 
} from 'lucide-react';
import { searchDrugsCom } from '@/utils/drugsComApi';
import { Medication } from '@/types/medication';
import { toast } from '@/lib/toast';

interface MedicationAddFormProps {
  onAddMedication: (medication: Medication) => void;
  onCancel: () => void;
}

const MedicationAddForm: React.FC<MedicationAddFormProps> = ({ onAddMedication, onCancel }) => {
  const [drugName, setDrugName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  
  const handleSearch = async () => {
    if (drugName.trim().length < 2) {
      toast.error('Please enter at least 2 characters to search');
      return;
    }
    
    setIsSearching(true);
    
    try {
      const results = await searchDrugsCom(drugName);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching medications:', error);
      toast.error('Failed to search medications');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMedication = (selectedName: string) => {
    // Generate URL for the selected drug
    const url = `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(selectedName)}`;
    
    // Create the medication object
    const newMedication: Medication = {
      id: `med_${Date.now()}`,
      name: selectedName,
      dosage: dosage,
      frequency: frequency,
      reason: reason,
      notes: notes,
      startDate: startDate,
      url: url,
      added_at: new Date().toISOString(),
      foodInteractions: [],
      conditionInteractions: [],
      therapeuticDuplications: []
    };
    
    // Call the parent handler
    onAddMedication(newMedication);
    
    // Reset form
    setDrugName('');
    setSearchResults([]);
    setNotes('');
    setReason('');
    setDosage('');
    setFrequency('');
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Add New Medication</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="drug-name">Medication Name</Label>
            <div className="flex gap-2">
              <Input 
                id="drug-name"
                value={drugName}
                onChange={(e) => setDrugName(e.target.value)}
                placeholder="Enter medication name"
                className="flex-1"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {searchResults.length > 0 && (
            <div className="border rounded-md p-2 max-h-60 overflow-y-auto">
              <h3 className="font-medium mb-2">Search Results</h3>
              <div className="space-y-1">
                {searchResults.map((result, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => {
                      setDrugName(result);
                      setSearchResults([]);
                    }}
                  >
                    <div className="flex items-center">
                      <Pill className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{result}</span>
                    </div>
                    <PlusCircle className="h-4 w-4 text-green-500" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input 
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 10mg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Input 
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g., Once daily with meals"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Taking</Label>
            <Input 
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., High Blood Pressure"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input 
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea 
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information about this medication"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              disabled={!drugName} 
              onClick={() => handleAddMedication(drugName)}
            >
              Add Medication
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationAddForm;
