import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ExternalLink, History, X, Loader2, Info, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { searchDrugsCom } from '@/utils/drugsComApi';
import { Pill } from '@/components/ui/pill';

interface MedicationSearchProps {
  onSelectMedication: (medication: string) => void;
  onExternalSearch: (query: string) => void;
}

const MedicationSearch: React.FC<MedicationSearchProps> = ({ onSelectMedication, onExternalSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('medicationSearchHistory');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (!searchTerm || searchTerm.length < 2) {
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      const results = await searchDrugsCom(searchTerm);
      // Extract just the names for the search results display
      const medicationNames = results.map(result => result.name);
      setSearchResults(medicationNames);
    } catch (error) {
      console.error('Error searching medications:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectMedication = (medication: string) => {
    onSelectMedication(medication);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const selectHistoryItem = (item: string) => {
    setSearchTerm(item);
    handleSearch();
    setShowHistory(false);
  };

  const clearHistory = () => {
    localStorage.removeItem('medicationSearchHistory');
    setSearchHistory([]);
  };

  const handleExternalSearch = () => {
    onExternalSearch(searchTerm);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for a medication..."
            className="pr-10"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={isSearching || searchTerm.length < 2}>
          {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
          Search
        </Button>
        <Button variant="outline" onClick={toggleHistory} title="Search History">
          <History className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => setShowInfo(!showInfo)} title="Information">
          <Info className="h-4 w-4" />
        </Button>
      </div>

      {showInfo && (
        <Alert>
          <AlertDescription>
            Search for medications by name. You can click on a result to view detailed information about the medication, including usage, side effects, and interactions.
          </AlertDescription>
        </Alert>
      )}

      {showHistory && searchHistory.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Recent Searches</h3>
              <Button variant="ghost" size="sm" onClick={clearHistory}>
                Clear History
              </Button>
            </div>
            <ul className="space-y-1">
              {searchHistory.map((item, index) => (
                <li key={index}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => selectHistoryItem(item)}
                  >
                    <History className="mr-2 h-4 w-4" />
                    {item}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {isSearching ? (
        <div className="py-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-safet-500" />
          <p className="mt-2 text-gray-600">Searching medications...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium mb-2">Search Results:</h3>
          <div className="grid gap-2">
            {searchResults.map((result, index) => (
              <Card key={index} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <CardContent className="p-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <Pill className="mr-2 h-5 w-5 text-safet-500" />
                    <span>{result}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => selectMedication(result)}
                      className="text-safet-600"
                    >
                      <Info className="mr-1 h-4 w-4" />
                      Details
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://www.drugs.com/search.php?searchterm=${encodeURIComponent(result)}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : searchTerm && !isSearching ? (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 mb-3">No medications found matching "{searchTerm}"</p>
            <Button
              onClick={handleExternalSearch}
              variant="outline"
              className="mx-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Search on Drugs.com
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default MedicationSearch;
