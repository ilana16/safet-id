// Update the imports to remove the non-existent pill component
import React, { useState, useEffect } from 'react';
import { Loader2, Search, CheckCircle, X, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { searchDrugsCom, getDrugsComUrl } from '@/utils/drugsComApi';
import { toast } from '@/lib/toast';
// Remove the import for @/components/ui/pill which doesn't exist

interface MedicationSearchProps {
  onSelect: (drugName: string) => void;
  onClose: () => void;
}

const MedicationSearch: React.FC<MedicationSearchProps> = ({ onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      searchMedications();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchMedications = async () => {
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await searchDrugsCom(searchTerm);
      setSearchResults(results.map(drug => drug.name));
    } catch (error) {
      console.error('Error searching medications:', error);
      toast.error('Error searching medications');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Search medications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-r-none"
        />
        <Button
          variant="outline"
          className="rounded-l-none border-l-0"
          onClick={searchMedications}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>
      
      {searchTerm && searchResults.length === 0 && !isLoading && (
        <Card className="absolute top-full left-0 w-full mt-2 z-10">
          <div className="p-4 text-center text-gray-500">No results found.</div>
        </Card>
      )}

      {searchResults.length > 0 && (
        <Card className="absolute top-full left-0 w-full mt-2 z-10">
          <ul className="divide-y divide-gray-200">
            {searchResults.map((result) => (
              <li key={result} className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <button onClick={() => onSelect(result)} className="hover:underline text-left">
                    {result}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(getDrugsComUrl(result), '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default MedicationSearch;
