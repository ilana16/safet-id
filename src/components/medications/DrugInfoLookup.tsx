import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, AlertTriangle } from 'lucide-react';
import { MedicationInfo } from '@/utils/medicationData.d';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Medication } from '@/pages/medical-profile/MedicationsSection';
import MedicationSearch from './drug-lookup/MedicationSearch';
import MedicationInfoDisplay from './drug-lookup/MedicationInfoDisplay';
import MedicationAddForm from './drug-lookup/MedicationAddForm';
import { supabase } from '@/integrations/supabase/client';
import { getMedicationFromDb, getDrugsComUrl } from '@/utils/medication-db';

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
  const [searchTimeoutId, setSearchTimeoutId] = useState<number | null>(null);
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

  React.useEffect(() => {
    return () => {
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
      }
    };
  }, [searchTimeoutId]);

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
    
    if (searchTimeoutId) {
      clearTimeout(searchTimeoutId);
    }
    
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
      setError('The search took too long to complete. Please try again.');
      toast.error('Search timed out. Please try again.');
    }, 15000);
    
    setSearchTimeoutId(timeoutId);
    
    try {
      console.log(`Fetching information for medication: ${medication} from database or fallback data`);
      
      const medInfo = await getMedicationFromDb(medication, userId, 'drugscom');
      
      if (searchTimeoutId) {
        clearTimeout(timeoutId);
        setSearchTimeoutId(null);
      }
      
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
        setError(`No information found for ${medication}. Please check the spelling or try another medication.`);
        toast.error(`No information found for ${medication}`);
      }
    } catch (error) {
      console.error('Error fetching medication information:', error);
      setError(error instanceof Error && error.message.includes('timed out')
        ? 'The search took too long to complete. Please try again with a different medication.'
        : 'Unable to load medication information. Please try another medication or try again later.');
      toast.error('Error loading medication information');
    } finally {
      setIsLoading(false);
      if (searchTimeoutId) {
        clearTimeout(timeoutId);
        setSearchTimeoutId(null);
      }
    }
  };

  const openDrugsComPage = () => {
    if (selectedMedication) {
      if (medicationInfo?.drugsComUrl) {
        window.open(medicationInfo.drugsComUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.open(getDrugsComUrl(selectedMedication), '_blank', 'noopener,noreferrer');
      }
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
          <span>Medication Information Lookup</span>
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
              <p className="font-medium mb-1">Using Enhanced Medication Database</p>
              This feature provides comprehensive medication information including:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Medication interactions (major, moderate, minor)</li>
                <li>Medical condition interactions</li>
                <li>Food interactions</li>
                <li>Therapeutic duplications</li>
                <li>Detailed side effects</li>
                <li>Pregnancy and breastfeeding information</li>
                <li>Drug half-life data</li>
              </ul>
              <div className="mt-2 text-amber-700">
                <strong>Note:</strong> We use an enhanced database of medications to ensure reliable information regardless of external API availability.
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
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-safet-500" />
                  <span className="text-gray-600">
                    {medicationInfo?.fromDatabase 
                      ? 'Loading saved medication information...' 
                      : 'Running Python scraper on Drugs.com...'}
                  </span>
                </div>
                
                <div className="w-full max-w-sm bg-gray-100 rounded-full h-2.5">
                  <div className="bg-safet-500 h-2.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={resetSearch}
                >
                  Cancel Search
                </Button>
              </div>
            </div>
          )}
          
          {error && searchAttempted && !isLoading && (
            <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium">Error searching for medication information</p>
                  <p className="text-sm">{error}</p>
                  <div className="pt-2 flex space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={resetSearch}
                    >
                      Try Another Medication
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDirectExternalSearch(selectedMedication || '')}
                    >
                      Search on Drugs.com
                    </Button>
                  </div>
                </div>
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
              ? `Python Drugs.com Scraper (Searched ${medicationInfo.databaseSearchCount || 1} time${medicationInfo.databaseSearchCount !== 1 ? 's' : ''})`
              : 'Python Drugs.com Scraper'
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
