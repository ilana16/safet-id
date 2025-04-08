
import React, { useState } from 'react';
import { getDrugsComInfo, getDrugsComUrl, searchDrugsCom } from '@/utils/drugsComApi';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, Database } from 'lucide-react';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Medication } from '@/pages/medical-profile/MedicationsSection';

// Import our components
import MedicationSearch from './drug-lookup/MedicationSearch';
import MedicationInfoDisplay from './drug-lookup/MedicationInfoDisplay';
import MedicationAddForm from './drug-lookup/MedicationAddForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface DrugInfoLookupProps {
  onAddMedication?: (medication: Medication) => void;
}

const DrugInfoLookup: React.FC<DrugInfoLookupProps> = ({ onAddMedication }) => {
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [medicationInfo, setMedicationInfo] = useState<MedicationInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [activeDataSource, setActiveDataSource] = useState<'drugscom' | 'comprehensive'>('drugscom');
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    id: uuidv4(),
    dosage: '',
    frequency: 'Once daily',
    reason: '',
    startDate: new Date().toISOString().split('T')[0],
  });
  
  const saveHistory = (medication: string) => {
    if (!medication || medication.trim() === '') return;
    
    try {
      const savedHistory = localStorage.getItem('medicationSearchHistory');
      let newHistory: string[] = savedHistory ? JSON.parse(savedHistory) : [];
      
      newHistory = newHistory.filter(item => item !== medication);
      newHistory.unshift(medication);
      newHistory = newHistory.slice(0, 5);
      
      localStorage.setItem('medicationSearchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving medication search history:', error);
    }
  };

  const fetchComprehensiveMedicationData = async (medication: string): Promise<MedicationInfoType | null> => {
    // This would be replaced with an actual API call to a comprehensive database
    // For now, we'll simulate a response with a timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a basic medication info structure with the name
        const info: MedicationInfoType = {
          name: medication,
          description: `Comprehensive information for ${medication}. This would contain detailed medication data from a comprehensive database of all medications, vitamins, and supplements.`,
          dosage: {
            adult: "Refer to your doctor for specific dosing instructions.",
            frequency: "As prescribed by your healthcare provider.",
          },
          sideEffects: {
            common: ["Data would be populated from comprehensive database"],
            serious: ["Data would be populated from comprehensive database"],
          },
          usedFor: ["Various conditions - refer to comprehensive database for details"],
          source: "Comprehensive Medication Database API",
        };
        resolve(info);
      }, 1500); // Simulate network delay
    });
  };

  const selectMedication = async (medication: string) => {
    if (!medication || medication.trim() === '') {
      toast.error('Please enter a valid medication name');
      return;
    }
    
    setSelectedMedication(medication);
    setIsLoading(true);
    setError(null);
    setMedicationInfo(null);
    setShowAddForm(false);
    setSearchAttempted(true);
    saveHistory(medication);
    
    try {
      console.log(`Fetching information for medication: ${medication} from source: ${activeDataSource}`);
      
      let info: MedicationInfoType | null;
      
      if (activeDataSource === 'drugscom') {
        info = await getDrugsComInfo(medication);
      } else {
        // Use comprehensive database source
        info = await fetchComprehensiveMedicationData(medication);
      }
      
      if (info) {
        console.log('Medication info received:', info.name);
        setMedicationInfo(info);
        setNewMedication(prev => ({
          ...prev,
          name: info.name,
          id: uuidv4(),
          dosage: '',
          frequency: 'Once daily',
          reason: '',
          startDate: new Date().toISOString().split('T')[0],
        }));
        toast.success(`Information loaded for ${info.name}`);
      } else {
        console.error('No information returned for:', medication);
        setError(`No information found for ${medication}`);
      }
    } catch (error) {
      console.error('Error fetching medication information:', error);
      setError('Unable to load medication information. Please try another medication or try again later.');
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

  const resetSearch = () => {
    setMedicationInfo(null);
    setSelectedMedication(null);
    setError(null);
    setShowAddForm(false);
    setSearchAttempted(false);
    setNewMedication({
      id: uuidv4(),
      dosage: '',
      frequency: 'Once daily',
      reason: '',
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddMedication = (medication: Medication) => {
    if (onAddMedication) {
      try {
        onAddMedication(medication);
        setShowAddForm(false);
        resetSearch();
        toast.success(`${medication.name} added to your medications`);
      } catch (error) {
        console.error('Error adding medication:', error);
        toast.error('Failed to add medication. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
        <div className="bg-safet-600 text-white px-5 py-3 font-medium flex items-center justify-between">
          <span>Search Medication Database</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={openDrugsComPage}
            disabled={!selectedMedication || activeDataSource !== 'drugscom'}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Visit Drugs.com
          </Button>
        </div>
        
        <div className="border-b border-[#D1DEE8]">
          <Tabs value={activeDataSource} onValueChange={(value) => setActiveDataSource(value as 'drugscom' | 'comprehensive')}>
            <TabsList className="w-full">
              <TabsTrigger value="drugscom" className="flex-1">
                Drugs.com Database
              </TabsTrigger>
              <TabsTrigger value="comprehensive" className="flex-1">
                <Database className="h-4 w-4 mr-1" />
                Comprehensive Database
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-5">
          {(!medicationInfo && !isLoading && !error) || (!searchAttempted) ? (
            <>
              {activeDataSource === 'comprehensive' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200 text-blue-800 text-sm">
                  The comprehensive database includes all medications, vitamins, and supplements currently on the market. 
                  Search for any medication name to retrieve information.
                </div>
              )}
              <MedicationSearch onSelectMedication={selectMedication} />
            </>
          ) : null}
          
          {isLoading && (
            <div className="flex justify-center p-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-safet-500" />
                <span className="text-gray-600">
                  Loading medication information from {activeDataSource === 'drugscom' ? 'Drugs.com' : 'comprehensive database'}...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {(medicationInfo || error || isLoading) && searchAttempted && (
        <MedicationInfoDisplay 
          medicationInfo={medicationInfo}
          selectedMedication={selectedMedication}
          onResetSearch={resetSearch}
          onAddToProfile={handleAddToProfile}
          canAddToProfile={Boolean(onAddMedication)}
          isLoading={isLoading}
          error={error}
          dataSource={activeDataSource === 'drugscom' ? 'Drugs.com' : 'Comprehensive Database'}
        />
      )}

      {medicationInfo && showAddForm && (
        <MedicationAddForm 
          medicationInfo={medicationInfo}
          open={showAddForm}
          onOpenChange={setShowAddForm}
          onAddMedication={handleAddMedication}
          newMedication={newMedication}
          setNewMedication={setNewMedication}
        />
      )}
    </div>
  );
};

export default DrugInfoLookup;
