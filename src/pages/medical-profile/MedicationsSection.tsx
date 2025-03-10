import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Save, PlusCircle, Info, ChevronLeft } from 'lucide-react';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchMedications, getMedicationInfo, type MedicationInfo } from '@/utils/medicationData';
import MedicationDetails from '@/components/medications/MedicationInfo';
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';

const MedicationsSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<MedicationInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'my-medications' | 'drug-info'>('my-medications');
  const [showCommandDialog, setShowCommandDialog] = useState(false);
  
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

  const handleSelectMedication = (medicationKey: string) => {
    const medicationInfo = getMedicationInfo(medicationKey);
    if (medicationInfo) {
      setSelectedMedication(medicationInfo);
      setActiveTab('drug-info');
      setShowCommandDialog(false);
    }
  };

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
          <TabsList className="bg-[#EFF5FB] border border-[#C8D7EC]">
            <TabsTrigger 
              value="my-medications" 
              className="data-[state=active]:bg-[#1F4894] data-[state=active]:text-white"
            >
              My Medications
            </TabsTrigger>
            <TabsTrigger 
              value="drug-info"
              className="data-[state=active]:bg-[#1F4894] data-[state=active]:text-white"
            >
              Drug Information
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowCommandDialog(true)}
              className="flex items-center gap-2 border-[#C8C8C9] bg-white text-[#333333] hover:bg-[#F6F6F7]"
            >
              <Search className="h-4 w-4 text-[#8E9196]" />
              Quick Search
            </Button>
            
            {activeTab === 'my-medications' && (
              <Button 
                onClick={handleSave} 
                className="bg-[#1F4894] hover:bg-[#15366D] text-white"
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
              className="bg-[#1F4894] hover:bg-[#15366D] text-white"
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
                  className="pr-10 border-[#C8C8C9] focus-visible:ring-[#1F4894] bg-white"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSearch}
                  className="absolute right-0 top-0 h-full text-[#8E9196] hover:text-[#1F4894]"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={() => setActiveTab('my-medications')}
                className="whitespace-nowrap bg-[#1F4894] hover:bg-[#15366D] text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add to My Medications
              </Button>
            </div>
            
            {searchResults.length > 0 && !selectedMedication && (
              <Card className="p-4 border-[#C8C8C9]">
                <h3 className="font-medium mb-2 text-[#1F4894]">Search Results</h3>
                <Separator className="bg-[#C8C8C9] mb-3" />
                <ul className="space-y-1">
                  {searchResults.map((result) => {
                    const info = getMedicationInfo(result);
                    return (
                      <li key={result} className="border-b border-[#F6F6F7] last:border-0">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSelectMedication(result)}
                          className="w-full justify-start text-left py-3 hover:bg-[#F6F6F7] text-[#333333]"
                        >
                          <div>
                            <div className="font-medium text-[#1F4894]">{info?.name}</div>
                            {info?.genericName && info.genericName !== info.name && (
                              <div className="text-sm text-[#8E9196]">{info.genericName}</div>
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
              <div className="bg-white rounded-lg border border-[#C8C8C9] p-6">
                <div className="flex justify-between mb-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedMedication(null)}
                    className="text-[#1F4894] hover:bg-[#EFF5FB] flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to results
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('my-medications')}
                    className="flex items-center gap-2 bg-[#1F4894] hover:bg-[#15366D] text-white"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add to My Medications
                  </Button>
                </div>
                <MedicationDetails medication={selectedMedication} />
              </div>
            ) : (
              !searchResults.length && (
                <div className="text-center py-12 bg-[#F6F6F7] rounded-lg border border-[#C8C8C9]">
                  <div className="bg-[#EFF5FB] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="h-8 w-8 text-[#1F4894]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#1F4894] mb-2">Find Drug Information</h3>
                  <p className="text-[#8E9196] max-w-md mx-auto">
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
          className="border-b border-[#C8C8C9]"
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
                  className="hover:bg-[#EFF5FB] aria-selected:bg-[#EFF5FB]"
                >
                  <Search className="h-4 w-4 mr-2 text-[#8E9196]" />
                  <div>
                    <div className="text-[#1F4894]">{info?.name}</div>
                    {info?.genericName && info.genericName !== info.name && (
                      <div className="text-sm text-[#8E9196]">{info.genericName}</div>
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
