
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, X, Globe, Brain, Database, ExternalLink, AlertTriangle, Microscope } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Pill, PillIcon, ArrowRight } from 'lucide-react';
import { performUnifiedMedicationSearch } from '@/utils/modrugsApi';
import { getMedicationFromDb } from '@/utils/medicationDbUtils';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';

interface MedicationSearchProps {
  onSelectMedication: (medication: string) => void;
  activeDataSource?: 'drugscom' | 'elsevier' | 'comprehensive' | 'webcrawler' | 'modrugs';
  onExternalSearch?: (query: string) => void;
}

interface SearchResultItem {
  name: string;
  source?: 'local' | 'rxnorm' | 'dailymed' | 'who' | 'ema' | 'emaIris';
}

const MedicationSearch: React.FC<MedicationSearchProps> = ({ 
  onSelectMedication,
  activeDataSource = 'drugscom',
  onExternalSearch
}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const debouncedSearchTerm = useDebounce(query, 300);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    
    getCurrentUser();
    
    const savedHistory = localStorage.getItem('medicationSearchHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing medication search history:', e);
      }
    }
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.length >= 2) {
        setIsSearching(true);
        try {
          let results: string[] = [];
          
          if (activeDataSource === 'comprehensive') {
            // Search all databases
            results = await performUnifiedMedicationSearch(debouncedSearchTerm);
          } else {
            // Search specific database
            results = await performUnifiedMedicationSearch(
              debouncedSearchTerm, 
              [activeDataSource as 'drugscom' | 'elsevier' | 'webcrawler' | 'modrugs']
            );
          }
          
          setSearchResults(results);
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

    performSearch();
  }, [debouncedSearchTerm, activeDataSource]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchResults([]);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 2) return;
    
    setIsSearching(true);
    
    try {
      let results: string[] = [];
      
      if (activeDataSource === 'comprehensive') {
        // Search all databases
        results = await performUnifiedMedicationSearch(query);
      } else {
        // Search specific database
        results = await performUnifiedMedicationSearch(
          query, 
          [activeDataSource as 'drugscom' | 'elsevier' | 'webcrawler' | 'modrugs']
        );
      }
      
      setSearchResults(results);
      
      if (results.length === 1 && results[0].toLowerCase() === query.toLowerCase()) {
        handleSelectMedication(results[0]);
      }
    } catch (error) {
      console.error('Error searching medications:', error);
      toast.error('Error searching medications');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMedication = (medication: string) => {
    const updatedHistory = [medication, ...history.filter(item => item !== medication)].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('medicationSearchHistory', JSON.stringify(updatedHistory));
    
    getMedicationFromDb(medication, userId);
    
    onSelectMedication(medication);
    setQuery(medication);
    setSearchResults([]);
  };

  const handleExternalSearch = () => {
    if (onExternalSearch && query.length >= 2) {
      onExternalSearch(query);
    } else if (query.length < 2) {
      toast.error('Please enter at least 2 characters to search');
    }
  };

  const getPopularMedications = () => {
    if (activeDataSource === 'webcrawler') {
      return {
        "Common Medications": ['lisinopril', 'metformin', 'atorvastatin', 'amoxicillin'],
        "Drug Interactions": ['warfarin', 'clopidogrel', 'digoxin', 'lithium']
      };
    } else if (activeDataSource === 'modrugs') {
      return {
        "Molecular Database": ['metformin', 'losartan', 'atorvastatin', 'lisinopril'],
        "Complex Medications": ['insulin glargine', 'montelukast', 'escitalopram', 'levothyroxine']
      };
    } else if (activeDataSource === 'comprehensive') {
      return {
        "Common Medications": ['lisinopril', 'metformin', 'atorvastatin', 'amoxicillin'],
        "Psychiatric Medications": ['fluoxetine', 'escitalopram', 'risperidone', 'lithium'],
        "Vitamins & Supplements": ['vitamin d', 'calcium', 'iron', 'omega-3']
      };
    }
    
    return {
      "Common Medications": ['lisinopril', 'metformin', 'atorvastatin', 'amoxicillin'],
      "Psychiatric Medications": ['fluoxetine', 'escitalopram', 'risperidone', 'lithium']
    };
  };

  const popularMedicationCategories = getPopularMedications();

  return (
    <div>
      <div className="mb-3 p-3 bg-blue-50 rounded-md border border-blue-200 text-blue-800 text-sm flex items-center">
        <Database className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
        <span>
          {activeDataSource === 'drugscom' && 'Performing live searches against Drugs.com'}
          {activeDataSource === 'elsevier' && 'Performing live searches against Elsevier medication database'}
          {activeDataSource === 'webcrawler' && 'Using Web Crawler for Drug Interaction Data'}
          {activeDataSource === 'modrugs' && 'Using MoDrugs molecular-level drug database'}
          {activeDataSource === 'comprehensive' && 'Searching across all medication databases for comprehensive results'}
        </span>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={`Enter ${activeDataSource === 'comprehensive' ? 'medication, vitamin, or supplement' : 'medication'} name...`}
            value={query}
            onChange={handleSearchChange}
            className="pl-10 w-full pr-10"
            autoComplete="off"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          
          {query && (
            <button 
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          {searchResults.length > 0 && query.length >= 2 && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {searchResults.map((result, index) => {
                  const isInternational = 
                    result.includes('(EMA)') || 
                    result.includes('IRIS') ||
                    /\b[A-Z]{2,}\b/.test(result);
                  
                  const isVitaminOrSupplement = 
                    /\b(vitamin|supplement|mineral|herb|omega|fish oil|probiotics)\b/i.test(result);
                    
                  return (
                    <li 
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => handleSelectMedication(result)}
                    >
                      {isVitaminOrSupplement ? (
                        <PillIcon className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <Pill className="h-4 w-4 text-safet-500 mr-2" />
                      )}
                      <span>{result}</span>
                      {isInternational && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                          <Globe className="h-3 w-3 mr-1" />
                          <span className="text-xs">Int'l</span>
                        </Badge>
                      )}
                      {isVitaminOrSupplement && (
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">
                          <span className="text-xs">Supplement</span>
                        </Badge>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isSearching || query.length < 2}
          className="bg-safet-500 hover:bg-safet-600"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="ml-2">Search</span>
        </Button>
        
        {onExternalSearch && (
          <Button 
            type="button" 
            variant="outline"
            onClick={handleExternalSearch}
            disabled={query.length < 2}
            className="text-safet-500 border-safet-200"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Search on {activeDataSource === 'drugscom' ? 'Drugs.com' : 'External Site'}</span>
            <span className="sm:hidden">External</span>
          </Button>
        )}
      </form>
      
      {history.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Recent searches:</p>
          <div className="flex flex-wrap gap-2">
            {history.map((item, index) => (
              <Badge 
                key={index}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectMedication(item)}
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {!query && (
        <div className="mt-6">
          {Object.entries(popularMedicationCategories).map(([categoryName, medications], catIndex) => (
            <div key={catIndex} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                {categoryName === "Psychiatric Medications" ? (
                  <Brain className="h-4 w-4 text-safet-500 mr-2" />
                ) : categoryName === "Vitamins & Supplements" ? (
                  <Database className="h-4 w-4 text-green-500 mr-2" />
                ) : categoryName === "Drug Interactions" ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                ) : categoryName === "Molecular Database" || categoryName === "Complex Medications" ? (
                  <Microscope className="h-4 w-4 text-purple-500 mr-2" />
                ) : (
                  <PillIcon className="h-4 w-4 text-safet-500 mr-2" />
                )}
                {categoryName}:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {medications.map((drug, index) => (
                  <Card 
                    key={index} 
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200"
                    onClick={() => handleSelectMedication(drug)}
                  >
                    <div className="flex items-center">
                      {categoryName === "Psychiatric Medications" ? (
                        <Brain className="h-4 w-4 text-safet-500 mr-2" />
                      ) : categoryName === "Vitamins & Supplements" ? (
                        <Database className="h-4 w-4 text-green-500 mr-2" />
                      ) : categoryName === "Drug Interactions" ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                      ) : categoryName === "Molecular Database" || categoryName === "Complex Medications" ? (
                        <Microscope className="h-4 w-4 text-purple-500 mr-2" />
                      ) : (
                        <PillIcon className="h-4 w-4 text-safet-500 mr-2" />
                      )}
                      <span className="text-gray-700">{drug}</span>
                      <ArrowRight className="h-3 w-3 text-gray-400 ml-auto" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationSearch;
