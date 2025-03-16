
import React, { useState } from 'react';
import { getDrugsComInfo, getDrugsComUrl } from '@/utils/drugsComApi';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Medication } from '@/pages/medical-profile/MedicationsSection';

// Import our new components
import MedicationSearch from './drug-lookup/MedicationSearch';
import MedicationInfoDisplay from './drug-lookup/MedicationInfoDisplay';
import MedicationAddForm from './drug-lookup/MedicationAddForm';

interface DrugInfoLookupProps {
  onAddMedication?: (medication: Medication) => void;
}

const DrugInfoLookup: React.FC<DrugInfoLookupProps> = ({ onAddMedication }) => {
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [medicationInfo, setMedicationInfo] = useState<MedicationInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    id: uuidv4(),
    dosage: '',
    frequency: 'Once daily',
    reason: '',
    startDate: new Date().toISOString().split('T')[0],
  });
  
  const saveHistory = (medication: string) => {
    const savedHistory = localStorage.getItem('medicationSearchHistory');
    let newHistory: string[] = savedHistory ? JSON.parse(savedHistory) : [];
    
    newHistory = newHistory.filter(item => item !== medication);
    newHistory.unshift(medication);
    newHistory = newHistory.slice(0, 5);
    
    localStorage.setItem('medicationSearchHistory', JSON.stringify(newHistory));
  };

  const selectMedication = async (medication: string) => {
    setSelectedMedication(medication);
    setIsLoading(true);
    saveHistory(medication);
    
    try {
      const info = await getDrugsComInfo(medication);
      if (info) {
        setMedicationInfo(info);
        setNewMedication({
          ...newMedication,
          name: info.name
        });
        toast.success(`Information loaded from Drugs.com for ${medication}`);
      } else {
        throw new Error("Could not retrieve medication information");
      }
    } catch (error) {
      console.error('Error fetching medication information:', error);
      toast.error('Error loading medication information');
      setMedicationInfo(null);
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
  };

  const handleAddMedication = (medication: Medication) => {
    if (onAddMedication) {
      onAddMedication(medication);
      setShowAddForm(false);
      resetSearch();
      setNewMedication({
        id: uuidv4(),
        dosage: '',
        frequency: 'Once daily',
        reason: '',
        startDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
        <div className="bg-safet-600 text-white px-5 py-3 font-medium flex items-center justify-between">
          <span>Search Drugs.com Database</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={openDrugsComPage}
            disabled={!selectedMedication}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Visit Drugs.com
          </Button>
        </div>
        <div className="p-5">
          {!medicationInfo && !isLoading && (
            <MedicationSearch onSelectMedication={selectMedication} />
          )}
          
          {isLoading && (
            <div className="flex justify-center p-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-safet-500" />
                <span className="text-gray-600">Loading medication information from Drugs.com...</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {medicationInfo && (
        <MedicationInfoDisplay 
          medicationInfo={medicationInfo}
          selectedMedication={selectedMedication}
          onResetSearch={resetSearch}
          onAddToProfile={handleAddToProfile}
          canAddToProfile={Boolean(onAddMedication)}
        />
      )}

      {medicationInfo && (
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
