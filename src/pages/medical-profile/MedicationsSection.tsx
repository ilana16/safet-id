
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Search, Plus, X, Edit, AlertCircle } from 'lucide-react';
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
import { Link } from 'react-router-dom';

const MedicationsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<string[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [medicationInfo, setMedicationInfo] = useState<MedicationInfoType | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('medications');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Load user medications from local storage
  const [userMedications, setUserMedications] = useState<any[]>([]);
  
  useEffect(() => {
    // Retrieve medications from localStorage
    const savedProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
    let allMeds: any[] = [];
    
    if (savedProfile && savedProfile.medications) {
      // Combine all types of medications into one array
      if (savedProfile.medications.prescriptions) {
        allMeds = [...allMeds, ...savedProfile.medications.prescriptions.map((med: any) => ({
          ...med,
          type: 'Prescription'
        }))];
      }
      
      if (savedProfile.medications.otc) {
        allMeds = [...allMeds, ...savedProfile.medications.otc.map((med: any) => ({
          ...med,
          type: 'Over-the-Counter'
        }))];
      }
      
      if (savedProfile.medications.supplements) {
        allMeds = [...allMeds, ...savedProfile.medications.supplements.map((med: any) => ({
          ...med,
          type: 'Supplement'
        }))];
      }
    }
    
    setUserMedications(allMeds.filter(med => med.name));
  }, []);
  
  // Update autocomplete suggestions as user types
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const suggestions = searchMedications(searchTerm);
      setAutocompleteSuggestions(suggestions.slice(0, 5)); // Limit to 5 suggestions
      setIsAutocompleteOpen(suggestions.length > 0);
    } else {
      setAutocompleteSuggestions([]);
      setIsAutocompleteOpen(false);
    }
  }, [searchTerm]);

  // Handle searching medications
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a medication name to search');
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults([]);
    setIsAutocompleteOpen(false);

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
    setIsAutocompleteOpen(false);
    
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
    } else if (e.key === 'Escape') {
      setIsAutocompleteOpen(false);
    }
  };

  const handleAutocompleteSelection = (medication: string) => {
    setSearchTerm(medication);
    setIsAutocompleteOpen(false);
    // Focus back on the input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setAutocompleteSuggestions([]);
    setIsAutocompleteOpen(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
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
      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="medications" onClick={() => setActiveTab('medications')}>
            Personal Medications
          </TabsTrigger>
          <TabsTrigger value="search" onClick={() => setActiveTab('search')}>
            Medication Information
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="medications" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">My Medications</h2>
              <Link to="/profile/edit">
                <Button 
                  variant="outline" 
                  className="text-safet-600 hover:text-safet-700 border-safet-200 hover:bg-safet-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Medications
                </Button>
              </Link>
            </div>
            
            {userMedications.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No medications added yet</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  You haven't added any medications to your profile. Add your prescriptions,
                  over-the-counter medications, and supplements to keep track of all your medications.
                </p>
                <Link to="/profile/edit">
                  <Button className="bg-safet-500 hover:bg-safet-600">
                    Add Medications
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Group medications by type */}
                <div className="space-y-4">
                  {['Prescription', 'Over-the-Counter', 'Supplement'].map(type => {
                    const medications = userMedications.filter(med => med.type === type);
                    if (medications.length === 0) return null;
                    
                    return (
                      <div key={type} className="space-y-2">
                        <h3 className="text-lg font-medium text-gray-900">{type} Medications</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {medications.map((med, index) => (
                            <Card key={med.id || index} className="overflow-hidden">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{med.name}</CardTitle>
                                {med.brandName && <CardDescription>{med.brandName}</CardDescription>}
                              </CardHeader>
                              <CardContent className="text-sm space-y-2 pb-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Dosage:</span>
                                  <span className="font-medium">
                                    {med.pillsPerDose} {med.form} 
                                    {med.totalDosage && med.unit && ` (${med.totalDosage}${med.unit})`}
                                  </span>
                                </div>
                                
                                {med.doseTimes && med.doseTimes.length > 0 && med.doseTimes[0].time && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Schedule:</span>
                                    <span className="font-medium">
                                      {med.doseTimes.map((dt: any) => dt.time).filter(Boolean).join(', ')}
                                    </span>
                                  </div>
                                )}
                                
                                {med.withFood && med.withFood !== 'either' && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Take:</span>
                                    <span className="font-medium">
                                      {med.withFood === 'with' ? 'With food' : 
                                       med.withFood === 'without' ? 'Without food' : 
                                       med.withFood}
                                    </span>
                                  </div>
                                )}
                                
                                {med.reason && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">For:</span>
                                    <span className="font-medium">{med.reason}</span>
                                  </div>
                                )}
                              </CardContent>
                              
                              <CardFooter className="pt-2 flex justify-between border-t border-gray-100">
                                <Badge variant="outline" className="bg-gray-50">
                                  {med.type}
                                </Badge>
                                {med.name && (
                                  <Button 
                                    variant="link" 
                                    className="text-safet-600 p-0 h-auto text-sm"
                                    onClick={() => {
                                      // Look up this medication in our database and show details
                                      const medKey = med.name.toLowerCase();
                                      handleSelectMedication(medKey);
                                      setActiveTab('search');
                                    }}
                                  >
                                    View Details
                                  </Button>
                                )}
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Medication Management Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Adherence Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Use a pill organizer to sort your medications by day and time</li>
                    <li>Set reminders on your phone for each medication</li>
                    <li>Keep a medication log to track what you've taken</li>
                    <li>Establish a routine and take medications at the same time each day</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Important Safety Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Store medications in their original containers</li>
                    <li>Keep medications away from heat, light, and moisture</li>
                    <li>Dispose of expired medications properly</li>
                    <li>Bring an updated medication list to all doctor appointments</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="search" className="space-y-4">
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
            
            <Tabs defaultValue="search" value={medicationInfo ? 'info' : 'search'} onValueChange={(v) => setMedicationInfo(v === 'search' ? null : medicationInfo)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="search">Search</TabsTrigger>
                <TabsTrigger value="info" disabled={!medicationInfo}>Information</TabsTrigger>
              </TabsList>
              
              <TabsContent value="search" className="space-y-4">
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Enter medication name (e.g., Aspirin, Lisinopril)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => {
                          if (autocompleteSuggestions.length > 0) {
                            setIsAutocompleteOpen(true);
                          }
                        }}
                        className="flex-1 pr-8"
                      />
                      {searchTerm && (
                        <button 
                          onClick={clearSearch}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Button 
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="bg-safet-500 hover:bg-safet-600"
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                      {!isSearching && <Search className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                  
                  {/* Autocomplete Dropdown */}
                  {isAutocompleteOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                      {autocompleteSuggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                          onClick={() => handleAutocompleteSelection(suggestion)}
                        >
                          <Search className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="capitalize">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;
