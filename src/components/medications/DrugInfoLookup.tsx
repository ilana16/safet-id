import React, { useState, useEffect } from 'react';
import { searchDrugsCom, getDrugsComInfo, getDrugsComUrl } from '@/utils/drugsComApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, Loader2, PillIcon, Pill, ExternalLink, PlusCircle } from 'lucide-react';
import MedicationInfo from './MedicationInfo';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Medication } from '@/pages/medical-profile/MedicationsSection';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DrugInfoLookupProps {
  onAddMedication?: (medication: Medication) => void;
}

const DrugInfoLookup: React.FC<DrugInfoLookupProps> = ({ onAddMedication }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [medicationInfo, setMedicationInfo] = useState<MedicationInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    id: uuidv4(),
    dosage: '',
    frequency: 'Once daily',
    reason: '',
    startDate: new Date().toISOString().split('T')[0],
  });
  
  useEffect(() => {
    const savedHistory = localStorage.getItem('medicationSearchHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing medication search history:', e);
      }
    }
  }, []);
  
  const saveHistory = (medication: string) => {
    let newHistory = [...history];
    
    newHistory = newHistory.filter(item => item !== medication);
    
    newHistory.unshift(medication);
    
    newHistory = newHistory.slice(0, 5);
    
    setHistory(newHistory);
    localStorage.setItem('medicationSearchHistory', JSON.stringify(newHistory));
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchDrugsCom(value);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching medications:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 2) return;
    
    setIsLoading(true);
    
    try {
      const results = await searchDrugsCom(query);
      setSearchResults(results);
      
      if (results.length === 1 && results[0].toLowerCase() === query.toLowerCase()) {
        await selectMedication(results[0]);
      }
    } catch (error) {
      console.error('Error searching medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectMedication = async (medication: string) => {
    setSelectedMedication(medication);
    setIsLoading(true);
    saveHistory(medication);
    
    try {
      const info = await getDrugsComInfo(medication);
      setMedicationInfo(info);
      setNewMedication({
        ...newMedication,
        name: info.name
      });
      toast.success(`Information loaded from Drugs.com for ${medication}`);
    } catch (error) {
      console.error('Error fetching medication information:', error);
      toast.error('Error loading medication information');
    } finally {
      setIsLoading(false);
    }
  };

  const openDrugsComPage = () => {
    if (selectedMedication) {
      const drugsComUrl = getDrugsComUrl(selectedMedication);
      window.open(drugsComUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAddToProfile = () => {
    if (medicationInfo) {
      setShowAddForm(true);
    }
  };

  const handleSubmitNewMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.reason) {
      toast.error('Please fill out all required fields');
      return;
    }

    if (onAddMedication && newMedication.name) {
      onAddMedication(newMedication as Medication);
      toast.success(`${newMedication.name} added to your medications`);
      setShowAddForm(false);
      setMedicationInfo(null);
      setSelectedMedication(null);
      setQuery('');
      setNewMedication({
        id: uuidv4(),
        dosage: '',
        frequency: 'Once daily',
        reason: '',
        startDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
        <div className="bg-safet-600 text-white px-5 py-3 font-medium flex items-center justify-between">
          <span>Search Drugs.com Database</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={openDrugsComPage}
            disabled={!selectedMedication}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Visit Drugs.com
          </Button>
        </div>
        <div className="p-5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter medication name..."
                value={query}
                onChange={handleSearchChange}
                className="pl-10 w-full"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              
              {searchResults.length > 0 && query.length >= 2 && !medicationInfo && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  <ul className="py-1">
                    {searchResults.map((result, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => {
                          selectMedication(result);
                          setQuery(result);
                          setSearchResults([]);
                        }}
                      >
                        <Pill className="h-4 w-4 text-safet-500 mr-2" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || query.length < 2}
              className="bg-safet-500 hover:bg-safet-600"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Search</span>
            </Button>
          </form>
          
          {history.length > 0 && !medicationInfo && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {history.map((item, index) => (
                  <Badge 
                    key={index}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setQuery(item);
                      selectMedication(item);
                    }}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {!query && !medicationInfo && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Popular medications:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {['lisinopril', 'metformin', 'atorvastatin', 'levothyroxine', 'amoxicillin', 'amlodipine'].map((drug, index) => (
                  <Card 
                    key={index} 
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200"
                    onClick={() => {
                      setQuery(drug);
                      selectMedication(drug);
                    }}
                  >
                    <div className="flex items-center">
                      <PillIcon className="h-4 w-4 text-safet-500 mr-2" />
                      <span className="text-gray-700">{drug}</span>
                      <ArrowRight className="h-3 w-3 text-gray-400 ml-auto" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-safet-500" />
            <span className="text-gray-600">Loading medication information from Drugs.com...</span>
          </div>
        </div>
      )}
      
      {medicationInfo && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              className="text-safet-600" 
              onClick={() => {
                setMedicationInfo(null);
                setSelectedMedication(null);
              }}
            >
              Back to Search
            </Button>
            
            <div className="flex gap-2">
              {onAddMedication && (
                <Button 
                  className="bg-safet-500 hover:bg-safet-600"
                  onClick={handleAddToProfile}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add to My Medications
                </Button>
              )}
              
              {medicationInfo.drugsComUrl && (
                <Button variant="outline" className="text-safet-600" asChild>
                  <a 
                    href={medicationInfo.drugsComUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View on Drugs.com
                  </a>
                </Button>
              )}
            </div>
          </div>
          
          <MedicationInfo medication={medicationInfo} />
          
          <div className="mt-4 text-right">
            <p className="text-sm text-gray-500">Source: Drugs.com (simulated)</p>
          </div>
        </div>
      )}

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
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
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
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
    </div>
  );
};

export default DrugInfoLookup;
