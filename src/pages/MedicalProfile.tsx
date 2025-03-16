
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Tabs } from '@/components/ui/tabs';
import { useMedicalProfile } from '@/contexts/MedicalProfileContext';
import ProfileSectionTabs from '@/components/medical-profile/ProfileSectionTabs';
import ProfileSectionHeader from '@/components/medical-profile/ProfileSectionHeader';
import ProfileSectionContent from '@/components/medical-profile/ProfileSectionContent';
import { useMedicalProfileSection } from '@/hooks/useMedicalProfileSection';

type SectionType = 'personal' | 'history' | 'allergies' | 'medications' | 'immunizations' | 'social' | 
                   'reproductive' | 'mental' | 'functional' | 'cultural';

const sections = [
  { id: 'personal', label: 'Personal' },
  { id: 'history', label: 'Medical History' },
  { id: 'allergies', label: 'Allergies' },
  { id: 'medications', label: 'Medications' },
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
  const { profileData } = useMedicalProfile();
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  
  const pathParts = location.pathname.split('/');
  const currentSection = pathParts[pathParts.length - 1] === 'profile' ? 'personal' : pathParts[pathParts.length - 1];
  
  const { 
    isLoadingData, 
    isSaving, 
    isEditing, 
    toggleEditMode, 
    saveCurrentSectionData, 
    getSectionTitle 
  } = useMedicalProfileSection(currentSection as string);

  useEffect(() => {
    console.log('Loading profile data on component mount');
    
    if (profileData && profileData.history && profileData.history.hasMentalHealthHistory) {
      setHasMentalHealthHistory(profileData.history.hasMentalHealthHistory);
    }
  }, [profileData]);

  const handleTabChange = (value: string) => {
    if (currentSection === value) return;
    
    saveCurrentSectionData();
    navigate(`/profile/${value}`);
    
    setIsEditing(value === 'medications');
  };

  const handleBackToDashboard = () => {
    saveCurrentSectionData();
    navigate('/dashboard');
  };

  const showEditControls = true;

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBackToDashboard} 
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
              <ProfileSectionTabs 
                sections={sections}
                currentSection={currentSection}
                hasMentalHealthHistory={hasMentalHealthHistory}
              />
            </Tabs>
          </div>
          
          <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-0">
              <ProfileSectionHeader 
                title={getSectionTitle(currentSection)}
                isEditing={isEditing}
                isSaving={isSaving}
                showEditControls={showEditControls}
                toggleEditMode={toggleEditMode}
                saveCurrentSectionData={saveCurrentSectionData}
              />

              <ProfileSectionContent
                isLoading={isLoadingData}
                isEditing={isEditing}
                showEditControls={showEditControls}
                isSaving={isSaving}
                saveCurrentSectionData={saveCurrentSectionData}
              >
                <Outlet context={{ isEditing }} />
              </ProfileSectionContent>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MedicalProfile;
