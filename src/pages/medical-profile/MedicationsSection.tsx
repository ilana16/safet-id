
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

      <div className="space-y-8">
        {/* Search section always visible at the top */}
        <div className="bg-white border border-[#D1DEE8] rounded-xl overflow-hidden shadow-sm">
          <div className="bg-safet-600 text-white px-5 py-3 font-medium flex items-center">
            <Search className="h-4 w-4 mr-2" />
            <span>Medication Search</span>
          </div>
          <div className="p-5">
            <p className="text-gray-500 text-sm mb-4">
              Search for medications to view detailed information about uses, side effects, and interactions.
            </p>
            
            <DrugInfoLookup />
          </div>
        </div>

        {/* My Medications section */}
        <div className="bg-white border border-[#D1DEE8] rounded-xl overflow-hidden shadow-sm">
          <div className="bg-safet-600 text-white px-5 py-3 font-medium flex items-center">
            <PenLine className="h-4 w-4 mr-2" />
            <span>My Medications</span>
          </div>
          <div className="p-5">
            <p className="text-gray-500 text-sm mb-4">
              Add and track your current prescriptions, over-the-counter medications, and supplements.
            </p>
            
            <MedicalProfileMedicationsForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationsSection;
