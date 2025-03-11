
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

  // This effect runs whenever the section changes
  useEffect(() => {
    try {
      console.log(`Section changed to: ${currentSection}`);
      const sessionKey = `${currentSection}FormData`;
      
      // When section changes, load the relevant data
      loadSectionData(currentSection);
      
      // Trigger a custom navigation event for form components to reload
      window.dispatchEvent(new Event('navigationChange'));
      
    } catch (error) {
      console.error(`Error handling section change for ${currentSection}:`, error);
    }
  }, [currentSection]);
  
  // Load data for a specific section
  const loadSectionData = (sectionName: string) => {
    try {
      console.log(`Loading data for section: ${sectionName}`);
      const sessionKey = `${sectionName}FormData`;
      
      // First try sessionStorage for quicker access
      const sessionData = sessionStorage.getItem(sessionKey);
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          console.log(`Loaded ${sectionName} data from session storage:`, parsedData);
          
          const windowKey = getWindowKeyForSection(sectionName);
          if (windowKey) {
            (window as any)[windowKey] = parsedData;
          }
          
          if (sectionName === 'history' && parsedData.hasMentalHealthHistory) {
            setHasMentalHealthHistory(parsedData.hasMentalHealthHistory);
          }
          
          setFormData(parsedData);
          return;
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
      
      // Fall back to localStorage
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (!savedProfileJson) return;
      
      const savedProfile = JSON.parse(savedProfileJson);
      console.log('Loaded profile data from localStorage:', savedProfile);
      
      if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
        setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
      }
      
      if (savedProfile && savedProfile[sectionName]) {
        const sectionData = savedProfile[sectionName];
        
        setFormData(sectionData);
        console.log(`Loaded ${sectionName} data from localStorage:`, sectionData);
        
        const windowKey = getWindowKeyForSection(sectionName);
        if (windowKey) {
          (window as any)[windowKey] = sectionData;
          
          // Update sessionStorage with localStorage data
          sessionStorage.setItem(sessionKey, JSON.stringify(sectionData));
          console.log(`Updated sessionStorage for ${sectionName} with localStorage data`);
        }
      } else {
        setFormData({});
      }
    } catch (error) {
      console.error(`Error loading ${sectionName} data:`, error);
      setFormData({});
    }
  };

  // Save current section data before unloading or unmounting
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentSectionData();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveCurrentSectionData();
    };
  }, [currentSection]);
  
  // Save the current section's data to both sessionStorage and localStorage
  const saveCurrentSectionData = () => {
    try {
      const windowKey = getWindowKeyForSection(currentSection);
      if (windowKey && (window as any)[windowKey]) {
        const currentData = (window as any)[windowKey];
        const sessionKey = `${currentSection}FormData`;
        
        // Save to sessionStorage
        sessionStorage.setItem(sessionKey, JSON.stringify(currentData));
        console.log(`Saved ${currentSection} data to session storage:`, currentData);
        
        // Also save to localStorage for persistence
        const savedProfileJson = localStorage.getItem('medicalProfile');
        const savedProfile = savedProfileJson ? JSON.parse(savedProfileJson) : {};
        
        localStorage.setItem('medicalProfile', JSON.stringify({
          ...savedProfile,
          [currentSection]: {
            ...currentData,
            lastUpdated: new Date().toISOString()
          }
        }));
        console.log(`Saved ${currentSection} data to localStorage`);
      }
    } catch (error) {
      console.error(`Error saving ${currentSection} data:`, error);
    }
  };

  const getWindowKeyForSection = (section: string): string => {
    switch (section) {
      case 'personal': return 'personalFormData';
      case 'history': return 'historyFormData';
      case 'medications': return 'medicationsFormData';
      case 'allergies': return 'allergiesFormData';
      case 'social': return 'socialHistoryFormData';
      case 'reproductive': return 'reproductiveHistoryFormData';
      case 'mental': return 'mentalHealthFormData';
      case 'functional': return 'functionalStatusFormData';
      case 'cultural': return 'culturalPreferencesFormData';
      case 'preventative': return 'preventativeCareFormData';
      default: return '';
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      // Save current section data first
      saveCurrentSectionData();
      
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile[currentSection] || {};
      
      let newFormData: any = {};
      const windowKey = getWindowKeyForSection(currentSection);
      
      if (windowKey && (window as any)[windowKey]) {
        newFormData = (window as any)[windowKey];
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
        
        const sessionKey = `${currentSection}FormData`;
        sessionStorage.setItem(sessionKey, JSON.stringify({
          ...newFormData,
          completed: true,
          lastUpdated: new Date().toISOString(),
          ...additionalData
        }));
        
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
              onClick={() => {
                saveCurrentSectionData(); // Save data before navigation
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
                    saveCurrentSectionData(); // Save data before navigation
                    
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
      </div>
    </PageLayout>
  );
};

export default MedicalProfileForm;
