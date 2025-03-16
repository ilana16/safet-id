
import React, { useState } from 'react';
import DrugInfoLookup from '@/components/medications/DrugInfoLookup';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { Button } from '@/components/ui/button';
import { Pill, ListChecks, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MedicationsSection = ({ isEditing }: { isEditing?: boolean }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'myMeds'>('search');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-medium text-gray-900">My Medications</h3>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'search' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('search')}
            className={activeTab === 'search' ? 'bg-safet-500 hover:bg-safet-600' : ''}
          >
            <Search className="h-4 w-4 mr-2" />
            Drug Information
          </Button>
          <Button 
            variant={activeTab === 'myMeds' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setActiveTab('myMeds')}
            className={activeTab === 'myMeds' ? 'bg-safet-500 hover:bg-safet-600' : ''}
          >
            <ListChecks className="h-4 w-4 mr-2" />
            My Med List
          </Button>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm">
        Keep track of your medications and search for detailed information about drugs you're taking.
      </p>
      
      {activeTab === 'search' ? (
        <Card className="border border-gray-200">
          <CardHeader className="bg-safet-50 border-b border-gray-200">
            <CardTitle className="text-lg flex items-center">
              <Search className="h-5 w-5 mr-2 text-safet-500" />
              Drug Information Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DrugInfoLookup />
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-200">
          <CardHeader className="bg-safet-50 border-b border-gray-200">
            <CardTitle className="text-lg flex items-center">
              <Pill className="h-5 w-5 mr-2 text-safet-500" />
              My Medication List
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <MedicalProfileMedicationsForm />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicationsSection;
