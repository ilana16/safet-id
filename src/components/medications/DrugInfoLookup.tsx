
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { searchDrugInfo } from '@/utils/drugsComApi';
import MedicationInfo from '@/components/medications/MedicationInfo';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';

const DrugInfoLookup: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MedicationInfoType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a medication name');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const medicationInfo = await searchDrugInfo(query);
      setResults(medicationInfo);
      
      if (!medicationInfo) {
        setError(`No information found for "${query}"`);
      }
    } catch (err) {
      console.error('Error searching for medication:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-safet-700 mb-4">Medication Information Lookup</h3>
        
        <div className="flex gap-2">
          <Input 
            placeholder="Enter medication name (e.g., Lisinopril)" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch} 
            disabled={loading}
            className="bg-safet-500 hover:bg-safet-600"
          >
            {loading ? 'Searching...' : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        {error && (
          <div className="mt-3 text-red-500 text-sm">{error}</div>
        )}
        
        <div className="mt-2 text-xs text-gray-500">
          Note: Search for medications by brand or generic name. Information provided is for educational purposes only.
        </div>
      </div>
      
      {results && (
        <Card className="border-safet-100">
          <CardContent className="pt-6">
            <MedicationInfo medication={results} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DrugInfoLookup;
