
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save } from 'lucide-react';
import MedicalProfilePersonalForm from '@/components/forms/MedicalProfilePersonalForm';
import MedicalProfileHistoryForm from '@/components/forms/MedicalProfileHistoryForm';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import MedicalProfileAllergiesForm from '@/components/forms/MedicalProfileAllergiesForm';
import MedicalProfileSocialHistoryForm from '@/components/forms/MedicalProfileSocialHistoryForm';
import MedicalProfileReproductiveHistoryForm from '@/components/forms/MedicalProfileReproductiveHistoryForm';
import MedicalProfileMentalHealthForm from '@/components/forms/MedicalProfileMentalHealthForm';
import MedicalProfileFunctionalStatusForm from '@/components/forms/MedicalProfileFunctionalStatusForm';
import MedicalProfileCulturalPreferencesForm from '@/components/forms/MedicalProfileCulturalPreferencesForm';
import MedicalProfilePreventativeCareForm from '@/components/forms/MedicalProfilePreventativeCareForm';

// Define the valid section types
type SectionType = 'personal' | 'history' | 'medications' | 'allergies' | 'social' | 
                   'reproductive' | 'mental' | 'functional' | 'cultural' | 'preventative';

const MedicalProfileForm = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section: SectionType }>();
  const [isSaving, setIsSaving] = useState(false);
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  
  // Get the current section or default to personal
  const currentSection = section || 'personal';

  // Check localStorage for mental health history setting
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
    if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
      setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    // Save the mental health history value if we're on the history section
    const additionalData = currentSection === 'history' ? 
      { hasMentalHealthHistory } : {};
    
    // Simulate API call
    setTimeout(() => {
      // Update localStorage for demo purposes - in a real app this would hit an API
      const existingProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
      localStorage.setItem('medicalProfile', JSON.stringify({
        ...existingProfile,
        [currentSection]: {
          completed: true,
          lastUpdated: new Date().toISOString(),
          ...additionalData
        }
      }));
      
      setIsSaving(false);
      toast.success('Medical information saved successfully');
      
      // Determine where to navigate next
      if (currentSection === 'preventative') {
        // If we're on the last form section, always go to dashboard
        navigate('/dashboard');
        return;
      }
      
      // For all other sections, continue to the next one (unless specified otherwise)
      const sections: SectionType[] = [
        'personal', 'history', 'medications', 'allergies', 'social',
        'reproductive', 'mental', 'functional', 'cultural', 'preventative'
      ];
      const currentIndex = sections.indexOf(currentSection as SectionType);
      
      // Skip mental health section if user selected "no" for mental health history
      if (currentSection === 'history' && hasMentalHealthHistory === 'no' && currentIndex < sections.length - 2) {
        navigate(`/profile/edit/${sections[currentIndex + 2]}`);
      } else if (currentIndex < sections.length - 1) {
        navigate(`/profile/edit/${sections[currentIndex + 1]}`);
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };

  // Function to update mental health history state from child component
  const updateMentalHealthHistory = (value: string) => {
    setHasMentalHealthHistory(value);
  };

  // Render the appropriate form based on section parameter
  const renderForm = () => {
    switch (currentSection) {
      case 'personal':
        return <MedicalProfilePersonalForm />;
      case 'history':
        return <MedicalProfileHistoryForm onMentalHealthHistoryChange={updateMentalHealthHistory} />;
      case 'medications':
        return <MedicalProfileMedicationsForm />;
      case 'allergies':
        return <MedicalProfileAllergiesForm />;
      case 'social':
        return <MedicalProfileSocialHistoryForm />;
      case 'reproductive':
        return <MedicalProfileReproductiveHistoryForm />;
      case 'mental':
        // Only render mental health form if user has mental health history
        return hasMentalHealthHistory === 'yes' ? (
          <MedicalProfileMentalHealthForm />
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">This section is not applicable based on your medical history.</p>
          </div>
        );
      case 'functional':
        return <MedicalProfileFunctionalStatusForm />;
      case 'cultural':
        return <MedicalProfileCulturalPreferencesForm />;
      case 'preventative':
        return <MedicalProfilePreventativeCareForm />;
      default:
        return <MedicalProfilePersonalForm />;
    }
  };

  // Get section title for page heading
  const getSectionTitle = () => {
    switch (currentSection) {
      case 'personal':
        return 'Personal Information';
      case 'history':
        return 'Medical History';
      case 'medications':
        return 'Medications & Supplements';
      case 'allergies':
        return 'Allergies & Immunizations';
      case 'social':
        return 'Social History';
      case 'reproductive':
        return 'Reproductive History';
      case 'mental':
        return 'Mental Health';
      case 'functional':
        return 'Functional Status';
      case 'cultural':
        return 'Cultural & Religious Preferences';
      case 'preventative':
        return 'Preventative Care';
      default:
        return 'Personal Information';
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            {getSectionTitle()}
          </h1>
          <p className="text-gray-600 mt-1">
            Update your medical information
          </p>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {renderForm()}
          
          <div className="mt-8 flex justify-end gap-3">
            {currentSection !== 'personal' && (
              <Button 
                variant="outline"
                onClick={() => {
                  const sections: SectionType[] = [
                    'personal', 'history', 'medications', 'allergies', 'social',
                    'reproductive', 'mental', 'functional', 'cultural', 'preventative'
                  ];
                  const currentIndex = sections.indexOf(currentSection as SectionType);
                  
                  // Skip mental health section when navigating backward if user selected "no"
                  if (currentSection === 'functional' && hasMentalHealthHistory === 'no' && currentIndex > 1) {
                    navigate(`/profile/edit/${sections[currentIndex - 2]}`);
                  } else if (currentIndex > 0) {
                    navigate(`/profile/edit/${sections[currentIndex - 1]}`);
                  }
                }}
              >
                Previous
              </Button>
            )}
            <Button 
              onClick={handleSave} 
              className="bg-safet-500 hover:bg-safet-600"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : currentSection === 'preventative' ? 'Complete Profile' : 'Save & Continue'}
              {!isSaving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MedicalProfileForm;
