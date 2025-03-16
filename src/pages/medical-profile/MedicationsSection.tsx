
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Info, Save, Search, PlusCircle, Pill, ChevronRight, FilterX, ExternalLink, Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { useFieldPersistence } from '@/hooks/useFieldPersistence';
import DrugInfoLookup from '@/components/medications/DrugInfoLookup';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import DrugsDotComMedicationsForm from '@/components/forms/DrugsDotComMedicationsForm';
import { searchDrugsCom, getDrugsComInfo } from '@/utils/drugsComApi';
import MedicationInfo from '@/components/medications/MedicationInfo';

// Define the type for medications data
interface MedicationsData {
  prescriptions: any[];
  otc: any[];
  supplements: any[];
  [key: string]: any;
}

const initialMedicationsData: MedicationsData = {
  prescriptions: [],
  otc: [],
  supplements: []
};

const MedicationsSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("my-meds");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [medicationInfo, setMedicationInfo] = useState<any | null>(null);
  const [isLoadingMedInfo, setIsLoadingMedInfo] = useState(false);
  
  // Use the useFieldPersistence hook for medications data
  const [medicationsData, updateMedicationsData, saveMedicationsData] = useFieldPersistence<MedicationsData>(
    'medications',
    initialMedicationsData
  );
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Make the medications data available to the DrugsDotComMedicationsForm
    if (medicationsData) {
      (window as any).medicationsFormData = medicationsData;
    }
  }, [medicationsData]);
  
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchDrugsCom(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching medications:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSelectMedication = async (medication: string) => {
    setSelectedMedication(medication);
    setSearchQuery(medication);
    setSearchResults([]);
    setIsLoadingMedInfo(true);
    
    try {
      const info = await getDrugsComInfo(medication);
      setMedicationInfo(info);
      setActiveTab('drug-lookup');
    } catch (error) {
      console.error('Error fetching medication information:', error);
      toast.error('Error loading medication information');
    } finally {
      setIsLoadingMedInfo(false);
    }
  };
  
  const addMedicationToProfile = () => {
    if (!medicationInfo) return;
    
    // Determine medication type
    let type = 'prescription';
    if (medicationInfo.drugClass && 
        (medicationInfo.drugClass.includes('Over-the-counter') || 
         medicationInfo.drugClass.includes('OTC'))) {
      type = 'otc';
    } else if (medicationInfo.drugClass && 
               (medicationInfo.drugClass.includes('Supplement') || 
                medicationInfo.drugClass.includes('Vitamin'))) {
      type = 'supplement';
    }
    
    // Create new medication object
    const newMedication = {
      id: `med_${Date.now()}`,
      name: medicationInfo.name,
      brandName: medicationInfo.genericName || '',
      reason: medicationInfo.usedFor ? medicationInfo.usedFor.join(', ') : '',
      type,
      form: '',
      totalDosage: '',
      unit: '',
      withFood: 'with',
      doseTimes: [{ id: `time_${Date.now()}`, time: '' }]
    };
    
    // Update medications data
    const updatedData = { ...medicationsData };
    updatedData[type].push(newMedication);
    updateMedicationsData(updatedData);
    
    // Switch to my-meds tab
    setActiveTab('my-meds');
    toast.success(`Added ${medicationInfo.name} to your medications`);
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).medicationsFormData || {};
      
      console.log('Saving medications form data:', newFormData);
      
      // Update the context and persist the data
      updateMedicationsData(newFormData);
      saveMedicationsData();
      
      // Get the saved profile from localStorage for comparison
      const savedProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
      const existingSectionData = existingProfile.medications || {};
      
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
      
      if (changes.length > 0) {
        logChanges('medications', changes);
      }
      
      setIsSaving(false);
      toast.success('Medications saved successfully');
    } catch (error) {
      console.error('Error saving medications:', error);
      setIsSaving(false);
      toast.error('Error saving medications');
    }
  };

  const totalMedicationsCount = 
    (medicationsData?.prescriptions?.length || 0) + 
    (medicationsData?.otc?.length || 0) + 
    (medicationsData?.supplements?.length || 0);

  return (
    <div className="space-y-6">
      {/* Header section in drugs.com style */}
      <div className="bg-white border border-[#D1DEE8] rounded-xl overflow-hidden shadow-sm">
        <div className="bg-[#335B95] text-white px-6 py-4">
          <h1 className="text-2xl font-bold">My Medications</h1>
          <p className="text-white/80 mt-1">
            Track your prescriptions, over-the-counter medicines, and supplements
          </p>
        </div>
        
        <div className="p-4 border-b border-gray-200 bg-[#F5F8FC]">
          <div className="relative">
            <Input 
              placeholder="Search medications database..." 
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border-gray-300 focus:ring-[#335B95] focus:border-[#335B95]"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                <ul>
                  {searchResults.map((result, idx) => (
                    <li 
                      key={idx}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                      onClick={() => handleSelectMedication(result)}
                    >
                      <Pill className="h-4 w-4 text-[#335B95] mr-2" />
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {isSearching && (
              <div className="absolute right-3 top-2.5">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content with tabs */}
      <Tabs 
        defaultValue="my-meds" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-white border border-gray-200 rounded-md mb-4 p-1 overflow-x-auto flex">
          <TabsTrigger 
            value="my-meds" 
            className="flex items-center data-[state=active]:bg-[#EBF2FA] data-[state=active]:text-[#335B95] data-[state=active]:border-b-2 data-[state=active]:border-[#335B95] rounded-none flex-1"
          >
            <Pill className="h-4 w-4 mr-2" />
            My Medications
            {totalMedicationsCount > 0 && (
              <Badge className="ml-2 bg-[#EBF2FA] text-[#335B95] border-[#335B95]/20">{totalMedicationsCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="drug-lookup" 
            className="flex items-center data-[state=active]:bg-[#EBF2FA] data-[state=active]:text-[#335B95] data-[state=active]:border-b-2 data-[state=active]:border-[#335B95] rounded-none flex-1"
          >
            <Search className="h-4 w-4 mr-2" />
            Drug Information
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-meds" className="mt-0">
          <Card className="p-6 border border-gray-200">
            {isLoaded && <DrugsDotComMedicationsForm />}
            
            <div className="mt-8 flex justify-end gap-3">
              <Button 
                onClick={handleSave} 
                className="bg-[#335B95] hover:bg-[#26497C]"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
                {!isSaving && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="drug-lookup" className="mt-0">
          <Card className="border border-gray-200">
            <div className="p-6">
              {isLoadingMedInfo ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#335B95] mr-2" />
                  <span>Loading medication information...</span>
                </div>
              ) : medicationInfo ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {medicationInfo.name}
                      {medicationInfo.genericName && medicationInfo.genericName !== medicationInfo.name && (
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          ({medicationInfo.genericName})
                        </span>
                      )}
                    </h2>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setMedicationInfo(null)}
                      >
                        Back to Search
                      </Button>
                      {medicationInfo.drugsComUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-[#EBF2FA] text-[#335B95] border-[#335B95]/20"
                          asChild
                        >
                          <a 
                            href={medicationInfo.drugsComUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Drugs.com
                          </a>
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        className="bg-[#335B95] hover:bg-[#26497C]"
                        onClick={addMedicationToProfile}
                      >
                        <PlusCircle className="h-4 w-4 mr-1" />
                        Add to My Medications
                      </Button>
                    </div>
                  </div>
                  
                  <MedicationInfo medication={medicationInfo} />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Medication Information Database</h2>
                  <p className="text-gray-600 mb-6">
                    Search for detailed information about prescription drugs, over-the-counter medicines, and supplements.
                  </p>
                  <DrugInfoLookup />
                </>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;
