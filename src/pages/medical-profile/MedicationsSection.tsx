import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, PlusCircle, Info, ChevronLeft, BookOpen, Shield, Pill, Search, AlertTriangle, CheckCircle, X } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState("search");
  
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
        setActiveTab("details");
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

  const addToMyMedications = () => {
    if (selectedMedication) {
      toast.success(`Added ${selectedMedication.name} to your medications list`);
      setActiveTab("myMeds");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="bg-[#2855A1] text-white p-4 md:p-6 rounded-t-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Medications & Supplements</h1>
          <Button 
            onClick={handleSave} 
            className="bg-[#1DA2BC] hover:bg-[#1790A7] text-white"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
            {!isSaving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="bg-[#EBF2FA] border-b border-[#D1DEE8] p-4">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <div className="relative w-full md:max-w-xl">
            <Input
              type="search"
              placeholder="Search for a drug, supplement, or vitamin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="border-[#9CBADE] bg-white pr-10 h-12 text-base shadow-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-[#2855A1] hover:text-[#1A3C70] hover:bg-transparent"
            >
              {isSearching ? 
                <div className="h-5 w-5 border-2 border-t-transparent border-[#2855A1] rounded-full animate-spin"></div> : 
                <Search className="h-5 w-5" />
              }
            </Button>
          </div>
          <Button 
            variant="ghost"
            onClick={() => setShowCommandDialog(true)}
            className="text-[#2855A1] hover:text-[#1A3C70] hover:bg-[#D9E5F2]"
          >
            Advanced Search
          </Button>
        </div>
      </div>
      
      <div className="bg-white border border-t-0 border-[#D1DEE8] rounded-b-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-[#D1DEE8]">
            <TabsList className="bg-[#F5F9FD] w-full justify-start rounded-none border-b border-[#D1DEE8] h-auto px-4">
              <TabsTrigger 
                value="search"
                className="py-3 px-4 text-[#2855A1] data-[state=active]:text-[#1A3C70] data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-t-2 data-[state=active]:border-t-[#2855A1] data-[state=active]:border-l data-[state=active]:border-r data-[state=active]:border-[#D1DEE8] data-[state=active]:rounded-b-none data-[state=active]:font-medium data-[state=inactive]:bg-transparent"
              >
                Search Results
              </TabsTrigger>
              <TabsTrigger 
                value="details"
                className="py-3 px-4 text-[#2855A1] data-[state=active]:text-[#1A3C70] data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-t-2 data-[state=active]:border-t-[#2855A1] data-[state=active]:border-l data-[state=active]:border-r data-[state=active]:border-[#D1DEE8] data-[state=active]:rounded-b-none data-[state=active]:font-medium data-[state=inactive]:bg-transparent"
                disabled={!selectedMedication}
              >
                Drug Information
              </TabsTrigger>
              <TabsTrigger 
                value="myMeds"
                className="py-3 px-4 text-[#2855A1] data-[state=active]:text-[#1A3C70] data-[state=active]:bg-white data-[state=active]:shadow-none data-[state=active]:border-t-2 data-[state=active]:border-t-[#2855A1] data-[state=active]:border-l data-[state=active]:border-r data-[state=active]:border-[#D1DEE8] data-[state=active]:rounded-b-none data-[state=active]:font-medium data-[state=inactive]:bg-transparent"
              >
                My Medications
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="search" className="p-6 focus-visible:outline-none">
            {searchResults.length > 0 ? (
              <div>
                <h2 className="text-xl font-medium text-[#2855A1] mb-4">Search Results</h2>
                <div className="divide-y divide-[#E6EDF5]">
                  {searchResults.map((result) => (
                    <div key={result} className="py-3 first:pt-0">
                      <button 
                        onClick={() => handleSelectMedication(result)}
                        disabled={isLoading}
                        className="w-full text-left py-2 px-3 rounded hover:bg-[#F5F9FD] flex items-center gap-3 transition-colors"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="h-4 w-4 border-2 border-t-transparent border-[#2855A1] rounded-full animate-spin mr-2"></div>
                            <span>Loading...</span>
                          </div>
                        ) : (
                          <>
                            <Pill className="h-5 w-5 text-[#2855A1]" />
                            <div>
                              <span className="font-medium text-[#2855A1] capitalize block">{result}</span>
                              <span className="text-[#6B7280] text-sm">Click for detailed information</span>
                            </div>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchQuery.length > 0 ? (
              <div className="text-center py-8">
                <div className="bg-[#F5F9FD] inline-flex rounded-full p-3 mb-3">
                  <Search className="h-6 w-6 text-[#6B7280]" />
                </div>
                <h3 className="text-lg font-medium text-[#2855A1]">No medications found</h3>
                <p className="text-[#6B7280] mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-[#F5F9FD] inline-flex rounded-full p-3 mb-3">
                  <Search className="h-6 w-6 text-[#6B7280]" />
                </div>
                <h3 className="text-lg font-medium text-[#2855A1]">Search for medications</h3>
                <p className="text-[#6B7280] mt-1">Enter a drug name to see information and add to your list</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="focus-visible:outline-none">
            {selectedMedication && (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-[#2855A1]">{selectedMedication.name}</h2>
                    {selectedMedication.genericName && selectedMedication.genericName !== selectedMedication.name && (
                      <p className="text-[#6B7280] mt-1">Generic name: <span className="font-medium">{selectedMedication.genericName}</span></p>
                    )}
                  </div>
                  <Button 
                    onClick={addToMyMedications}
                    className="bg-[#1DA2BC] hover:bg-[#1790A7] text-white flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add to My Medications
                  </Button>
                </div>
                
                <MedicationDetails medication={selectedMedication} />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="myMeds" className="p-6 focus-visible:outline-none">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-medium text-[#2855A1]">My Medications</h2>
              <Button 
                onClick={handleSave} 
                className="bg-[#1DA2BC] hover:bg-[#1790A7] text-white"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
                {!isSaving && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            
            <Alert className="mb-6 bg-[#FFF8E6] border-[#FFECC7]">
              <AlertTriangle className="h-4 w-4 text-[#ED9121]" />
              <AlertTitle className="text-[#8A6D3B]">Important</AlertTitle>
              <AlertDescription className="text-[#8A6D3B]">
                Keep your medication list up to date and share it with your healthcare providers. 
                You can search for and add medications using the search tab.
              </AlertDescription>
            </Alert>
            
            <MedicalProfileMedicationsForm />
          </TabsContent>
        </Tabs>
      </div>
      
      <CommandDialog open={showCommandDialog} onOpenChange={setShowCommandDialog}>
        <CommandInput 
          placeholder="Search medications..." 
          value={searchQuery}
          onValueChange={handleCommandSearch}
          className="border-b border-[#D1DEE8]"
        />
        <CommandList>
          <CommandEmpty>
            {isSearching ? (
              <div className="flex justify-center py-6">
                <div className="h-6 w-6 border-2 border-t-transparent border-[#2855A1] rounded-full animate-spin"></div>
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
                className="hover:bg-[#F5F9FD] aria-selected:bg-[#F5F9FD]"
                disabled={isLoading}
              >
                <Pill className="h-4 w-4 mr-2 text-[#2855A1]" />
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
