
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DrugInfoLookup from '@/components/medications/DrugInfoLookup';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PenLine, Search, Pill } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const MedicationsSection = () => {
  const { isEditing } = useOutletContext<{ isEditing: boolean }>();
  const [activeTab, setActiveTab] = useState<string>('medications');

  return (
    <div>
      <p className="text-gray-500 text-sm mb-6">
        Keep track of your medications and access detailed information about drugs from the Drugs.com database.
      </p>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Medication Information</h3>
          <p className="text-gray-500 text-sm mb-6">
            Search for medications to view detailed information about uses, side effects, and interactions.
          </p>
          
          <DrugInfoLookup />
        </div>

        <Separator className="my-8" />

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Manage Your Medications</h3>
          <p className="text-gray-500 text-sm mb-6">
            Add and track your current prescriptions, over-the-counter medications, and supplements.
          </p>
          
          <MedicalProfileMedicationsForm />
        </div>
      </div>
    </div>
  );
};

export default MedicationsSection;
