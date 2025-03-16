
import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import DrugInfoLookup from '@/components/medications/DrugInfoLookup';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenLine, Search, Pill } from 'lucide-react';

const MedicationsSection = () => {
  const { isEditing } = useOutletContext<{ isEditing: boolean }>();
  const [activeTab, setActiveTab] = useState<string>('medications');

  return (
    <div>
      <p className="text-gray-500 text-sm mb-6">
        Keep track of your medications and access detailed information about drugs from the Drugs.com database.
      </p>

      <Tabs defaultValue="medications" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-gray-100">
          <TabsTrigger value="medications" className="flex items-center data-[state=active]:bg-white">
            <PenLine className="h-4 w-4 mr-2" />
            My Medications
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center data-[state=active]:bg-white">
            <Search className="h-4 w-4 mr-2" />
            Medication Search
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Your Medications</h3>
            <p className="text-gray-500 text-sm mb-6">
              Add and track your current prescriptions, over-the-counter medications, and supplements.
            </p>
            
            <MedicalProfileMedicationsForm />
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medication Information</h3>
            <p className="text-gray-500 text-sm mb-6">
              Search for medications to view detailed information about uses, side effects, and interactions.
            </p>
            
            <DrugInfoLookup />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;
