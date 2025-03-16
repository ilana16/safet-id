
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Pill, PillIcon, ArrowRight } from 'lucide-react';
import { searchDrugsCom } from '@/utils/drugsComApi';

interface MedicationSearchProps {
  onSelectMedication: (medication: string) => void;
}

const MedicationSearch: React.FC<MedicationSearchProps> = ({ onSelectMedication }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  React.useEffect(() => {
    const savedHistory = localStorage.getItem('medicationSearchHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing medication search history:', e);
      }
    }
  }, []);

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
    
    setIsSearching(true);
    
    try {
      const results = await searchDrugsCom(query);
      setSearchResults(results);
      
      if (results.length === 1 && results[0].toLowerCase() === query.toLowerCase()) {
        handleSelectMedication(results[0]);
      }
    } catch (error) {
      console.error('Error searching medications:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMedication = (medication: string) => {
    onSelectMedication(medication);
    setQuery(medication);
    setSearchResults([]);
  };

  return (
    <div>
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
          
          {searchResults.length > 0 && query.length >= 2 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              <ul className="py-1">
                {searchResults.map((result, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={() => handleSelectMedication(result)}
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
          disabled={isSearching || query.length < 2}
          className="bg-safet-500 hover:bg-safet-600"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          <span className="ml-2">Search</span>
        </Button>
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
          <h3 className="text-sm font-medium text-gray-500 mb-2">Popular medications:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {['lisinopril', 'metformin', 'atorvastatin', 'levothyroxine', 'amoxicillin', 'amlodipine'].map((drug, index) => (
              <Card 
                key={index} 
                className="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200"
                onClick={() => handleSelectMedication(drug)}
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
  );
};

export default MedicationSearch;
