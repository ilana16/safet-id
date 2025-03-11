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
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  const currentSection = section || 'personal';

  useEffect(() => {
    try {
      const sessionKey = `${currentSection}FormData`;
      const sessionData = sessionStorage.getItem(sessionKey);
      
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        console.log(`Loaded ${currentSection} data from session storage:`, parsedData);
        
        const windowKey = getWindowKeyForSection(currentSection);
        if (windowKey) {
          (window as any)[windowKey] = parsedData;
        }
        
        setFormData(parsedData);
        
        if (parsedData.lastUpdated) {
          setLastSaved(parsedData.lastUpdated);
        }
        
        return;
      }
      
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (!savedProfileJson) return;
      
      const savedProfile = JSON.parse(savedProfileJson);
      console.log('Loaded profile data:', savedProfile);
      
      if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
        setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
      }
      
      if (savedProfile && savedProfile[currentSection]) {
        setFormData(savedProfile[currentSection]);
        
        const windowKey = getWindowKeyForSection(currentSection);
        if (windowKey) {
          (window as any)[windowKey] = savedProfile[currentSection];
          
          sessionStorage.setItem(sessionKey, JSON.stringify(savedProfile[currentSection]));
        }
        
        if (savedProfile[currentSection].lastUpdated) {
          setLastSaved(savedProfile[currentSection].lastUpdated);
        }
      } else {
        setFormData({});
      }
    } catch (error) {
      console.error(`Error loading ${currentSection} data:`, error);
      setFormData({});
    }
  }, [currentSection]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const windowKey = getWindowKeyForSection(currentSection);
      if (windowKey && (window as any)[windowKey]) {
        const sessionKey = `${currentSection}FormData`;
        sessionStorage.setItem(sessionKey, JSON.stringify((window as any)[windowKey]));
        console.log(`Saved ${currentSection} data to session storage before unload:`, (window as any)[windowKey]);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [currentSection]);

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
      
      const saveTimestamp = new Date().toISOString();
      
      setTimeout(() => {
        const updatedProfile = {
          ...existingProfile,
          [currentSection]: {
            ...newFormData,
            completed: true,
            lastUpdated: saveTimestamp,
            ...additionalData
          }
        };
        
        localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
        console.log('Saved updated profile:', updatedProfile);
        
        const sessionKey = `${currentSection}FormData`;
        sessionStorage.setItem(sessionKey, JSON.stringify({
          ...newFormData,
          completed: true,
          lastUpdated: saveTimestamp,
          ...additionalData
        }));
        
        if (changes.length > 0) {
          logChanges(currentSection, changes);
        }
        
        setIsSaving(false);
        setLastSaved(saveTimestamp);
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

  const formatLastSaved = (timestamp: string | null) => {
    if (!timestamp) return null;
    
    try {
      const date = new Date(timestamp);
      
      if (isNaN(date.getTime())) return null;
      
      const now = new Date();
      const isToday = date.getDate() === now.getDate() && 
                     date.getMonth() === now.getMonth() && 
                     date.getFullYear() === now.getFullYear();
      
      if (isToday) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = date.getDate() === yesterday.getDate() && 
                         date.getMonth() === yesterday.getMonth() && 
                         date.getFullYear() === yesterday.getFullYear();
      
      if (isYesterday) {
        return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) + ' at ' + date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (e) {
      console.error('Error formatting timestamp:', e);
      return null;
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
          <div className="flex justify-between items-center">
            <p className="text-gray-600 mt-1">
              Update your medical information
            </p>
            {lastSaved && (
              <p className="text-xs text-gray-500 mt-1">
                Last saved: {formatLastSaved(lastSaved)}
              </p>
            )}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          {renderForm()}
          
          <div className="mt-8 flex items-center justify-between">
            <div>
              {lastSaved && (
                <p className="text-xs text-gray-500">
                  Last saved: {formatLastSaved(lastSaved)}
                </p>
              )}
            </div>
            
            <div className="flex gap-3">
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
      </div>
    </PageLayout>
  );
};

export default MedicalProfileForm;
