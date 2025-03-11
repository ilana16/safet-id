
import React, { useState, useEffect } from 'react';
import { searchDrugsCom, getDrugsComInfo } from '@/utils/drugsComApi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, Loader2, PillIcon, Pill, ExternalLink } from 'lucide-react';
import MedicationInfo from './MedicationInfo';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DrugInfoLookup: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [medicationInfo, setMedicationInfo] = useState<MedicationInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  
  useEffect(() => {
    const savedHistory = localStorage.getItem('medicationSearchHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing medication search history:', e);
      }
    }
  }, []);
  
  const saveHistory = (medication: string) => {
    let newHistory = [...history];
    
    newHistory = newHistory.filter(item => item !== medication);
    
    newHistory.unshift(medication);
    
    newHistory = newHistory.slice(0, 5);
    
    setHistory(newHistory);
    localStorage.setItem('medicationSearchHistory', JSON.stringify(newHistory));
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      setIsSearching(true);
      try {
        const results = await searchDrugsCom(value);
        setSearchResults(results);
      } catch (error) {
        console.error('Error searching medications:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length < 2) return;
    
    setIsLoading(true);
    
    try {
      const results = await searchDrugsCom(query);
      setSearchResults(results);
      
      if (results.length === 1 && results[0].toLowerCase() === query.toLowerCase()) {
        await selectMedication(results[0]);
      }
    } catch (error) {
      console.error('Error searching medications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectMedication = async (medication: string) => {
    setSelectedMedication(medication);
    setIsLoading(true);
    saveHistory(medication);
    
    try {
      const info = await getDrugsComInfo(medication);
      setMedicationInfo(info);
    } catch (error) {
      console.error('Error fetching medication information:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#D1DEE8] rounded-md overflow-hidden">
        <div className="bg-safet-600 text-white px-5 py-3 font-medium">
          Search Medications Database
        </div>
        <div className="p-5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Enter medication name..."
                value={query}
                onChange={handleSearchChange}
                className="pl-10 w-full"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              
              {searchResults.length > 0 && query.length >= 2 && !medicationInfo && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  <ul className="py-1">
                    {searchResults.map((result, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => {
                          selectMedication(result);
                          setQuery(result);
                          setSearchResults([]);
                        }}
                      >
                        <Pill className="h-4 w-4 text-safet-500 mr-2" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || query.length < 2}
              className="bg-safet-500 hover:bg-safet-600"
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="ml-2">Search</span>
            </Button>
          </form>
          
          {history.length > 0 && !medicationInfo && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {history.map((item, index) => (
                  <Badge 
                    key={index}
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
                    onClick={() => {
                      setQuery(item);
                      selectMedication(item);
                    }}
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {!query && !medicationInfo && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Popular medications:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {['lisinopril', 'metformin', 'atorvastatin', 'levothyroxine', 'amoxicillin', 'amlodipine'].map((drug, index) => (
                  <Card 
                    key={index} 
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200"
                    onClick={() => {
                      setQuery(drug);
                      selectMedication(drug);
                    }}
                  >
                    <div className="flex items-center">
                      <PillIcon className="h-4 w-4 text-safet-500 mr-2" />
                      <span className="text-gray-700">{drug}</span>
                      <ArrowRight className="h-3 w-3 text-gray-400 ml-auto" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center p-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-safet-500" />
            <span className="text-gray-600">Loading medication information...</span>
          </div>
        </div>
      )}
      
      {medicationInfo && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              className="text-safet-600" 
              onClick={() => {
                setMedicationInfo(null);
                setSelectedMedication(null);
              }}
            >
              Back to Search
            </Button>
            
            {medicationInfo.drugsComUrl && (
              <Button variant="outline" className="text-safet-600" asChild>
                <a 
                  href={medicationInfo.drugsComUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View on Drugs.com
                </a>
              </Button>
            )}
          </div>
          
          <MedicationInfo medication={medicationInfo} />
        </div>
      )}
    </div>
  );
};

export default DrugInfoLookup;
