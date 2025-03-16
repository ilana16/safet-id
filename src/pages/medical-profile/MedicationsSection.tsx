
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Pill, PlusCircle, Edit, Clock, AlertCircle, Calendar, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';
import { loadSectionData, saveSectionData } from '@/utils/medicalProfileService';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const MedicationsSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('myMeds');
  const { profileData, updateSectionData } = useMedicalProfile();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadMedicationsData = () => {
      try {
        console.log('Loading medications data');
        const medsData = loadSectionData('medications');
        
        if (medsData) {
          updateSectionData('medications', medsData);
        }
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading medications data:', error);
        setIsLoaded(true);
      }
    };
    
    loadMedicationsData();
    
    const handleNavChange = () => {
      loadMedicationsData();
    };
    
    window.addEventListener('navigationChange', handleNavChange);
    window.addEventListener('medicationsDataRequest', handleNavChange);
    
    return () => {
      window.removeEventListener('navigationChange', handleNavChange);
      window.removeEventListener('medicationsDataRequest', handleNavChange);
    };
  }, [updateSectionData]);
  
  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const formData = (window as any).medicationsFormData || {};
      
      console.log('Saving medications data:', formData);
      
      const saved = saveSectionData('medications', formData);
      
      if (saved) {
        setIsSaving(false);
        setIsEditMode(false);
        toast.success('Medications information saved successfully');
      } else {
        setIsSaving(false);
        toast.error('Error saving medications information');
      }
    } catch (error) {
      console.error('Error saving medications information:', error);
      setIsSaving(false);
      toast.error('Error saving medications information');
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      handleSave();
    } else {
      setIsEditMode(true);
    }
  };

  const medications = profileData?.medications?.prescriptions || [];
  const otcMedications = profileData?.medications?.otc || [];
  const supplements = profileData?.medications?.supplements || [];
  
  const allMedications = [
    ...(medications || []).map((med: any) => ({ ...med, type: 'prescription' })),
    ...(otcMedications || []).map((med: any) => ({ ...med, type: 'otc' })),
    ...(supplements || []).map((med: any) => ({ ...med, type: 'supplement' })),
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'prescription': return 'Prescription';
      case 'otc': return 'Over-the-counter';
      case 'supplement': return 'Supplement';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'otc': return 'bg-green-100 text-green-800 border-green-200';
      case 'supplement': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderMedicationCard = (med: any) => {
    return (
      <Card key={med.id} className="mb-4 border border-gray-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-safet-600" />
              <h3 className="font-medium">{med.name || 'Unnamed Medication'}</h3>
            </div>
            <Badge className={getTypeColor(med.type)}>
              {getTypeLabel(med.type)}
            </Badge>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {med.totalDosage && med.unit && (
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Dosage:</span>
                    <p className="text-sm text-gray-600">{med.totalDosage} {med.unit}</p>
                  </div>
                </div>
              )}
              
              {med.form && (
                <div className="flex items-start gap-2">
                  <Pill className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Form:</span>
                    <p className="text-sm text-gray-600">
                      {med.form === 'other' ? med.customForm : med.form}
                    </p>
                  </div>
                </div>
              )}
              
              {med.reason && (
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Reason:</span>
                    <p className="text-sm text-gray-600">{med.reason}</p>
                  </div>
                </div>
              )}
              
              {med.withFood && (
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Instructions:</span>
                    <p className="text-sm text-gray-600">
                      {med.withFood === 'with' ? 'Take with food' : 
                       med.withFood === 'without' ? 'Take without food' : 
                       med.withFood === 'either' ? 'Take with or without food' : 
                       'Special instructions'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {med.doseTimes && med.doseTimes.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Schedule:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {med.doseTimes.map((doseTime: any) => (
                    <Badge key={doseTime.id} variant="outline" className="bg-gray-50">
                      <Clock className="h-3 w-3 mr-1" />
                      {doseTime.time}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-gray-100">
          <TabsTrigger value="myMeds" className="data-[state=active]:bg-white">
            My Medication List
          </TabsTrigger>
          <TabsTrigger value="drugInfo" className="data-[state=active]:bg-white">
            Drug Information
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="myMeds" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium text-lg text-gray-900">My Medications</h3>
              <p className="text-sm text-gray-600">
                {allMedications.length > 0 
                  ? `You have ${allMedications.length} medication${allMedications.length !== 1 ? 's' : ''} saved`
                  : 'No medications saved yet'
                }
              </p>
            </div>
            <div className="flex gap-2">
              {isEditMode ? (
                <Button 
                  onClick={handleSave}
                  className="bg-safet-500 hover:bg-safet-600 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                  {!isSaving && <Save className="ml-2 h-4 w-4" />}
                </Button>
              ) : (
                <Button 
                  onClick={toggleEditMode} 
                  variant="outline"
                  className="text-safet-600 border-safet-300 hover:bg-safet-50"
                >
                  Edit List
                  <Edit className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <Separator className="mb-6" />
          
          {isEditMode ? (
            <MedicalProfileMedicationsForm />
          ) : (
            <div className="space-y-6">
              {allMedications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Pill className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No medications added</h3>
                  <p className="mt-2 text-sm text-gray-500">Add your medications to keep track of your treatment plan.</p>
                  <Button
                    onClick={() => setIsEditMode(true)}
                    className="mt-6"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Medication
                  </Button>
                </div>
              ) : (
                <>
                  {allMedications.map(renderMedicationCard)}
                  
                  <Button
                    onClick={() => setIsEditMode(true)}
                    variant="outline"
                    className="w-full text-safet-600 border-safet-200"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another Medication
                  </Button>
                </>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="drugInfo" className="mt-0">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg text-gray-900">Drug Information Lookup</h3>
              <p className="text-sm text-gray-600">Search for detailed information about medications</p>
            </div>
            
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="text-center py-6">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Drug Information Feature</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                    Search for medications to view detailed information about dosage, side effects, interactions, and more.
                  </p>
                  <Button
                    onClick={() => navigate('/profile/medications')}
                    className="mt-6"
                  >
                    Search Medications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsSection;
