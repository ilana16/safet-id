
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

type SectionType = 'personal' | 'history' | 'medications' | 'allergies' | 'social' | 
                   'reproductive' | 'mental' | 'functional' | 'cultural' | 'preventative';

const sections = [
  { id: 'personal', label: 'Personal' },
  { id: 'history', label: 'Medical History' },
  { id: 'medications', label: 'Medications' },
  { id: 'allergies', label: 'Allergies' },
  { id: 'social', label: 'Social History' },
  { id: 'reproductive', label: 'Reproductive' },
  { id: 'mental', label: 'Mental Health' },
  { id: 'functional', label: 'Functional Status' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'preventative', label: 'Preventative Care' }
];

const MedicalProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasMentalHealthHistory, setHasMentalHealthHistory] = useState('no');
  const [profileData, setProfileData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  const pathParts = location.pathname.split('/');
  const currentSection = pathParts[pathParts.length - 1];

  // Load all profile data when component mounts or when location changes
  useEffect(() => {
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (!savedProfileJson) return;
      
      const savedProfile = JSON.parse(savedProfileJson);
      console.log('Loaded profile data for all sections:', savedProfile);
      
      // Store all sections data
      setProfileData(savedProfile);
      
      if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
        setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
      }
    } catch (error) {
      console.error('Error loading medical profile data:', error);
    }
  }, [location.pathname]);

  const saveCurrentSectionData = () => {
    const formDataKey = getCurrentSectionWindowKey(currentSection);
    const currentFormData = (window as any)[formDataKey];
    
    if (!currentFormData) return false;
    
    console.log(`Auto-saving ${currentSection} data before tab change:`, currentFormData);
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile[currentSection] || {};
      
      const changes: {field: string; oldValue: any; newValue: any}[] = [];
      
      // Handle different section data formats
      if (currentSection === 'medications' || 
          currentSection === 'social' || 
          currentSection === 'reproductive' || 
          currentSection === 'mental' || 
          currentSection === 'functional') {
        
        Object.keys(currentFormData).forEach(key => {
          const oldValue = existingSectionData[key];
          const newValue = currentFormData[key];
          
          if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push({
              field: key,
              oldValue: oldValue,
              newValue: newValue
            });
          }
        });
      } else {
        Object.entries(currentFormData).forEach(([key, value]) => {
          if (existingSectionData[key] !== value) {
            changes.push({
              field: key,
              oldValue: existingSectionData[key],
              newValue: value
            });
          }
        });
      }
      
      const updatedProfile = {
        ...existingProfile,
        [currentSection]: {
          ...currentFormData,
          lastUpdated: new Date().toISOString()
        }
      };
      
      localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
      console.log('Auto-saved updated profile:', updatedProfile);
      
      if (changes.length > 0) {
        logChanges(currentSection, changes);
      }
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error(`Error auto-saving ${currentSection} data:`, error);
      setIsSaving(false);
      return false;
    }
  };

  const handleTabChange = (value: string) => {
    // Save any current section data to localStorage before navigating
    const saved = saveCurrentSectionData();
    
    if (saved) {
      toast.success(`${getSectionTitle(currentSection)} information saved automatically`);
    }
    
    // Navigate to the new tab
    navigate(`/profile/${value}`);
  };

  // Helper function to get the window key for a given section
  const getCurrentSectionWindowKey = (section: string): string => {
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

  // Function to get section title for toast message
  const getSectionTitle = (section: string): string => {
    const sectionObj = sections.find(s => s.id === section);
    return sectionObj ? sectionObj.label : 'Section';
  };

  // Update window object with the current section's form data to make it available for the forms
  useEffect(() => {
    if (Object.keys(profileData).length === 0) return;
    
    const currentSectionData = (profileData as any)[currentSection];
    if (!currentSectionData) return;
    
    const formDataKey = getCurrentSectionWindowKey(currentSection);
    
    console.log(`Setting ${currentSection} form data in window object:`, currentSectionData);
    
    // Set the data in the window object
    (window as any)[formDataKey] = { ...currentSectionData };
    
    // Additionally save to sessionStorage for persistence during page refreshes
    sessionStorage.setItem(formDataKey, JSON.stringify(currentSectionData));
    
  }, [currentSection, profileData]);

  // Listen for beforeunload event to save data when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentSectionData();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentSection]);

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Medical Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Update your comprehensive medical information with our new section-by-section editor
          </p>
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
                      {section.label}
                    </TabsTrigger>
                  ))
                }
              </TabsList>
            </Tabs>
          </div>
          
          <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MedicalProfile;
