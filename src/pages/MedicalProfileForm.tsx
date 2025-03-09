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
import { logChanges } from '@/utils/changeLog';

type SectionType = 'personal' | 'history' | 'medications' | 'allergies' | 'social' | 
                   'reproductive' | 'mental' | 'functional' | 'cultural' | 'preventative';

const MedicalProfileForm = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section: SectionType }>();
  const [isSaving, setIsSaving] = useState(false);
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  const [formData, setFormData] = useState<any>({});
  
  const currentSection = section || 'personal';

  useEffect(() => {
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (!savedProfileJson) return;
      
      const savedProfile = JSON.parse(savedProfileJson);
      console.log('Loaded profile data:', savedProfile);
      
      if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
        setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
      }
      
      if (savedProfile && savedProfile[currentSection]) {
        setFormData(savedProfile[currentSection]);
      } else {
        setFormData({});
      }
    } catch (error) {
      console.error('Error loading medical profile data:', error);
      setFormData({});
    }
  }, [currentSection]);

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile[currentSection] || {};
      
      let newFormData: any = {};
      
      if (currentSection === 'medications' && (window as any).medicationsFormData) {
        newFormData = (window as any).medicationsFormData;
      } else if (currentSection === 'cultural' && (window as any).culturalPreferencesFormData) {
        newFormData = (window as any).culturalPreferencesFormData;
      } else if (currentSection === 'preventative' && (window as any).preventativeCareFormData) {
        newFormData = (window as any).preventativeCareFormData;
      } else if (currentSection === 'social' && (window as any).socialHistoryFormData) {
        newFormData = (window as any).socialHistoryFormData;
      } else if (currentSection === 'functional' && (window as any).functionalStatusFormData) {
        newFormData = (window as any).functionalStatusFormData;
      } else if (currentSection === 'reproductive' && (window as any).reproductiveHistoryFormData) {
        newFormData = (window as any).reproductiveHistoryFormData;
      } else if (currentSection === 'mental' && (window as any).mentalHealthFormData) {
        newFormData = (window as any).mentalHealthFormData;
      } else if (currentSection === 'allergies' && (window as any).allergiesFormData) {
        newFormData = (window as any).allergiesFormData;
      } else if (currentSection === 'history' && (window as any).historyFormData) {
        newFormData = (window as any).historyFormData;
        newFormData.hasMentalHealthHistory = hasMentalHealthHistory;
      } else if (currentSection === 'personal' && (window as any).personalFormData) {
        newFormData = (window as any).personalFormData;
      } else {
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
      
      const additionalData = currentSection === 'history' ? 
        { hasMentalHealthHistory } : {};
      
      setTimeout(() => {
        const updatedProfile = {
          ...existingProfile,
          [currentSection]: {
            ...newFormData,
            completed: true,
            lastUpdated: new Date().toISOString(),
            ...additionalData
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        if (changes.length > 0) {
          logChanges(currentSection, changes);
        }
        
        setIsSaving(false);
        toast.success('Medical information saved successfully');
        
        if (currentSection === 'preventative') {
          navigate('/dashboard');
          return;
        }
        
        const sections: SectionType[] = [
          'personal', 'history', 'medications', 'allergies', 'social',
          'reproductive', 'mental', 'functional', 'cultural', 'preventative'
        ];
        const currentIndex = sections.indexOf(currentSection as SectionType);
        
        if (currentSection === 'history' && hasMentalHealthHistory === 'no' && currentIndex < sections.length - 2) {
          navigate(`/profile/edit/${sections[currentIndex + 2]}`);
        } else if (currentIndex < sections.length - 1) {
          navigate(`/profile/edit/${sections[currentIndex + 1]}`);
        } else {
          navigate('/dashboard');
        }
      }, 1000);
    } catch (error) {
      console.error('Error saving medical profile data:', error);
      setIsSaving(false);
      toast.error('Error saving medical information');
    }
  };

  const updateMentalHealthHistory = (value: string) => {
    setHasMentalHealthHistory(value);
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
      case 'preventative':
        return <MedicalProfilePreventativeCareForm />;
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
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
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
