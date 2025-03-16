import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save, Edit } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/lib/toast';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';

type SectionType = 'personal' | 'history' | 'allergies' | 'immunizations' | 'social' | 
                   'reproductive' | 'mental' | 'functional' | 'cultural';

const sections = [
  { id: 'personal', label: 'Personal' },
  { id: 'history', label: 'Medical History' },
  { id: 'allergies', label: 'Allergies' },
  { id: 'immunizations', label: 'Immunizations & Vaccines' },
  { id: 'social', label: 'Social History' },
  { id: 'reproductive', label: 'Reproductive' },
  { id: 'mental', label: 'Mental Health' },
  { id: 'functional', label: 'Functional Status' },
  { id: 'cultural', label: 'Cultural' }
];

const MedicalProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profileData, saveSection, loadSection } = useMedicalProfile();
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  
  const pathParts = location.pathname.split('/');
  const currentSection = pathParts[pathParts.length - 1] === 'profile' ? 'personal' : pathParts[pathParts.length - 1];

  useEffect(() => {
    console.log('Loading profile data on component mount');
    setIsLoadingData(true);
    
    if (profileData && profileData.history && profileData.history.hasMentalHealthHistory) {
      setHasMentalHealthHistory(profileData.history.hasMentalHealthHistory);
    }
    
    setIsLoadingData(false);
  }, [profileData]);

  useEffect(() => {
    console.log(`Route changed to ${location.pathname}, loading section: ${currentSection}`);
    setIsLoadingData(true);
    
    try {
      loadSection(currentSection);
      
      if (profileData && profileData.history && profileData.history.hasMentalHealthHistory) {
        setHasMentalHealthHistory(profileData.history.hasMentalHealthHistory);
      }
    } catch (error) {
      console.error('Error reloading section data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [location.pathname, currentSection, loadSection]);

  const saveCurrentSectionData = () => {
    console.log(`Attempting to save data for section: ${currentSection}`);
    setIsSaving(true);
    
    try {
      const saved = saveSection(currentSection);
      
      if (saved) {
        toast.success(`${getSectionTitle(currentSection)} information saved successfully`);
        if (currentSection !== 'medications') {
          setIsEditing(false);
        }
      } else {
        toast.error(`No data found to save for ${getSectionTitle(currentSection)}`);
      }
      
      setIsSaving(false);
      return saved;
    } catch (error) {
      console.error(`Error saving ${currentSection} data:`, error);
      setIsSaving(false);
      toast.error(`Error saving ${getSectionTitle(currentSection)} information`);
      return false;
    }
  };

  const handleTabChange = (value: string) => {
    if (currentSection === value) return;
    
    saveCurrentSectionData();
    navigate(`/profile/${value}`);
    
    setIsEditing(value === 'medications');
  };

  const getSectionTitle = (section: string): string => {
    const sectionObj = sections.find(s => s.id === section);
    return sectionObj ? sectionObj.label : 'Section';
  };

  const toggleEditMode = () => {
    if (isEditing) {
      saveCurrentSectionData();
    } else {
      setIsEditing(true);
    }
  };

  const showEditControls = true;

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => {
              saveCurrentSectionData();
              navigate('/dashboard');
            }} 
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Medical Profile
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 mt-1">
              Update your comprehensive medical information with our new section-by-section editor
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <Tabs 
              value={currentSection} 
              onValueChange={handleTabChange} 
              orientation="vertical" 
              className="w-full"
            >
              <TabsList className="flex flex-col w-full h-auto p-0 bg-transparent space-y-1">
                {sections
                  .filter(section => 
                    !(section.id === 'mental' && hasMentalHealthHistory === 'no')
                  )
                  .map(section => (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="w-full justify-start text-left px-4 py-3 border-l-2 border-transparent data-[state=active]:border-l-safet-500 data-[state=active]:bg-safet-50 data-[state=active]:text-safet-700"
                    >
                      <div className="flex justify-between w-full items-center">
                        <span>{section.label}</span>
                      </div>
                    </TabsTrigger>
                  ))
                }
              </TabsList>
            </Tabs>
          </div>
          
          <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-0">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  {getSectionTitle(currentSection)}
                </h2>
                
                {showEditControls && (
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <Button 
                        onClick={saveCurrentSectionData} 
                        className="bg-safet-500 hover:bg-safet-600 text-white"
                        size="sm"
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save'}
                        {!isSaving && <Save className="ml-2 h-4 w-4" />}
                      </Button>
                    ) : (
                      <Button 
                        onClick={toggleEditMode} 
                        variant="outline"
                        size="sm"
                        className="text-safet-600 border-safet-300 hover:bg-safet-50"
                      >
                        Edit
                        <Edit className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6">
                {isLoadingData ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-8 w-8 bg-safet-200 rounded-full mb-4"></div>
                      <div className="h-4 w-32 bg-safet-100 rounded mb-3"></div>
                      <div className="h-3 w-24 bg-safet-50 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <div className={`${showEditControls && !isEditing ? 'pointer-events-none opacity-90' : ''}`}>
                    <Outlet context={{ isEditing }} />
                  </div>
                )}
              </div>
              
              {showEditControls && isEditing && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
                  <Button 
                    onClick={saveCurrentSectionData} 
                    className="bg-safet-500 hover:bg-safet-600 text-white"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                    {!isSaving && <Save className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MedicalProfile;
