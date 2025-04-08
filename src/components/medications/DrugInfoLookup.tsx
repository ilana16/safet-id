
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, Archive } from 'lucide-react';
import { MedicationInfo } from '@/utils/medicationData.d';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Medication } from '@/pages/medical-profile/MedicationsSection';
import MedicationSearch from './drug-lookup/MedicationSearch';
import MedicationInfoDisplay from './drug-lookup/MedicationInfoDisplay';
import MedicationAddForm from './drug-lookup/MedicationAddForm';
import { supabase } from '@/integrations/supabase/client';
import { getMedicationFromDb } from '@/utils/medicationDbUtils';

interface DrugInfoLookupProps {
  onAddMedication?: (medication: Medication) => void;
}

const DrugInfoLookup: React.FC<DrugInfoLookupProps> = ({ onAddMedication }) => {
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [medicationInfo, setMedicationInfo] = useState<MedicationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    id: uuidv4(),
    dosage: '',
    frequency: 'Once daily',
    reason: '',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    foodInteractions: [],
    conditionInteractions: [],
    therapeuticDuplications: [],
  });

  React.useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    
    getCurrentUser();
  }, []);

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
      console.log(`Fetching information for medication: ${medication} from database or API`);
      
      // Updated to use 'drugscom' instead of 'drugscomScraper'
      const medInfo = await getMedicationFromDb(medication, userId, 'drugscom');
      
      if (medInfo) {
        console.log('Medication info received:', medInfo.name);
        setMedicationInfo(medInfo);
        
        setNewMedication(prev => ({
          ...prev,
          name: medInfo.name,
          id: uuidv4(),
          dosage: '',
          frequency: 'Once daily',
          reason: '',
          startDate: new Date().toISOString().split('T')[0],
          notes: '',
          foodInteractions: medInfo.foodInteractions || [],
          conditionInteractions: medInfo.conditionInteractions || [],
          therapeuticDuplications: medInfo.therapeuticDuplications || [],
          pregnancy: medInfo.pregnancy || '',
          breastfeeding: medInfo.breastfeeding || '',
        }));
        
        toast.success(`Information loaded for ${medInfo.name}`);
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
      window.open(`https://www.drugs.com/search.php?searchterm=${encodeURIComponent(selectedMedication)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDirectExternalSearch = (query: string) => {
    if (!query || query.trim() === '') return;
    
    const searchUrl = `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
    toast.info(`Searching for "${query}" on Drugs.com`);
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
      notes: '',
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
            disabled={!selectedMedication}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">View on Drugs.com</span>
            <span className="sm:hidden">External</span>
          </Button>
        </div>
        
        <div className="p-5">
          {(!medicationInfo && !isLoading && !error) || (!searchAttempted) ? (
            <div className="mb-4 p-3 bg-amber-50 rounded-md border border-amber-200 text-amber-800 text-sm">
              This database uses the Drugs.com scraper to provide comprehensive medication information including 
              detailed side effects, interactions, and warnings.
              <div className="mt-2">
                <a href="https://github.com/miteoshi/Drugs.com-scrapper" target="_blank" rel="noopener noreferrer" className="underline">
                  View the Drugs.com scraper on GitHub
                </a>
              </div>
            </div>
          ) : null}
          
          {(!medicationInfo && !isLoading && !error) || (!searchAttempted) ? (
            <MedicationSearch 
              onSelectMedication={selectMedication}
              onExternalSearch={handleDirectExternalSearch}
            />
          ) : null}
          
          {isLoading && (
            <div className="flex justify-center p-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-safet-500" />
                <span className="text-gray-600">
                  Loading {medicationInfo?.fromDatabase ? 'saved' : 'live'} medication information...
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
          dataSource={
            medicationInfo?.fromDatabase
              ? `Drugs.com Scraper (Searched ${medicationInfo.databaseSearchCount || 1} time${medicationInfo.databaseSearchCount !== 1 ? 's' : ''})`
              : 'Drugs.com Scraper'
          }
          onOpenExternalLink={openDrugsComPage}
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
