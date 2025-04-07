
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
import { logChanges } from '@/utils/changeLog';
import { 
  loadSectionData, 
  saveSectionData, 
  getWindowKeyForSection 
} from '@/utils/medicalProfileService';

type SectionType = 'personal' | 'history' | 'medications' | 'allergies' | 'social' | 
                   'reproductive' | 'mental' | 'functional' | 'cultural';

const MedicalProfileForm = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section: SectionType }>();
  const [isSaving, setIsSaving] = useState(false);
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  const [formData, setFormData] = useState<any>({});
  
  const currentSection = section || 'personal';

  useEffect(() => {
    try {
      console.log(`Section changed to: ${currentSection}`);
      
      // Load the data for this section
      const sectionData = loadSectionData(currentSection);
      setFormData(sectionData);
      
      // If the section is history, update mental health history state
      if (currentSection === 'history' && sectionData && typeof sectionData !== 'object' && 'hasMentalHealthHistory' in sectionData) {
        setHasMentalHealthHistory(sectionData.hasMentalHealthHistory);
      } else {
        // For other sections, make sure we have the latest mental health history setting
        const savedProfileJson = localStorage.getItem('medicalProfile');
        if (savedProfileJson) {
          const savedProfile = JSON.parse(savedProfileJson);
          if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
            setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
          }
        }
      }
      
      // Notify components that navigation has changed
      window.dispatchEvent(new Event('navigationChange'));
      
    } catch (error) {
      console.error(`Error handling section change for ${currentSection}:`, error);
    }
  }, [currentSection]);

  // Save before unload or when component unmounts
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveSectionData(currentSection);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveSectionData(currentSection);
    };
  }, [currentSection]);

  const updateMentalHealthHistory = (value: string) => {
    setHasMentalHealthHistory(value);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Get the existing data before saving (for comparison)
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile[currentSection] || {};
      
      // Current form data from window object
      let newFormData: any = {};
      const windowKey = getWindowKeyForSection(currentSection);
      
      if (windowKey && (window as any)[windowKey]) {
        newFormData = (window as any)[windowKey];
      } else {
        // Fallback to collecting form data from the DOM
        const formElements = document.querySelectorAll('input, select, textarea');
        
        formElements.forEach(element => {
          const input = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
          const id = input.id;
          if (id && !id.startsWith('react-')) {
            newFormData[id] = input.value;
          }
        });
      }
      
      console.log('Saving form data for section:', currentSection, newFormData);
      
      // Track changes for logging
      const changes: {field: string; oldValue: any; newValue: any}[] = [];
      
      if (currentSection === 'medications' || 
          currentSection === 'social' || 
          currentSection === 'reproductive' || 
          currentSection === 'mental') {
        
        Object.keys(newFormData).forEach(key => {
          const oldValue = existingSectionData[key];
          const newValue = newFormData[key];
          
          if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push({
              field: key,
              oldValue: oldValue,
              newValue: newValue
            });
          }
        });
      } else {
        Object.entries(newFormData).forEach(([key, value]) => {
          if (existingSectionData[key] !== value) {
            changes.push({
              field: key,
              oldValue: existingSectionData[key],
              newValue: value
            });
          }
        });
      }
      
      // Add additional data for history section
      const additionalData = currentSection === 'history' ? 
        { hasMentalHealthHistory } : {};
      
      setTimeout(() => {
        // Save the data with additional fields
        const success = saveSectionData(currentSection, {
          ...newFormData,
          completed: true,
          ...additionalData
        });
        
        if (success) {
          if (changes.length > 0) {
            logChanges(currentSection, changes);
          }
          
          toast.success('Medical information saved successfully');
          
          if (currentSection === 'cultural') {
            navigate('/dashboard');
            return;
          }
          
          const sections: SectionType[] = [
            'personal', 'history', 'medications', 'allergies', 'social',
            'reproductive', 'mental', 'functional', 'cultural'
          ];
          const currentIndex = sections.indexOf(currentSection as SectionType);
          
          if (currentSection === 'history' && hasMentalHealthHistory === 'no' && currentIndex < sections.length - 2) {
            navigate(`/profile/edit/${sections[currentIndex + 2]}`);
          } else if (currentIndex < sections.length - 1) {
            navigate(`/profile/edit/${sections[currentIndex + 1]}`);
          } else {
            navigate('/dashboard');
          }
        } else {
          toast.error('Error saving medical information');
        }
        
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving medical profile data:', error);
      setIsSaving(false);
      toast.error('Error saving medical information');
    }
  };

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
      default:
        return <MedicalProfilePersonalForm />;
    }
  };

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
      default:
        return 'Personal Information';
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                saveSectionData(currentSection);
                navigate('/dashboard');
              }} 
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <Button 
              onClick={handleSave} 
              className="bg-safet-500 hover:bg-safet-600"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
              {!isSaving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900">
            {getSectionTitle()}
          </h1>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 mt-1">
              Update your medical information
            </p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {renderForm()}
          
          <div className="mt-8 flex items-center justify-between">
            <div>
            </div>
            
            <div className="flex gap-3">
              {currentSection !== 'personal' && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    saveSectionData(currentSection);
                    
                    const sections: SectionType[] = [
                      'personal', 'history', 'medications', 'allergies', 'social',
                      'reproductive', 'mental', 'functional', 'cultural'
                    ];
                    const currentIndex = sections.indexOf(currentSection as SectionType);
                    
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
                {isSaving ? 'Saving...' : currentSection === 'cultural' ? 'Complete Profile' : 'Save & Continue'}
                {!isSaving && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MedicalProfileForm;
