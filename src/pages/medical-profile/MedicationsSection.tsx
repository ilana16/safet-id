
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Pill, Clock, AlertTriangle, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { useFieldPersistence } from '@/hooks/useFieldPersistence';
import DrugInfoLookup from '@/components/medications/DrugInfoLookup';
import MedicationsList from '@/components/medications/MedicationsList';
import DiscontinuedMedicationsList from '@/components/medications/DiscontinuedMedicationsList';
import InteractionsReport from '@/components/medications/InteractionsReport';

interface MedicationSectionData {
  medications: Medication[];
  discontinuedMedications: Medication[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  customFrequency?: string;
  customDays?: string;
  reason: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  discontinued?: boolean;
  discontinuedReason?: string;
  foodInteractions?: string[];
  conditionInteractions?: string[];
  therapeuticDuplications?: string[];
  interactionClassifications?: {
    major?: string[];
    moderate?: string[];
    minor?: string[];
    unknown?: string[];
  };
  pregnancy?: string;
  breastfeeding?: string;
}

const MedicationsSection = () => {
  const { isEditing } = useOutletContext<{ isEditing: boolean }>();
  const [activeTab, setActiveTab] = useState<string>('current');

  const [sectionData, updateSectionData] = useFieldPersistence<MedicationSectionData>('medications', {
    medications: [],
    discontinuedMedications: []
  });

  const { medications = [], discontinuedMedications = [] } = sectionData;
  
  const handleAddMedication = (medication: Medication) => {
    updateSectionData({
      medications: [...medications, medication]
    });
  };

  const handleUpdateMedication = (updatedMedication: Medication) => {
    updateSectionData({
      medications: medications.map(med => 
        med.id === updatedMedication.id ? updatedMedication : med
      )
    });
  };

  const handleDiscontinueMedication = (id: string, reason: string) => {
    const medicationToDiscontinue = medications.find(med => med.id === id);
    if (!medicationToDiscontinue) return;

    const discontinuedMed = {
      ...medicationToDiscontinue,
      discontinued: true,
      discontinuedReason: reason,
      endDate: new Date().toISOString().split('T')[0]
    };

    updateSectionData({
      medications: medications.filter(med => med.id !== id),
      discontinuedMedications: [...discontinuedMedications, discontinuedMed]
    });
  };

  const handleDeleteMedication = (id: string, isDiscontinued: boolean = false) => {
    if (isDiscontinued) {
      updateSectionData({
        discontinuedMedications: discontinuedMedications.filter(med => med.id !== id)
      });
    } else {
      updateSectionData({
        medications: medications.filter(med => med.id !== id)
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            My Medications
          </TabsTrigger>
          <TabsTrigger value="discontinued" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Discontinued
          </TabsTrigger>
          <TabsTrigger value="interactions" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Interactions
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Drug Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Current Medications</h3>
              {isEditing && (
                <Button 
                  onClick={() => setActiveTab('search')} 
                  className="bg-safet-500 hover:bg-safet-600"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              )}
            </div>
            
            <MedicationsList 
              medications={medications} 
              isEditing={isEditing}
              onUpdate={handleUpdateMedication}
              onDiscontinue={handleDiscontinueMedication}
              onDelete={handleDeleteMedication}
            />
            
            {medications.length === 0 && (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-gray-500">No current medications. Add medications using the "Add Medication" button.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="discontinued">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Discontinued Medications</h3>
            <DiscontinuedMedicationsList 
              medications={discontinuedMedications} 
              isEditing={isEditing}
              onDelete={handleDeleteMedication}
            />
            
            {discontinuedMedications.length === 0 && (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-gray-500">No discontinued medications.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="interactions">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Drug Interactions Report</h3>
            <InteractionsReport 
              medications={medications} 
            />
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Drug Information</h3>
            <p className="text-sm text-gray-600 mb-4">
              Search for medications by name to get detailed information or add them to your profile.
            </p>
            <DrugInfoLookup 
              onAddMedication={handleAddMedication}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;
