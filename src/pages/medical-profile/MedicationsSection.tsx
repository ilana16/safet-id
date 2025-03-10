
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Save, PlusCircle, Info } from 'lucide-react';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchMedications, getMedicationInfo, type MedicationInfo } from '@/utils/medicationData';
import MedicationInfo from '@/components/medications/MedicationInfo';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';

const MedicationsSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<MedicationInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'my-medications' | 'drug-info'>('my-medications');
  const [showCommandDialog, setShowCommandDialog] = useState(false);
  
  useEffect(() => {
    try {
      // First check if session storage has any data
      const sessionData = sessionStorage.getItem('medicationsFormData');
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          (window as any).medicationsFormData = parsedData;
          console.log('Setting medications form data from session storage:', parsedData);
          return;
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.medications) {
          (window as any).medicationsFormData = savedProfile.medications;
          console.log('Setting medications form data in window object:', savedProfile.medications);
          
          // Also save to session storage for better persistence
          sessionStorage.setItem('medicationsFormData', JSON.stringify(savedProfile.medications));
        }
      }
    } catch (error) {
      console.error('Error loading medications data:', error);
    }
  }, []);
  
  // Add event listener for page unload to save data
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentFormData = (window as any).medicationsFormData;
      if (currentFormData) {
        sessionStorage.setItem('medicationsFormData', JSON.stringify(currentFormData));
        console.log('Saving medications form data to session storage before unload:', currentFormData);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Save form data when component unmounts
  useEffect(() => {
    return () => {
      const currentFormData = (window as any).medicationsFormData;
      if (currentFormData) {
        sessionStorage.setItem('medicationsFormData', JSON.stringify(currentFormData));
        console.log('Saving medications form data to session storage on unmount:', currentFormData);
      }
    };
  }, []);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile.medications || {};
      
      let newFormData = (window as any).medicationsFormData || {};
      
      console.log('Saving medications form data:', newFormData);
      
      const changes: {field: string; oldValue: any; newValue: any}[] = [];
      
      Object.keys(newFormData).forEach(key => {
        const oldValue = existingSectionData[key];
        const newValue = newFormData[key];
        
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes.push({
            field: key,
            oldValue: oldValue,
            newValue: newValue
          });
        }
      });
      
      setTimeout(() => {
        const updatedProfile = {
          ...existingProfile,
          medications: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString()
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        // Also update session storage
        sessionStorage.setItem('medicationsFormData', JSON.stringify({
          ...newFormData,
          completed: true,
          lastUpdated: new Date().toISOString()
        }));
        
        if (changes.length > 0) {
          logChanges('medications', changes);
        }
        
        setIsSaving(false);
        toast.success('Medications information saved successfully');
      }, 500);
    } catch (error) {
      console.error('Error saving medications information:', error);
      setIsSaving(false);
      toast.error('Error saving medications information');
    }
  };

  // Handle medication search
  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      const results = searchMedications(searchQuery);
      setSearchResults(results);
      if (results.length === 0) {
        toast.info('No medications found matching your search');
      }
    } else {
      setSearchResults([]);
    }
  };

  // Handle selecting a medication from search results
  const handleSelectMedication = (medicationKey: string) => {
    const medicationInfo = getMedicationInfo(medicationKey);
    if (medicationInfo) {
      setSelectedMedication(medicationInfo);
      setActiveTab('drug-info');
      setShowCommandDialog(false);
    }
  };

  // Handle triggering the command dialog for quick search
  const handleCommandSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
      const results = searchMedications(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div>
      <Tabs
        defaultValue="my-medications"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'my-medications' | 'drug-info')}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="my-medications">My Medications</TabsTrigger>
            <TabsTrigger value="drug-info">Drug Information</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowCommandDialog(true)}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Quick Search
            </Button>
            
            {activeTab === 'my-medications' && (
              <Button 
                onClick={handleSave} 
                className="bg-safet-500 hover:bg-safet-600"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
                {!isSaving && <Save className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
        
        <TabsContent value="my-medications">
          <MedicalProfileMedicationsForm />
          
          <div className="mt-8 flex justify-end gap-3">
            <Button 
              onClick={handleSave} 
              className="bg-safet-500 hover:bg-safet-600"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
              {!isSaving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="drug-info">
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Search for a medication..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSearch}
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('my-medications')}
                className="whitespace-nowrap"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add to My Medications
              </Button>
            </div>
            
            {searchResults.length > 0 && !selectedMedication && (
              <Card className="p-4">
                <h3 className="font-medium mb-3">Search Results</h3>
                <ul className="space-y-2">
                  {searchResults.map((result) => {
                    const info = getMedicationInfo(result);
                    return (
                      <li key={result}>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSelectMedication(result)}
                          className="w-full justify-start text-left hover:bg-gray-100"
                        >
                          <div>
                            <div className="font-medium">{info?.name}</div>
                            {info?.genericName && info.genericName !== info.name && (
                              <div className="text-sm text-gray-500">{info.genericName}</div>
                            )}
                          </div>
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            )}
            
            {selectedMedication ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between mb-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedMedication(null)}
                    className="text-gray-500"
                  >
                    ← Back to results
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('my-medications')}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add to My Medications
                  </Button>
                </div>
                <MedicationInfo medication={selectedMedication} />
              </div>
            ) : (
              !searchResults.length && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Find Drug Information</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Search for medications to view detailed information about dosage, 
                    side effects, interactions, and more.
                  </p>
                </div>
              )
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <CommandDialog open={showCommandDialog} onOpenChange={setShowCommandDialog}>
        <CommandInput 
          placeholder="Search medications..." 
          value={searchQuery}
          onValueChange={handleCommandSearch}
        />
        <CommandList>
          <CommandEmpty>No medications found.</CommandEmpty>
          <CommandGroup heading="Medications">
            {searchResults.map((result) => {
              const info = getMedicationInfo(result);
              return (
                <CommandItem 
                  key={result}
                  onSelect={() => handleSelectMedication(result)}
                >
                  <div>
                    <div>{info?.name}</div>
                    {info?.genericName && info.genericName !== info.name && (
                      <div className="text-sm text-gray-500">{info.genericName}</div>
                    )}
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default MedicationsSection;
