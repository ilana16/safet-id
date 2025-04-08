import React, { useState } from 'react';
import { getDrugsComUrl } from '@/utils/drugsComApi';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, Database, Archive, BookOpen, AlertTriangle, Microscope } from 'lucide-react';
import { MedicationInfo } from '@/utils/medicationData.d';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Medication } from '@/pages/medical-profile/MedicationsSection';
import MedicationSearch from './drug-lookup/MedicationSearch';
import MedicationInfoDisplay from './drug-lookup/MedicationInfoDisplay';
import MedicationAddForm from './drug-lookup/MedicationAddForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
  const [activeDataSource, setActiveDataSource] = useState<'drugscom' | 'elsevier' | 'comprehensive' | 'webcrawler' | 'modrugs' | 'comprehensive'>('drugscom');
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
      
      const preferredSource = activeDataSource === 'elsevier' 
        ? 'elsevier' 
        : activeDataSource === 'webcrawler'
          ? 'webcrawler'
          : activeDataSource === 'modrugs'
            ? 'modrugs'
            : 'drugscom';
      
      const medInfo = await getMedicationFromDb(medication, userId, preferredSource);
      
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
      const drugsComUrl = getDrugsComUrl(selectedMedication);
      window.open(drugsComUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const openElsevierPage = () => {
    if (selectedMedication) {
      window.open('https://druginfo.elsevier.com/docs/api/docs.json', '_blank', 'noopener,noreferrer');
    }
  };

  const openWebCrawlerPage = () => {
    if (selectedMedication) {
      window.open('https://github.com/shubhpawar/Web-Crawler-for-Drug-Interaction-Data', '_blank', 'noopener,noreferrer');
    }
  };

  const openMoDrugsPage = () => {
    if (selectedMedication) {
      window.open('https://github.com/Liuzhe30/modrugs', '_blank', 'noopener,noreferrer');
    }
  };

  const openExternalPage = () => {
    if (selectedMedication) {
      if (activeDataSource === 'elsevier') {
        openElsevierPage();
      } else if (activeDataSource === 'webcrawler') {
        openWebCrawlerPage();
      } else if (activeDataSource === 'modrugs') {
        openMoDrugsPage();
      } else {
        openDrugsComPage();
      }
    }
  };

  const handleDirectExternalSearch = (query: string) => {
    if (!query || query.trim() === '') return;
    
    if (activeDataSource === 'elsevier') {
      window.open('https://druginfo.elsevier.com', '_blank', 'noopener,noreferrer');
      toast.info(`Searching for "${query}" on Elsevier`);
    } else if (activeDataSource === 'webcrawler') {
      window.open('https://github.com/shubhpawar/Web-Crawler-for-Drug-Interaction-Data', '_blank', 'noopener,noreferrer');
      toast.info(`Showing Web Crawler for Drug Interaction Data repository`);
    } else if (activeDataSource === 'modrugs') {
      window.open('https://github.com/Liuzhe30/modrugs', '_blank', 'noopener,noreferrer');
      toast.info(`Showing MoDrugs GitHub repository`);
    } else {
      const searchUrl = `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(query)}`;
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
      toast.info(`Searching for "${query}" on Drugs.com`);
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
            onClick={openExternalPage}
            disabled={!selectedMedication}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">
              {activeDataSource === 'drugscom' && 'View on Drugs.com'}
              {activeDataSource === 'elsevier' && 'View on Elsevier'}
              {activeDataSource === 'webcrawler' && 'View Web Crawler Data'}
              {activeDataSource === 'modrugs' && 'View MoDrugs Data'}
              {activeDataSource === 'comprehensive' && 'View on Database'}
            </span>
            <span className="sm:hidden">External</span>
          </Button>
        </div>
        
        <div className="border-b border-[#D1DEE8]">
          <Tabs 
            value={activeDataSource} 
            onValueChange={(value) => setActiveDataSource(value as 'drugscom' | 'elsevier' | 'webcrawler' | 'modrugs' | 'comprehensive')}
          >
            <TabsList className="w-full">
              <TabsTrigger value="drugscom" className="flex-1">
                <Database className="h-4 w-4 mr-1" />
                Drugs.com
                {medicationInfo?.fromDatabase && medicationInfo?.source?.includes('Drugs.com') && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs py-0.5 px-1.5 rounded-full flex items-center">
                    <Archive className="h-3 w-3 mr-1" />
                    Saved
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="elsevier" className="flex-1">
                <BookOpen className="h-4 w-4 mr-1" />
                Elsevier
                {medicationInfo?.fromDatabase && medicationInfo?.source?.includes('Elsevier') && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs py-0.5 px-1.5 rounded-full flex items-center">
                    <Archive className="h-3 w-3 mr-1" />
                    Saved
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="webcrawler" className="flex-1">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Interactions
                {medicationInfo?.fromDatabase && medicationInfo?.source?.includes('Web Crawler') && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs py-0.5 px-1.5 rounded-full flex items-center">
                    <Archive className="h-3 w-3 mr-1" />
                    Saved
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="modrugs" className="flex-1">
                <Microscope className="h-4 w-4 mr-1" />
                Molecular
                {medicationInfo?.fromDatabase && medicationInfo?.source?.includes('MoDrugs') && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs py-0.5 px-1.5 rounded-full flex items-center">
                    <Archive className="h-3 w-3 mr-1" />
                    Saved
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="comprehensive" className="flex-1">
                <Database className="h-4 w-4 mr-1" />
                All Sources
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="p-5">
          {(!medicationInfo && !isLoading && !error) || (!searchAttempted) ? (
            <>
              {activeDataSource === 'elsevier' && (
                <div className="mb-4 p-3 bg-indigo-50 rounded-md border border-indigo-200 text-indigo-800 text-sm">
                  The Elsevier Drug Info database provides comprehensive clinical information about medications,
                  including drug interactions, side effects, and dosing guidelines.
                </div>
              )}
              
              {activeDataSource === 'webcrawler' && (
                <div className="mb-4 p-3 bg-amber-50 rounded-md border border-amber-200 text-amber-800 text-sm">
                  This database uses the Web Crawler for Drug Interaction Data to provide detailed information on drug-drug,
                  drug-food, and drug-disease interactions. Data sourced from shubhpawar's GitHub repository.
                </div>
              )}
              
              {activeDataSource === 'modrugs' && (
                <div className="mb-4 p-3 bg-purple-50 rounded-md border border-purple-200 text-purple-800 text-sm">
                  The MoDrugs database provides molecular-level drug information and interactions.
                  This specialized database focuses on pharmacokinetics and receptor-level interactions.
                  Data sourced from Liuzhe30's MoDrugs GitHub repository.
                </div>
              )}
              
              {activeDataSource === 'comprehensive' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200 text-blue-800 text-sm">
                  The comprehensive database includes all medications, vitamins, and supplements from multiple sources. 
                  Search for any medication name to retrieve information.
                </div>
              )}
              
              <MedicationSearch 
                onSelectMedication={selectMedication}
                activeDataSource={activeDataSource}
                onExternalSearch={handleDirectExternalSearch}
              />
            </>
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
              ? `${medicationInfo.source || 'Database'} (Searched ${medicationInfo.databaseSearchCount || 1} time${medicationInfo.databaseSearchCount !== 1 ? 's' : ''})`
              : activeDataSource === 'drugscom' 
                ? 'Drugs.com Live' 
                : activeDataSource === 'elsevier'
                  ? 'Elsevier Drug Info Live'
                  : activeDataSource === 'webcrawler'
                    ? 'Web Crawler Interaction Data'
                    : activeDataSource === 'modrugs'
                      ? 'MoDrugs Molecular Database'
                      : 'Comprehensive Database'
          }
          onOpenExternalLink={openExternalPage}
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
