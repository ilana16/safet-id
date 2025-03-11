import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, PlusCircle, Info, ChevronLeft, BookOpen, Shield, Pill, Search, AlertTriangle } from 'lucide-react';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { type MedicationInfo } from '@/utils/medicationData';
import MedicationDetails from '@/components/medications/MedicationInfo';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { searchDrugsCom, getDrugsComInfo } from '@/utils/drugsComApi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Medication {
  id: string;
  name: string;
  totalDosage: string;
  unit: string;
  // ... keep existing code (other medication properties)
}

const MedicationsSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<MedicationInfo | null>(null);
  const [showCommandDialog, setShowCommandDialog] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    try {
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
      
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (savedProfileJson) {
        const savedProfile = JSON.parse(savedProfileJson);
        if (savedProfile && savedProfile.medications) {
          (window as any).medicationsFormData = savedProfile.medications;
          console.log('Setting medications form data in window object:', savedProfile.medications);
          
          sessionStorage.setItem('medicationsFormData', JSON.stringify(savedProfile.medications));
        }
      }
    } catch (error) {
      console.error('Error loading medications data:', error);
    }
  }, []);
  
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

  const handleSearch = async () => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchDrugsCom(searchQuery);
        setSearchResults(results);
        if (results.length === 0) {
          toast.info('No medications found matching your search');
        }
      } catch (error) {
        console.error('Error searching medications:', error);
        toast.error('Error searching medications');
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectMedication = async (medicationKey: string) => {
    setIsLoading(true);
    try {
      const medicationInfo = await getDrugsComInfo(medicationKey);
      if (medicationInfo) {
        setSelectedMedication(medicationInfo);
        setShowCommandDialog(false);
      } else {
        toast.error('Medication information not found');
      }
    } catch (error) {
      console.error('Error fetching medication details:', error);
      toast.error('Error fetching medication details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommandSearch = async (value: string) => {
    setSearchQuery(value);
    if (value.trim().length >= 2) {
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

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1A3C70]">My Medications</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowCommandDialog(true)}
            className="flex items-center gap-2 border-[#C8C8C9] bg-white text-[#333333] hover:bg-[#F6F6F7]"
          >
            <Search className="h-4 w-4 text-[#8E9196]" />
            Quick Search
          </Button>
          
          <Button 
            onClick={handleSave} 
            className="bg-[#1A3C70] hover:bg-[#15366D] text-white"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
            {!isSaving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Card className="p-6 border-[#DCE8F7] bg-[#F0F6FE]">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#1A3C70] p-2 rounded-full">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-[#1A3C70]">Drug Information Lookup</h3>
        </div>
        
        <Alert className="bg-white border-[#DCE8F7] mb-4">
          <Info className="h-4 w-4 text-[#1A3C70]" />
          <AlertTitle className="text-[#1A3C70]">Look up medication information</AlertTitle>
          <AlertDescription className="text-[#666666]">
            Search for medications to view detailed information from Drugs.com including dosage, side effects, interactions, and more.
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search for a medication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pr-10 border-[#C8D7EC] focus-visible:ring-[#1A3C70] bg-white"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-0 top-0 h-full text-[#8E9196] hover:text-[#1A3C70]"
            >
              {isSearching ? 
                <div className="h-4 w-4 border-2 border-t-transparent border-[#8E9196] rounded-full animate-spin"></div> : 
                <Search className="h-4 w-4" />
              }
            </Button>
          </div>
        </div>
        
        {searchResults.length > 0 && !selectedMedication && (
          <Card className="p-4 border-[#DCE8F7] mt-4 bg-white">
            <h3 className="font-medium mb-2 text-[#1A3C70]">Search Results</h3>
            <Separator className="bg-[#DCE8F7] mb-3" />
            <ul className="space-y-1 divide-y divide-[#F0F6FE]">
              {searchResults.map((result) => (
                <li key={result}>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSelectMedication(result)}
                    disabled={isLoading}
                    className="w-full justify-start text-left py-3 hover:bg-[#F0F6FE] text-[#333333]"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 border-2 border-t-transparent border-[#1A3C70] rounded-full animate-spin mr-2"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Pill className="h-4 w-4 mr-2 text-[#1A3C70]" />
                        <span className="font-medium text-[#1A3C70] capitalize">{result}</span>
                      </div>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Card>
      
      {selectedMedication && (
        <div className="bg-white rounded-lg border border-[#DCE8F7] p-6">
          <div className="flex justify-between mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedMedication(null)}
              className="text-[#1A3C70] border-[#C8D7EC] hover:bg-[#F0F6FE] flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to search
            </Button>
            <Button 
              onClick={() => {
                toast.info("Functionality to add medication to your list would be implemented here");
                setSelectedMedication(null);
              }}
              className="flex items-center gap-2 bg-[#1A3C70] hover:bg-[#15366D] text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Add to My Medications
            </Button>
          </div>
          <MedicationDetails medication={selectedMedication} />
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#DCE8F7] p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#1A3C70] p-2 rounded-full">
            <Pill className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-[#1A3C70]">My Medications</h3>
        </div>

        <Alert className="mb-6 bg-[#FFFBF2] border-[#FFECC7]">
          <AlertTriangle className="h-4 w-4 text-[#ED9121]" />
          <AlertTitle className="text-[#8A6D3B]">Important</AlertTitle>
          <AlertDescription className="text-[#8A6D3B]">
            Keep your medication list up to date and share it with your healthcare providers.
          </AlertDescription>
        </Alert>
        
        <MedicalProfileMedicationsForm />
        
        <div className="mt-8 flex justify-end gap-3">
          <Button 
            onClick={handleSave} 
            className="bg-[#1A3C70] hover:bg-[#15366D] text-white"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
            {!isSaving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <CommandDialog open={showCommandDialog} onOpenChange={setShowCommandDialog}>
        <CommandInput 
          placeholder="Search medications..." 
          value={searchQuery}
          onValueChange={handleCommandSearch}
          className="border-b border-[#DCE8F7]"
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? (
              <div className="flex justify-center py-6">
                <div className="h-6 w-6 border-2 border-t-transparent border-[#1A3C70] rounded-full animate-spin"></div>
              </div>
            ) : (
              "No medications found."
            )}
          </CommandEmpty>
          <CommandGroup heading="Medications">
            {searchResults.map((result) => (
              <CommandItem 
                key={result}
                onSelect={() => handleSelectMedication(result)}
                className="hover:bg-[#F0F6FE] aria-selected:bg-[#F0F6FE]"
                disabled={isLoading}
              >
                <Pill className="h-4 w-4 mr-2 text-[#1A3C70]" />
                <div className="capitalize">{result}</div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default MedicationsSection;
