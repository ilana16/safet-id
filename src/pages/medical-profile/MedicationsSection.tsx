
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast';
import MedicationDetails from '@/components/medications/MedicationInfo';
import { searchMedications, getMedicationInfo } from '@/utils/medicationData';
import { MedicationInfo as MedicationInfoType } from '@/utils/medicationData';

const MedicationsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [medicationInfo, setMedicationInfo] = useState<MedicationInfoType | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('search');
  
  // Handle searching medications
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a medication name to search');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults([]);

    try {
      // Use the local medication database for searching
      const results = searchMedications(searchTerm);
      setSearchResults(results);
      if (results.length === 0) {
        setError(`No medications found for "${searchTerm}"`);
      }
      setIsSearching(false);
    } catch (err) {
      console.error('Error searching medications:', err);
      setError(`Error searching for "${searchTerm}". Please try again.`);
      setIsSearching(false);
    }
  };

  // Handle medication selection
  const handleSelectMedication = (medication: string) => {
    setSelectedMedication(medication);
    setIsLoadingInfo(true);
    setMedicationInfo(null);
    setError(null);
    
    try {
      // Get medication details from the local database
      const info = getMedicationInfo(medication);
      setMedicationInfo(info);
      if (!info) {
        setError(`No detailed information found for "${medication}"`);
      } else {
        setActiveTab('info');
      }
      setIsLoadingInfo(false);
    } catch (err) {
      console.error('Error fetching medication info:', err);
      setError(`Error retrieving details for "${medication}". Please try again.`);
      setIsLoadingInfo(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddToMedications = () => {
    if (medicationInfo) {
      // In a production app, this would save to the user's medication list
      toast.success(`${medicationInfo.name} added to your medications list`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Medication Information</h2>
          <a 
            href="https://www.drugs.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-safet-600 hover:text-safet-800 flex items-center text-sm"
          >
            Powered by Drugs.com <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        </div>
        
        <p className="text-gray-600 mb-6">
          Search for medication information including usage, side effects, interactions, and more.
        </p>
        
        <Tabs defaultValue="search" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="info" disabled={!medicationInfo}>Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter medication name (e.g., Aspirin, Lisinopril)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-safet-500 hover:bg-safet-600"
              >
                {isSearching ? 'Searching...' : 'Search'}
                {!isSearching && <Search className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Search Results:</h3>
                <div className="space-y-2">
                  {searchResults.map((medication, index) => (
                    <Card key={index} className="hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleSelectMedication(medication)}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-safet-700 capitalize">{medication}</p>
                          <p className="text-sm text-gray-500">Click for more information</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="info">
            {isLoadingInfo && (
              <div className="text-center py-8">
                <p>Loading medication information...</p>
              </div>
            )}
            
            {medicationInfo && (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-safet-700">{medicationInfo.name}</h2>
                    {medicationInfo.genericName && (
                      <p className="text-gray-600">Generic: {medicationInfo.genericName}</p>
                    )}
                  </div>
                  <Button 
                    onClick={handleAddToMedications}
                    className="bg-safet-500 hover:bg-safet-600"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add to My Medications
                  </Button>
                </div>
                
                <Separator />
                
                <MedicationDetails medication={medicationInfo} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Drug Information Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Guides</CardTitle>
              <CardDescription>FDA-approved guides for medications</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access important safety information about your medications directly from the FDA.</p>
            </CardContent>
            <CardFooter>
              <a 
                href="https://www.fda.gov/drugs/drug-safety-and-availability/medication-guides" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-safet-600 hover:underline flex items-center"
              >
                Visit FDA Medication Guides <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Drug Interactions</CardTitle>
              <CardDescription>Check for potential interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Identify potential interactions between your medications, foods, and medical conditions.</p>
            </CardContent>
            <CardFooter>
              <a 
                href="https://www.drugs.com/drug_interactions.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-safet-600 hover:underline flex items-center"
              >
                Check Interactions <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MedicationsSection;
