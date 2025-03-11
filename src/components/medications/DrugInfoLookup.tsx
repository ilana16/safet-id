
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { toast } from '@/lib/toast';
import { fetchDrugInfo } from '@/utils/drugsComApi';
import { MedicationInfo } from '@/components/medications/MedicationInfo';

interface DrugInfoLookupProps {
  onSelectMedication?: (medicationName: string) => void;
}

const DrugInfoLookup: React.FC<DrugInfoLookupProps> = ({ onSelectMedication }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [drugInfo, setDrugInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a medication name');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDrugInfo(null);

    try {
      const drugData = await fetchDrugInfo(searchTerm);
      if (drugData) {
        setDrugInfo(drugData);
      } else {
        setError('No information found for this medication');
      }
    } catch (err) {
      console.error('Error fetching drug information:', err);
      setError('Error fetching medication information. Please try again.');
      toast.error('Error fetching medication information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setDrugInfo(null);
    setError(null);
  };

  const handleSelectMedication = () => {
    if (drugInfo && onSelectMedication) {
      onSelectMedication(drugInfo.name || searchTerm);
      setSearchTerm('');
      setDrugInfo(null);
    }
  };

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium">Medication Information Lookup</h3>
      <p className="text-sm text-gray-500">
        Search for medication information from Drugs.com
      </p>
      
      <div className="flex gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter medication name"
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-safet-500 hover:bg-safet-600"
        >
          {isLoading ? 'Searching...' : 'Search'}
          {!isLoading && <Search className="ml-2 h-4 w-4" />}
        </Button>
        
        {(searchTerm || drugInfo) && (
          <Button 
            onClick={handleClear}
            variant="outline"
            className="px-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      
      {drugInfo && (
        <div className="space-y-4">
          <MedicationInfo medication={drugInfo} />
          
          {onSelectMedication && (
            <Button 
              onClick={handleSelectMedication}
              className="w-full bg-safet-500 hover:bg-safet-600"
            >
              Add {drugInfo.name || searchTerm} to My Medications
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DrugInfoLookup;
