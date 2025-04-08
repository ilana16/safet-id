
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Pill, Clock, Search, ExternalLink, RotateCcw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Medication, MedicationTableItem } from '@/types/medication';
import { getDrugsComUrl } from '@/utils/drugsComApi';

const MedicationsSection = () => {
  const [activeTab, setActiveTab] = useState<string>('current');
  const [currentMedications, setCurrentMedications] = useState<MedicationTableItem[]>([]);
  const [researchMedications, setResearchMedications] = useState<MedicationTableItem[]>([]);
  const [discontinuedMedications, setDiscontinuedMedications] = useState<MedicationTableItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Load medications from local storage on component mount
  useEffect(() => {
    loadSavedMedications();
  }, []);

  // Function to load medications from local storage
  const loadSavedMedications = async () => {
    try {
      // Load current medications
      const currentData = localStorage.getItem('my_medications');
      if (currentData) {
        setCurrentMedications(JSON.parse(currentData));
      }
      
      // Load researching medications
      const researchData = localStorage.getItem('researching_medications');
      if (researchData) {
        setResearchMedications(JSON.parse(researchData));
      }
      
      // Load discontinued medications
      const discontinuedData = localStorage.getItem('discontinued_medications');
      if (discontinuedData) {
        setDiscontinuedMedications(JSON.parse(discontinuedData));
      }
      
    } catch (error) {
      console.error('Error loading medications:', error);
      toast.error('Failed to load medications');
    }
  };

  // Function to search for medications
  const searchMedication = async () => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Simple search in static list
      const commonMedications = [
        'Acetaminophen', 'Adderall', 'Albuterol', 'Alprazolam', 'Amoxicillin', 
        'Atorvastatin', 'Azithromycin', 'Benzonatate', 'Bupropion', 'Buspirone',
        'Cefdinir', 'Cephalexin', 'Ciprofloxacin', 'Citalopram', 'Clindamycin',
        'Ibuprofen', 'Metformin', 'Lisinopril', 'Metoprolol', 'Amlodipine'
      ];
      
      const filteredResults = commonMedications.filter(
        med => med.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(filteredResults);
    } catch (err) {
      console.error('Error searching medications:', err);
      toast.error('Error searching medications');
    } finally {
      setIsSearching(false);
    }
  };

  // Function to add medication to a specific list
  const addMedication = async (name: string, listType: 'current' | 'research') => {
    try {
      const storageName = listType === 'current' ? 'my_medications' : 'researching_medications';
      const url = getDrugsComUrl(name);
      const newMedication: MedicationTableItem = {
        name, 
        url, 
        added_at: new Date().toISOString()
      };
      
      // Get current list from storage
      let currentList: MedicationTableItem[] = [];
      const storedData = localStorage.getItem(storageName);
      if (storedData) {
        currentList = JSON.parse(storedData);
      }
      
      // Check if medication already exists
      const existingIndex = currentList.findIndex(med => med.name === name);
      if (existingIndex >= 0) {
        // Update existing entry
        currentList[existingIndex] = newMedication;
      } else {
        // Add new entry
        currentList.push(newMedication);
      }
      
      // Save back to storage
      localStorage.setItem(storageName, JSON.stringify(currentList));
      
      toast.success(`Added ${name} to ${listType === 'current' ? 'current' : 'research'} medications`);
      await loadSavedMedications();
      setSearchResults([]);
      setSearchTerm('');
    } catch (err) {
      console.error('Error adding medication:', err);
      toast.error('Failed to add medication');
    }
  };

  // Function to discontinue medication
  const discontinueMedication = async (name: string, url: string) => {
    try {
      // First add to discontinued list
      const newMedication: MedicationTableItem = { 
        name, 
        url, 
        added_at: new Date().toISOString() 
      };
      
      let discontinuedList: MedicationTableItem[] = [];
      const storedData = localStorage.getItem('discontinued_medications');
      if (storedData) {
        discontinuedList = JSON.parse(storedData);
      }
      
      // Check if medication already exists in discontinued list
      const existingIndex = discontinuedList.findIndex(med => med.name === name);
      if (existingIndex >= 0) {
        // Update existing entry
        discontinuedList[existingIndex] = newMedication;
      } else {
        // Add new entry
        discontinuedList.push(newMedication);
      }
      
      // Save discontinued list
      localStorage.setItem('discontinued_medications', JSON.stringify(discontinuedList));
      
      // Then remove from current medications
      let currentList: MedicationTableItem[] = [];
      const currentData = localStorage.getItem('my_medications');
      if (currentData) {
        currentList = JSON.parse(currentData);
        currentList = currentList.filter(med => med.name !== name);
        localStorage.setItem('my_medications', JSON.stringify(currentList));
      }
      
      toast.success(`Moved ${name} to discontinued medications`);
      await loadSavedMedications();
    } catch (err) {
      console.error('Error discontinuing medication:', err);
      toast.error('Failed to discontinue medication');
    }
  };

  // Function to restore medication
  const restoreMedication = async (name: string, url: string) => {
    try {
      // First add back to current medications
      const newMedication: MedicationTableItem = { 
        name, 
        url, 
        added_at: new Date().toISOString() 
      };
      
      let currentList: MedicationTableItem[] = [];
      const storedData = localStorage.getItem('my_medications');
      if (storedData) {
        currentList = JSON.parse(storedData);
      }
      
      // Check if medication already exists
      const existingIndex = currentList.findIndex(med => med.name === name);
      if (existingIndex >= 0) {
        // Update existing entry
        currentList[existingIndex] = newMedication;
      } else {
        // Add new entry
        currentList.push(newMedication);
      }
      
      // Save current list
      localStorage.setItem('my_medications', JSON.stringify(currentList));
      
      // Then remove from discontinued list
      let discontinuedList: MedicationTableItem[] = [];
      const discontinuedData = localStorage.getItem('discontinued_medications');
      if (discontinuedData) {
        discontinuedList = JSON.parse(discontinuedData);
        discontinuedList = discontinuedList.filter(med => med.name !== name);
        localStorage.setItem('discontinued_medications', JSON.stringify(discontinuedList));
      }
      
      toast.success(`Restored ${name} to current medications`);
      await loadSavedMedications();
    } catch (err) {
      console.error('Error restoring medication:', err);
      toast.error('Failed to restore medication');
    }
  };

  // Function to permanently delete medication
  const permanentlyDelete = async (name: string) => {
    try {
      let discontinuedList: MedicationTableItem[] = [];
      const discontinuedData = localStorage.getItem('discontinued_medications');
      if (discontinuedData) {
        discontinuedList = JSON.parse(discontinuedData);
        discontinuedList = discontinuedList.filter(med => med.name !== name);
        localStorage.setItem('discontinued_medications', JSON.stringify(discontinuedList));
      }
      
      toast.success(`Permanently deleted ${name}`);
      await loadSavedMedications();
    } catch (err) {
      console.error('Error deleting medication:', err);
      toast.error('Failed to delete medication');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Current Medications
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Researching
          </TabsTrigger>
          <TabsTrigger value="discontinued" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Discontinued
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Medication
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current Medications</h3>
            
            {currentMedications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {currentMedications.map((med) => (
                  <Card key={med.name} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <Pill className="h-5 w-5 text-safet-500" />
                            <h3 className="font-medium">{med.name}</h3>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Added on {new Date(med.added_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(med.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" /> View Info
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-amber-600"
                            onClick={() => discontinueMedication(med.name, med.url)}
                          >
                            <Clock className="h-4 w-4 mr-1" /> Discontinue
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No current medications. Add medications from the "Add Medication" tab.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="research">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Medications I'm Researching</h3>
            
            {researchMedications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {researchMedications.map((med) => (
                  <Card key={med.name} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-safet-500" />
                            <h3 className="font-medium">{med.name}</h3>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Added on {new Date(med.added_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(med.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" /> View Info
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => addMedication(med.name, 'current')}
                          >
                            <Pill className="h-4 w-4 mr-1" /> Add to Current
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No medications in research list. Add medications from the "Add Medication" tab.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="discontinued">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Discontinued Medications</h3>
            
            {discontinuedMedications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {discontinuedMedications.map((med) => (
                  <Card key={med.name} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-safet-500" />
                            <h3 className="font-medium">{med.name}</h3>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Discontinued on {new Date(med.added_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(med.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" /> View Info
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => restoreMedication(med.name, med.url)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" /> Restore
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => permanentlyDelete(med.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No discontinued medications.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Search and Add Medications</h3>
            
            <div className="flex gap-2">
              <Input
                className="flex-1"
                placeholder="Search for a medication..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchMedication();
                  }
                }}
              />
              <Button 
                onClick={searchMedication} 
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium">Results:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {searchResults.map((result) => (
                    <Card key={result} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{result}</span>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => addMedication(result, 'current')}
                            >
                              <Pill className="h-4 w-4 mr-1" /> Add to Current
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => addMedication(result, 'research')}
                            >
                              <Search className="h-4 w-4 mr-1" /> Research
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(getDrugsComUrl(result), '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : searchTerm && !isSearching ? (
              <Card className="mt-4">
                <CardContent className="p-4 text-center">
                  <p className="text-gray-500">No medications found matching your search.</p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;
