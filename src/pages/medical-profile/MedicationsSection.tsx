
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Pill, PlusCircle, Edit, Clock, AlertCircle, Calendar, Info, Search, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';
import { loadSectionData, saveSectionData } from '@/utils/medicalProfileService';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { searchDrugsCom, getDrugsComInfo, getDrugsComUrl, MedicationInfo } from '@/utils/drugsComApi';

const MedicationsSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('myMeds');
  const { profileData, updateSectionData } = useMedicalProfile();
  const navigate = useNavigate();
  
  // Drug information states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);
  const [drugInfo, setDrugInfo] = useState<MedicationInfo | null>(null);
  const [isLoadingDrugInfo, setIsLoadingDrugInfo] = useState(false);
  
  useEffect(() => {
    const loadMedicationsData = () => {
      try {
        console.log('Loading medications data');
        const medsData = loadSectionData('medications');
        
        if (medsData) {
          updateSectionData('medications', medsData);
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading medications data:', error);
        setIsLoaded(true);
      }
    };
    
    loadMedicationsData();
    
    const handleNavChange = () => {
      loadMedicationsData();
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('medicationsDataRequest', handleNavChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('medicationsDataRequest', handleNavChange);
    };
  }, [updateSectionData]);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const formData = (window as any).medicationsFormData || {};
      
      console.log('Saving medications data:', formData);
      
      const saved = saveSectionData('medications', formData);
      
      if (saved) {
        setIsSaving(false);
        setIsEditMode(false);
        toast.success('Medications information saved successfully');
      } else {
        setIsSaving(false);
        toast.error('Error saving medications information');
      }
    } catch (error) {
      console.error('Error saving medications information:', error);
      setIsSaving(false);
      toast.error('Error saving medications information');
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      handleSave();
    } else {
      setIsEditMode(true);
    }
  };

  const medications = profileData?.medications?.prescriptions || [];
  const otcMedications = profileData?.medications?.otc || [];
  const supplements = profileData?.medications?.supplements || [];
  
  const allMedications = [
    ...(medications || []).map((med: any) => ({ ...med, type: 'prescription' })),
    ...(otcMedications || []).map((med: any) => ({ ...med, type: 'otc' })),
    ...(supplements || []).map((med: any) => ({ ...med, type: 'supplement' })),
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'prescription': return 'Prescription';
      case 'otc': return 'Over-the-counter';
      case 'supplement': return 'Supplement';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'otc': return 'bg-green-100 text-green-800 border-green-200';
      case 'supplement': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle drug search
  const handleDrugSearch = async () => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      toast.error('Please enter at least 2 characters to search');
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    setSelectedDrug(null);
    setDrugInfo(null);
    
    try {
      const results = await searchDrugsCom(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for medications:', error);
      toast.error('Error searching for medications');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a drug from search results
  const handleSelectDrug = async (drugName: string) => {
    setSelectedDrug(drugName);
    setIsLoadingDrugInfo(true);
    
    try {
      const info = await getDrugsComInfo(drugName);
      setDrugInfo(info);
    } catch (error) {
      console.error('Error fetching drug information:', error);
      toast.error('Error fetching drug information');
    } finally {
      setIsLoadingDrugInfo(false);
    }
  };

  // Open external link to Drugs.com
  const openDrugsComPage = (drugName: string) => {
    window.open(getDrugsComUrl(drugName), '_blank');
  };

  const renderMedicationCard = (med: any) => {
    return (
      <Card key={med.id} className="mb-4 border border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-safet-600" />
              <h3 className="font-medium">{med.name || 'Unnamed Medication'}</h3>
            </div>
            <Badge className={getTypeColor(med.type)}>
              {getTypeLabel(med.type)}
            </Badge>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {med.totalDosage && med.unit && (
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Dosage:</span>
                    <p className="text-sm text-gray-600">{med.totalDosage} {med.unit}</p>
                  </div>
                </div>
              )}
              
              {med.form && (
                <div className="flex items-start gap-2">
                  <Pill className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Form:</span>
                    <p className="text-sm text-gray-600">
                      {med.form === 'other' ? med.customForm : med.form}
                    </p>
                  </div>
                </div>
              )}
              
              {med.reason && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Reason:</span>
                    <p className="text-sm text-gray-600">{med.reason}</p>
                  </div>
                </div>
              )}
              
              {med.withFood && (
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Instructions:</span>
                    <p className="text-sm text-gray-600">
                      {med.withFood === 'with' ? 'Take with food' : 
                       med.withFood === 'without' ? 'Take without food' : 
                       med.withFood === 'either' ? 'Take with or without food' : 
                       'Special instructions'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {med.doseTimes && med.doseTimes.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Schedule:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {med.doseTimes.map((doseTime: any) => (
                    <Badge key={doseTime.id} variant="outline" className="bg-gray-50">
                      <Clock className="h-3 w-3 mr-1" />
                      {doseTime.time}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-gray-100">
          <TabsTrigger value="myMeds" className="data-[state=active]:bg-white">
            My Medication List
          </TabsTrigger>
          <TabsTrigger value="drugInfo" className="data-[state=active]:bg-white">
            Drug Information
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="myMeds" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium text-lg text-gray-900">My Medications</h3>
              <p className="text-sm text-gray-600">
                {allMedications.length > 0 
                  ? `You have ${allMedications.length} medication${allMedications.length !== 1 ? 's' : ''} saved`
                  : 'No medications saved yet'
                }
              </p>
            </div>
            <div className="flex gap-2">
              {isEditMode ? (
                <Button 
                  onClick={handleSave}
                  className="bg-safet-500 hover:bg-safet-600 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                  {!isSaving && <Save className="ml-2 h-4 w-4" />}
                </Button>
              ) : (
                <Button 
                  onClick={toggleEditMode} 
                  variant="outline"
                  className="text-safet-600 border-safet-300 hover:bg-safet-50"
                >
                  Edit List
                  <Edit className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <Separator className="mb-6" />
          
          {isEditMode ? (
            <MedicalProfileMedicationsForm />
          ) : (
            <div className="space-y-6">
              {allMedications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Pill className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No medications added</h3>
                  <p className="mt-2 text-sm text-gray-500">Add your medications to keep track of your treatment plan.</p>
                  <Button
                    onClick={() => setIsEditMode(true)}
                    className="mt-6"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Medication
                  </Button>
                </div>
              ) : (
                <>
                  {allMedications.map(renderMedicationCard)}
                  
                  <Button
                    onClick={() => setIsEditMode(true)}
                    variant="outline"
                    className="w-full text-safet-600 border-safet-200"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another Medication
                  </Button>
                </>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="drugInfo" className="mt-0">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg text-gray-900">Drug Information Lookup</h3>
              <p className="text-sm text-gray-600">Search for detailed information about medications</p>
            </div>
            
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a medication..."
                        className="pl-10 pr-4 py-2 w-full"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleDrugSearch();
                          }
                        }}
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <Button 
                      onClick={handleDrugSearch}
                      disabled={isSearching}
                      className="bg-safet-500 hover:bg-safet-600 text-white"
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                  
                  {isSearching ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safet-500 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Searching for medications...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="font-medium">Search Results</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {searchResults.map((result, idx) => (
                          <Button 
                            key={idx} 
                            variant="outline" 
                            className="justify-start text-left"
                            onClick={() => handleSelectDrug(result)}
                          >
                            <Pill className="mr-2 h-4 w-4 text-safet-500" />
                            {result}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : searchQuery && !isSearching && searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-8 w-8 text-amber-500" />
                      <p className="mt-2 text-gray-600">No medications found matching "{searchQuery}"</p>
                    </div>
                  ) : null}
                  
                  {/* Drug Information Display */}
                  {selectedDrug && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {isLoadingDrugInfo ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safet-500 mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading information for {selectedDrug}...</p>
                        </div>
                      ) : drugInfo ? (
                        <Card className="border border-gray-200">
                          <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg font-semibold flex items-center">
                                <Pill className="mr-2 h-5 w-5 text-safet-600" />
                                {drugInfo.name}
                              </CardTitle>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openDrugsComPage(drugInfo.name)}
                                className="text-safet-600"
                              >
                                View on Drugs.com
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                            {drugInfo.genericName && drugInfo.genericName !== drugInfo.name && (
                              <CardDescription className="text-sm">
                                Generic Name: {drugInfo.genericName}
                              </CardDescription>
                            )}
                            {drugInfo.drugClass && (
                              <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200">
                                {drugInfo.drugClass}
                              </Badge>
                            )}
                          </CardHeader>
                          <CardContent className="p-5">
                            <div className="space-y-6">
                              <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-gray-700">{drugInfo.description}</p>
                              </div>
                              
                              {drugInfo.usedFor && drugInfo.usedFor.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Used For</h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {drugInfo.usedFor.map((use, idx) => (
                                      <li key={idx} className="text-gray-700">{use}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div>
                                <h4 className="font-medium mb-2">Dosage Information</h4>
                                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                                  {drugInfo.dosage.adult && (
                                    <div>
                                      <span className="font-medium text-sm">Adult:</span>
                                      <p className="text-gray-700">{drugInfo.dosage.adult}</p>
                                    </div>
                                  )}
                                  {drugInfo.dosage.child && (
                                    <div>
                                      <span className="font-medium text-sm">Child:</span>
                                      <p className="text-gray-700">{drugInfo.dosage.child}</p>
                                    </div>
                                  )}
                                  {drugInfo.dosage.elderly && (
                                    <div>
                                      <span className="font-medium text-sm">Elderly:</span>
                                      <p className="text-gray-700">{drugInfo.dosage.elderly}</p>
                                    </div>
                                  )}
                                  {drugInfo.dosage.frequency && (
                                    <div>
                                      <span className="font-medium text-sm">Frequency:</span>
                                      <p className="text-gray-700">{drugInfo.dosage.frequency}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {drugInfo.sideEffects && drugInfo.sideEffects.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Side Effects</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {drugInfo.sideEffects.map((effect, idx) => (
                                      <Badge key={idx} variant="outline" className="bg-amber-50">
                                        {effect}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {drugInfo.warnings && drugInfo.warnings.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2 text-red-600 flex items-center">
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Warnings
                                  </h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {drugInfo.warnings.map((warning, idx) => (
                                      <li key={idx} className="text-gray-700">{warning}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {drugInfo.interactions && drugInfo.interactions.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Drug Interactions</h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {drugInfo.interactions.map((interaction, idx) => (
                                      <li key={idx} className="text-gray-700">{interaction}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
                            Source: {drugInfo.source || 'Drugs.com (Simulated Data)'}
                          </CardFooter>
                        </Card>
                      ) : (
                        <div className="text-center py-8">
                          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
                          <p className="mt-2 text-gray-600">Could not retrieve information for {selectedDrug}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;
