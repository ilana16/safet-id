
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, X, Database, ExternalLink, PillIcon, ArrowRight, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Pill } from 'lucide-react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { performMedicationSearch } from '@/utils/medication-db'; 

interface MedicationSearchProps {
  onSelectMedication: (medication: string) => void;
  onExternalSearch?: (query: string) => void;
}

const MedicationSearch: React.FC<MedicationSearchProps> = ({ 
  onSelectMedication,
  onExternalSearch
}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchTimeoutId, setSearchTimeoutId] = useState<number | null>(null);
  const [autoSearchEnabled, setAutoSearchEnabled] = useState(false);
  const debouncedSearchTerm = useDebounce(query, 300, autoSearchEnabled);

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
    
    return () => {
      if (searchTimeoutId) {
        clearTimeout(searchTimeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (!autoSearchEnabled || debouncedSearchTerm.length < 2) {
      return;
    }
    
    performSearch(debouncedSearchTerm, true);
  }, [debouncedSearchTerm, autoSearchEnabled]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSearchError(null);
    
    if (!autoSearchEnabled && searchResults.length > 0) {
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setSearchError(null);
    
    if (searchTimeoutId) {
      clearTimeout(searchTimeoutId);
      setSearchTimeoutId(null);
    }
  };

  const performSearch = async (searchTerm: string, isAuto = false) => {
    if (searchTerm.length < 2) return;
    
    if (searchTimeoutId) {
      clearTimeout(searchTimeoutId);
      setSearchTimeoutId(null);
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    const timeoutDuration = isAuto ? 8000 : 15000;
    
    try {
      const timeoutId = window.setTimeout(() => {
        setIsSearching(false);
        setSearchError('Search request timed out. Please try again with a simpler query.');
        toast.error('Search timed out. Please try again.');
      }, timeoutDuration);
      
      setSearchTimeoutId(timeoutId);
      
      console.log(`${isAuto ? 'Auto' : 'Manual'} search for:`, searchTerm);
      const results = await performMedicationSearch(searchTerm);
      
      clearTimeout(timeoutId);
      setSearchTimeoutId(null);
      
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info(`No results found for "${searchTerm}"`);
      } else if (!isAuto && results.length === 1 && results[0].toLowerCase() === searchTerm.toLowerCase()) {
        handleSelectMedication(results[0]);
      }
    } catch (error) {
      console.error('Error searching medications:', error);
      
      const errorMessage = error instanceof Error 
        ? (error.message.includes('timed out') 
            ? 'Search request timed out. Please try with a shorter medication name.' 
            : error.message)
        : 'Error searching for medications';
      
      setSearchError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(query);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    if (searchTimeoutId) {
      clearTimeout(searchTimeoutId);
      setSearchTimeoutId(null);
    }
  };

  const handleSelectMedication = (medication: string) => {
    const updatedHistory = [medication, ...history.filter(item => item !== medication)].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('medicationSearchHistory', JSON.stringify(updatedHistory));
    
    onSelectMedication(medication);
    setQuery(medication);
    setSearchResults([]);
    setSearchError(null);
  };

  const handleExternalSearch = () => {
    if (onExternalSearch && query.length >= 2) {
      onExternalSearch(query);
    } else if (query.length < 2) {
      toast.error('Please enter at least 2 characters to search');
    }
  };

  const handleToggleAutoSearch = () => {
    setAutoSearchEnabled(!autoSearchEnabled);
    toast.info(`Auto-search ${!autoSearchEnabled ? 'enabled' : 'disabled'}`);
  };

  const popularMedicationCategories = {
    "Common Medications": ['lisinopril', 'metformin', 'atorvastatin', 'amoxicillin'],
    "Psychiatric Medications": ['fluoxetine', 'escitalopram', 'risperidone', 'lithium'],
    "Vitamins & Supplements": ['vitamin d', 'calcium', 'iron', 'omega-3']
  };

  return (
    <div>
      <div className="mb-3 p-3 bg-amber-50 rounded-md border border-amber-200 text-amber-800 text-sm flex items-center">
        <Database className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
        <span>
          Searching our enhanced medication database for faster results
        </span>
      </div>
      
      <div className="flex justify-end mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Auto-search</span>
          <Switch 
            checked={autoSearchEnabled} 
            onCheckedChange={handleToggleAutoSearch}
            aria-label="Toggle auto-search"
          />
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Enter medication name (e.g., aspirin, lisinopril, metformin)..."
            value={query}
            onChange={handleSearchChange}
            className="pl-10 w-full pr-10"
            autoComplete="off"
            disabled={isSearching}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          
          {query && !isSearching && (
            <button 
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          {searchResults.length > 0 && query.length >= 2 && !isSearching && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {searchResults.map((result, index) => {
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
        
        {isSearching ? (
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleCancelSearch}
          >
            <X className="h-4 w-4" />
            <span className="ml-2">Cancel</span>
          </Button>
        ) : (
          <Button 
            type="submit" 
            disabled={query.length < 2}
            className="bg-safet-500 hover:bg-safet-600"
          >
            <Search className="h-4 w-4" />
            <span className="ml-2">Search</span>
          </Button>
        )}
        
        {onExternalSearch && (
          <Button 
            type="button" 
            variant="outline"
            onClick={handleExternalSearch}
            disabled={query.length < 2 || isSearching}
            className="text-safet-500 border-safet-200"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Search on Drugs.com</span>
            <span className="sm:hidden">External</span>
          </Button>
        )}
      </form>

      {searchError && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center">
          <AlertTriangle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium">Search error</p>
            <p>{searchError}</p>
            <div className="mt-2 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={() => setSearchError(null)}
              >
                Dismiss
              </Button>
              
              {searchError.includes('timed out') && (
                <Button
                  variant="default"
                  size="sm"
                  className="bg-safet-500 hover:bg-safet-600"
                  onClick={() => performSearch(query)}
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {isSearching && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-700 flex items-center">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-3" />
          <div>
            <p className="font-medium">Searching for medications...</p>
            <p className="text-sm mt-1">This may take a moment. We're searching our enhanced database.</p>
          </div>
        </div>
      )}
      
      {history.length > 0 && !isSearching && !searchError && (
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
      
      {!query && !searchError && !isSearching && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Common Medications by Category</h3>
          {Object.entries(popularMedicationCategories).map(([categoryName, medications], catIndex) => (
            <div key={catIndex} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                {categoryName === "Psychiatric Medications" ? (
                  <Database className="h-4 w-4 text-safet-500 mr-2" />
                ) : categoryName === "Vitamins & Supplements" ? (
                  <Database className="h-4 w-4 text-green-500 mr-2" />
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
                        <Database className="h-4 w-4 text-safet-500 mr-2" />
                      ) : categoryName === "Vitamins & Supplements" ? (
                        <Database className="h-4 w-4 text-green-500 mr-2" />
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
