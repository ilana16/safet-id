
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Search, ExternalLink } from 'lucide-react';
import { searchDrugInfo, getDrugsComUrl, searchDrugsCom } from '@/utils/drugsComApi';
import MedicationInfo from './MedicationInfo';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';

const DrugInfoLookup: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [medicationInfo, setMedicationInfo] = useState<MedicationInfoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const info = await searchDrugInfo(query);
      setMedicationInfo(info);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error searching for medication:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (value: string) => {
    setQuery(value);
    
    if (value.length >= 2) {
      try {
        const results = await searchDrugsCom(value);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error('Error getting suggestions:', error);
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowDropdown(false);
    handleSearch();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Drug Information Lookup</h2>
        <p className="text-gray-600 mb-4">
          Search for detailed information about medications, including dosage, side effects, and warnings.
        </p>
        
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter medication name"
              className="w-full"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectSuggestion(result)}
                  >
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleSearch}
            className="bg-safet-500 hover:bg-safet-600 min-w-[100px]"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Search
          </Button>
        </div>
      </div>
      
      {medicationInfo ? (
        <MedicationInfo info={medicationInfo} />
      ) : (
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="pt-6 pb-6 text-center">
            <div className="py-8">
              <Search className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">
                Search for a medication to view detailed information
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-gray-500 text-center mt-4">
        <p>
          Information provided is for educational purposes only. Always consult your healthcare provider.
        </p>
        <a
          href="https://www.drugs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-safet-600 hover:underline inline-flex items-center mt-2"
        >
          <span>Visit Drugs.com for more information</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
};

export default DrugInfoLookup;
