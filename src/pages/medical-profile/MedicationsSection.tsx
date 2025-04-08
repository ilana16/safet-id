import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Pill, Clock, Search, ExternalLink, RotateCcw, Trash2, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';
import { Medication, MedicationTableItem } from '@/types/medication';
import { getDrugsComUrl } from '@/utils/drugsComApi';
import { performMedicationSearch } from '@/utils/modrugsApi';

const MedicationsSection = () => {
  const [activeTab, setActiveTab] = useState<string>('current');
  const [currentMedications, setCurrentMedications] = useState<MedicationTableItem[]>([]);
  const [researchMedications, setResearchMedications] = useState<MedicationTableItem[]>([]);
  const [discontinuedMedications, setDiscontinuedMedications] = useState<MedicationTableItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [interactionReport, setInteractionReport] = useState<string>('');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);

  useEffect(() => {
    loadSavedMedications();
  }, []);

  const loadSavedMedications = () => {
    try {
      const currentData = localStorage.getItem('my_medications');
      if (currentData) {
        setCurrentMedications(JSON.parse(currentData));
      }
      
      const researchData = localStorage.getItem('researching_medications');
      if (researchData) {
        setResearchMedications(JSON.parse(researchData));
      }
      
      const discontinuedData = localStorage.getItem('discontinued_medications');
      if (discontinuedData) {
        setDiscontinuedMedications(JSON.parse(discontinuedData));
      }
    } catch (error) {
      console.error('Error loading medications:', error);
      toast.error('Failed to load medications');
    }
  };

  const searchMedication = async () => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const results = await performMedicationSearch(searchTerm);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching medications:', err);
      toast.error('Error searching medications');
    } finally {
      setIsSearching(false);
    }
  };

  const addMedication = (name: string, listType: 'current' | 'research') => {
    try {
      const storageName = listType === 'current' ? 'my_medications' : 'researching_medications';
      const url = getDrugsComUrl(name);
      const newMedication: MedicationTableItem = {
        name, 
        url, 
        added_at: new Date().toISOString()
      };
      
      let currentList: MedicationTableItem[] = [];
      const storedData = localStorage.getItem(storageName);
      if (storedData) {
        currentList = JSON.parse(storedData);
      }
      
      const existingIndex = currentList.findIndex(med => med.name === name);
      if (existingIndex >= 0) {
        currentList[existingIndex] = newMedication;
      } else {
        currentList.push(newMedication);
      }
      
      localStorage.setItem(storageName, JSON.stringify(currentList));
      
      toast.success(`Added ${name} to ${listType === 'current' ? 'current' : 'research'} medications`);
      loadSavedMedications();
      setSearchResults([]);
      setSearchTerm('');
    } catch (err) {
      console.error('Error adding medication:', err);
      toast.error('Failed to add medication');
    }
  };

  const discontinueMedication = (name: string, url: string) => {
    try {
      const newMedication: MedicationTableItem = { 
        name, 
        url, 
        added_at: new Date().toISOString() 
      };
      
      let discontinuedList: MedicationTableItem[] = [];
      const storedData = localStorage.getItem('discontinued_medications');
      if (storedData) {
        discontinuedList = JSON.parse(storedData);
      }
      
      const existingIndex = discontinuedList.findIndex(med => med.name === name);
      if (existingIndex >= 0) {
        discontinuedList[existingIndex] = newMedication;
      } else {
        discontinuedList.push(newMedication);
      }
      
      localStorage.setItem('discontinued_medications', JSON.stringify(discontinuedList));
      
      let currentList: MedicationTableItem[] = [];
      const currentData = localStorage.getItem('my_medications');
      if (currentData) {
        currentList = JSON.parse(currentData);
        currentList = currentList.filter(med => med.name !== name);
        localStorage.setItem('my_medications', JSON.stringify(currentList));
      }
      
      toast.success(`Moved ${name} to discontinued medications`);
      loadSavedMedications();
    } catch (err) {
      console.error('Error discontinuing medication:', err);
      toast.error('Failed to discontinue medication');
    }
  };

  const restoreMedication = (name: string, url: string) => {
    try {
      const newMedication: MedicationTableItem = { 
        name, 
        url, 
        added_at: new Date().toISOString() 
      };
      
      let currentList: MedicationTableItem[] = [];
      const storedData = localStorage.getItem('my_medications');
      if (storedData) {
        currentList = JSON.parse(storedData);
      }
      
      const existingIndex = currentList.findIndex(med => med.name === name);
      if (existingIndex >= 0) {
        currentList[existingIndex] = newMedication;
      } else {
        currentList.push(newMedication);
      }
      
      localStorage.setItem('my_medications', JSON.stringify(currentList));
      
      let discontinuedList: MedicationTableItem[] = [];
      const discontinuedData = localStorage.getItem('discontinued_medications');
      if (discontinuedData) {
        discontinuedList = JSON.parse(discontinuedData);
        discontinuedList = discontinuedList.filter(med => med.name !== name);
        localStorage.setItem('discontinued_medications', JSON.stringify(discontinuedList));
      }
      
      toast.success(`Restored ${name} to current medications`);
      loadSavedMedications();
    } catch (err) {
      console.error('Error restoring medication:', err);
      toast.error('Failed to restore medication');
    }
  };

  const permanentlyDelete = (name: string) => {
    try {
      let discontinuedList: MedicationTableItem[] = [];
      const discontinuedData = localStorage.getItem('discontinued_medications');
      if (discontinuedData) {
        discontinuedList = JSON.parse(discontinuedData);
        discontinuedList = discontinuedList.filter(med => med.name !== name);
        localStorage.setItem('discontinued_medications', JSON.stringify(discontinuedList));
      }
      
      toast.success(`Permanently deleted ${name}`);
      loadSavedMedications();
    } catch (err) {
      console.error('Error deleting medication:', err);
      toast.error('Failed to delete medication');
    }
  };

  const toggleDrugSelection = (name: string) => {
    setSelectedDrugs(prev => {
      if (prev.includes(name)) {
        return prev.filter(drug => drug !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const checkInteractions = async () => {
    if (selectedDrugs.length < 2) {
      toast.error('Please select at least 2 medications to check for interactions');
      return;
    }

    setIsGeneratingReport(true);

    try {
      const drugIds = selectedDrugs.map(drug => drug.toLowerCase().replace(/\s+/g, '-'));
      
      const { checkDrugInteractions } = await import('@/utils/drugsComApi');
      
      const interactionData = await checkDrugInteractions(drugIds);
      
      const report = `
        <div class="text-center mb-4">
          <h2 class="text-2xl font-bold">Medication Interaction Report</h2>
          <p class="text-gray-500">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="mb-4">
          <h3 class="font-medium">Selected Medications:</h3>
          <ul class="list-disc pl-5">
            ${selectedDrugs.map(drug => `<li>${drug}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h3 class="font-medium mb-2">Potential Interactions:</h3>
          ${interactionData.summary ? 
            `<p class="mb-2">${interactionData.summary}</p>` : 
            `<p>No summary available</p>`
          }
          
          ${interactionData.interactions && interactionData.interactions.length > 0 ?
            `<ul class="list-disc pl-5 mt-2">
              ${interactionData.interactions.map((interaction: any) => `
                <li class="mb-1">
                  <span class="${interaction.severity === 'major' ? 'text-red-600 font-medium' : 
                    interaction.severity === 'moderate' ? 'text-amber-600 font-medium' : 
                    'text-gray-600'}">
                    ${interaction.severity?.toUpperCase() || 'UNKNOWN'} SEVERITY:
                  </span> 
                  ${interaction.description || 'No description available'}
                </li>
              `).join('')}
            </ul>` :
            `<p class="mt-2 italic">No specific interactions found in database.</p>`
          }
          
          <p class="mt-4 font-medium text-amber-600">Always consult with a healthcare professional about potential medication interactions.</p>
        </div>
      `;

      setInteractionReport(report);
    } catch (error) {
      console.error('Error generating interaction report:', error);
      toast.error('Error checking medication interactions');
      
      const fallbackReport = `
        <div class="text-center mb-4">
          <h2 class="text-2xl font-bold">Medication Interaction Report</h2>
          <p class="text-gray-500">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="mb-4">
          <h3 class="font-medium">Selected Medications:</h3>
          <ul class="list-disc pl-5">
            ${selectedDrugs.map(drug => `<li>${drug}</li>`).join('')}
          </ul>
        </div>
        <div>
          <h3 class="font-medium mb-2">Potential Interactions:</h3>
          <p>This is a simulated interaction report. In a real application, this would contain actual drug interaction data from a medical database or API.</p>
          <p class="mt-2 font-medium text-amber-600">Always consult with a healthcare professional about potential medication interactions.</p>
        </div>
      `;
      
      setInteractionReport(fallbackReport);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const exportReportAsPDF = () => {
    if (!interactionReport) {
      toast.error('Generate an interaction report first');
      return;
    }

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Medication Interaction Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .report-container { max-width: 800px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="report-container">
              ${interactionReport}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      toast.error('Unable to open print window. Please check your browser settings.');
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Current Medications
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Researching
          </TabsTrigger>
          <TabsTrigger value="discontinued" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Discontinued
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Medication
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Current Medications</h3>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  disabled={selectedDrugs.length < 2 || isGeneratingReport}
                  onClick={checkInteractions}
                >
                  {isGeneratingReport ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>Check Interactions</>
                  )}
                </Button>
              </div>
            </div>
            
            {currentMedications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {currentMedications.map((med) => (
                  <Card key={med.name} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              id={`select-${med.name}`}
                              checked={selectedDrugs.includes(med.name)}
                              onChange={() => toggleDrugSelection(med.name)}
                              className="h-4 w-4 rounded border-gray-300 text-safet-500 focus:ring-safet-500"
                            />
                            <Pill className="h-5 w-5 text-safet-500" />
                            <h3 className="font-medium">{med.name}</h3>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Added on {new Date(med.added_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(med.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" /> View Info
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-amber-600"
                            onClick={() => discontinueMedication(med.name, med.url)}
                          >
                            <Clock className="h-4 w-4 mr-1" /> Discontinue
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No current medications. Add medications from the "Add Medication" tab.</p>
                </CardContent>
              </Card>
            )}

            {interactionReport && (
              <div className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Interaction Report</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportReportAsPDF}
                      >
                        <FileText className="h-4 w-4 mr-2" /> Export PDF
                      </Button>
                    </div>
                    <div className="border p-4 rounded-md bg-gray-50" dangerouslySetInnerHTML={{ __html: interactionReport }} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="research">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Medications I'm Researching</h3>
            
            {researchMedications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {researchMedications.map((med) => (
                  <Card key={med.name} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-safet-500" />
                            <h3 className="font-medium">{med.name}</h3>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Added on {new Date(med.added_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(med.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" /> View Info
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => addMedication(med.name, 'current')}
                          >
                            <Pill className="h-4 w-4 mr-1" /> Add to Current
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No medications in research list. Add medications from the "Add Medication" tab.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="discontinued">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Discontinued Medications</h3>
            
            {discontinuedMedications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {discontinuedMedications.map((med) => (
                  <Card key={med.name} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-safet-500" />
                            <h3 className="font-medium">{med.name}</h3>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Discontinued on {new Date(med.added_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(med.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" /> View Info
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => restoreMedication(med.name, med.url)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" /> Restore
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => permanentlyDelete(med.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No discontinued medications.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Search and Add Medications</h3>
            
            <div className="flex gap-2">
              <Input
                className="flex-1"
                placeholder="Search for a medication..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchMedication();
                  }
                }}
              />
              <Button 
                onClick={searchMedication} 
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </Button>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium">Results:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {searchResults.map((result) => (
                    <Card key={result} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{result}</span>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => addMedication(result, 'current')}
                            >
                              <Pill className="h-4 w-4 mr-1" /> Add to Current
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => addMedication(result, 'research')}
                            >
                              <Search className="h-4 w-4 mr-1" /> Research
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(getDrugsComUrl(result), '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : searchTerm && !isSearching ? (
              <Card className="mt-4">
                <CardContent className="p-4 text-center">
                  <p className="text-gray-500">No medications found matching your search.</p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;
