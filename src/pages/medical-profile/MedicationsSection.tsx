
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Info, Save, Search, PlusCircle, Pill, ChevronRight, FilterX } from 'lucide-react';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';
import { useFieldPersistence } from '@/hooks/useFieldPersistence';
import DrugInfoLookup from '@/components/medications/DrugInfoLookup';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Define the type for medications data
interface MedicationsData {
  medications: any[];
  [key: string]: any;
}

const initialMedicationsData: MedicationsData = {
  medications: [{
    id: `med_${Date.now()}`,
    name: '',
    totalDosage: '',
    unit: '',
    pillsPerDose: '',
    dosagePerPill: '',
    form: '',
    customForm: '',
    withFood: 'with',
    prescriptionType: '',
    brandName: '',
    reason: '',
    doseTimes: [{ id: `time_${Date.now()}`, time: '' }]
  }]
};

const MedicationsSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDrugInfo, setShowDrugInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("my-meds");
  
  // Use the useFieldPersistence hook for medications data
  const [medicationsData, updateMedicationsData, saveMedicationsData] = useFieldPersistence<MedicationsData>(
    'medications',
    initialMedicationsData
  );
  
  useEffect(() => {
    setIsLoaded(true);
    
    // Make the medications data available to the MedicalProfileMedicationsForm
    if (medicationsData) {
      (window as any).medicationsFormData = medicationsData;
    }
  }, [medicationsData]);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the current form data from window object
      const newFormData = (window as any).medicationsFormData || {};
      
      console.log('Saving medications form data:', newFormData);
      
      // Update the context and persist the data
      updateMedicationsData(newFormData);
      saveMedicationsData();
      
      // Get the saved profile from localStorage for comparison
      const savedProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
      const existingSectionData = existingProfile.medications || {};
      
      const changes: {field: string; oldValue: any; newValue: any}[] = [];
      
      Object.keys(newFormData).forEach(key => {
        const oldValue = existingSectionData[key];
        const newValue = newFormData[key];
        
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes.push({
            field: key,
            oldValue: oldValue,
            newValue: newValue
          });
        }
      });
      
      if (changes.length > 0) {
        logChanges('medications', changes);
      }
      
      setIsSaving(false);
      toast.success('Medications saved successfully');
    } catch (error) {
      console.error('Error saving medications:', error);
      setIsSaving(false);
      toast.error('Error saving medications');
    }
  };

  const totalMedicationsCount = medicationsData?.medications?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header section in drugs.com style */}
      <div className="bg-white border border-[#D1DEE8] rounded-xl overflow-hidden shadow-sm">
        <div className="bg-[#335B95] text-white px-6 py-4">
          <h1 className="text-2xl font-bold">My Medications</h1>
          <p className="text-white/80 mt-1">
            Track your medications and supplements
          </p>
        </div>
        
        <div className="p-4 border-b border-gray-200 bg-[#F5F8FC]">
          <div className="relative">
            <Input 
              placeholder="Search medications database..." 
              className="pl-10 pr-4 py-2 border-gray-300 focus:ring-[#335B95] focus:border-[#335B95]"
              onClick={() => setActiveTab('drug-lookup')}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Main content with tabs */}
      <Tabs 
        defaultValue="my-meds" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="bg-white border border-gray-200 rounded-md mb-4 p-1 overflow-x-auto flex">
          <TabsTrigger 
            value="my-meds" 
            className="flex items-center data-[state=active]:bg-[#EBF2FA] data-[state=active]:text-[#335B95] data-[state=active]:border-b-2 data-[state=active]:border-[#335B95] rounded-none flex-1"
          >
            <Pill className="h-4 w-4 mr-2" />
            My Medications
            {totalMedicationsCount > 0 && (
              <Badge className="ml-2 bg-[#EBF2FA] text-[#335B95] border-[#335B95]/20">{totalMedicationsCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="drug-lookup" 
            className="flex items-center data-[state=active]:bg-[#EBF2FA] data-[state=active]:text-[#335B95] data-[state=active]:border-b-2 data-[state=active]:border-[#335B95] rounded-none flex-1"
          >
            <Search className="h-4 w-4 mr-2" />
            Drug Information
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-meds" className="mt-0">
          <Card className="p-6 border border-gray-200">
            {isLoaded && (
              <div className="space-y-6">
                {/* Single unified medications section will go here */}
                {/* We'll implement the drugs.com style medications form in a future update */}
                <div className="mt-4 text-center text-gray-500">
                  <p>The medications form will be updated to match drugs.com style in the next update.</p>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex justify-end gap-3">
              <Button 
                onClick={handleSave} 
                className="bg-[#335B95] hover:bg-[#26497C]"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
                {!isSaving && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="drug-lookup" className="mt-0">
          <Card className="border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Medication Information Database</h2>
              <p className="text-gray-600 mb-6">
                Search for detailed information about prescription drugs, over-the-counter medicines, and supplements.
              </p>
              <DrugInfoLookup />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;
