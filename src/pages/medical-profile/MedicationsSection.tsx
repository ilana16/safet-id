
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pill, Info, Plus, Search, ExternalLink } from 'lucide-react';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { saveSectionData, loadSectionData } from '@/utils/saveHelpers';
import { toast } from 'sonner';
import { logChanges } from '@/utils/changeLog';
import DrugInfoLookup from '@/components/medications/DrugInfoLookup';

interface MedicationSectionProps {}

const MedicationsSection: React.FC<MedicationSectionProps> = () => {
  const [activeTab, setActiveTab] = useState('my-medications');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // Load initial data
  useEffect(() => {
    const { data, lastSaved } = loadSectionData('medications');
    if (lastSaved) {
      setLastSaved(lastSaved);
    }
  }, []);

  // Handle save functionality
  const handleSave = () => {
    // Access the global form data - this is updated by the form component
    const medicationsData = (window as any).medicationsFormData;
    
    if (!medicationsData) {
      toast.error('No medication data found to save');
      return;
    }
    
    setSaving(true);
    
    try {
      const result = saveSectionData('medications', medicationsData, logChanges);
      
      if (result.success) {
        toast.success('Medications saved successfully');
        setLastSaved(result.timestamp);
      } else {
        toast.error('Failed to save medications');
      }
    } catch (error) {
      console.error('Error saving medications:', error);
      toast.error('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
        <p className="text-gray-600 mt-1">
          Manage your medications, prescriptions, and supplements
        </p>
      </div>

      <Tabs defaultValue="my-medications" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full border-b border-gray-200 bg-white mb-6">
          <TabsTrigger 
            value="my-medications"
            className="text-sm font-medium px-4 py-2 data-[state=active]:text-safet-700 data-[state=active]:border-b-2 data-[state=active]:border-safet-500"
          >
            My Medication List
          </TabsTrigger>
          <TabsTrigger 
            value="drug-info"
            className="text-sm font-medium px-4 py-2 data-[state=active]:text-safet-700 data-[state=active]:border-b-2 data-[state=active]:border-safet-500"
          >
            Drug Information
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-medications" className="mt-2 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <MedicalProfileMedicationsForm />
            </CardContent>
          </Card>
          
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-safet-500 hover:bg-safet-600"
            >
              {saving ? 'Saving...' : 'Save Medications'}
            </Button>
          </div>
          
          {lastSaved && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Last saved: {new Date(lastSaved).toLocaleString()}
            </p>
          )}
        </TabsContent>

        <TabsContent value="drug-info" className="mt-2">
          <Card>
            <CardContent className="pt-6">
              <DrugInfoLookup />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;
