import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/lib/toast';
import { logChanges } from '@/utils/changeLog';

type SectionType = 'personal' | 'history' | 'medications' | 'allergies' | 'immunizations' | 'social' | 
                   'reproductive' | 'mental' | 'functional' | 'cultural' | 'preventative';

const sections = [
  { id: 'personal', label: 'Personal' },
  { id: 'history', label: 'Medical History' },
  { id: 'medications', label: 'Medications' },
  { id: 'allergies', label: 'Allergies' },
  { id: 'immunizations', label: 'Immunizations & Vaccines' },
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
  const [lastSaved, setLastSaved] = useState<{[key: string]: string | null}>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const pathParts = location.pathname.split('/');
  const currentSection = pathParts[pathParts.length - 1] === 'profile' ? 'personal' : pathParts[pathParts.length - 1];

  useEffect(() => {
    console.log('Loading all profile data on component mount');
    loadFullProfileData();
    
    const reloadInterval = setInterval(() => {
      loadFullProfileData(false);
    }, 60000);
    
    return () => {
      clearInterval(reloadInterval);
    };
  }, []);

  useEffect(() => {
    console.log(`Route changed to ${location.pathname}, loading section: ${currentSection}`);
    setIsLoadingData(true);
    
    try {
      loadCurrentSectionData();
      
      loadFullProfileData(false);
    } catch (error) {
      console.error('Error reloading section data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [location.pathname]);

  const loadFullProfileData = (showLoading = true) => {
    if (showLoading) {
      setIsLoadingData(true);
    }
    
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (!savedProfileJson) {
        if (showLoading) setIsLoadingData(false);
        return;
      }
      
      const savedProfile = JSON.parse(savedProfileJson);
      console.log('Loaded full profile data:', savedProfile);
      
      setProfileData(savedProfile);
      
      const newLastSaved: {[key: string]: string | null} = {};
      
      Object.entries(savedProfile).forEach(([sectionKey, sectionData]: [string, any]) => {
        if (sectionData && sectionData.lastUpdated) {
          newLastSaved[sectionKey] = sectionData.lastUpdated;
        }
      });
      
      setLastSaved(newLastSaved);
      
      if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
        setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
      }
    } catch (error) {
      console.error('Error loading full medical profile data:', error);
    } finally {
      if (showLoading) {
        setIsLoadingData(false);
      }
    }
  };

  const loadCurrentSectionData = () => {
    try {
      const sessionKey = `${currentSection}FormData`;
      const sessionData = sessionStorage.getItem(sessionKey);
      
      if (sessionData) {
        try {
          const parsedData = JSON.parse(sessionData);
          console.log(`Loaded ${currentSection} data from session storage:`, parsedData);
          
          const windowKey = getCurrentSectionWindowKey(currentSection);
          if (windowKey) {
            console.log(`Setting ${windowKey} data from session storage`);
            (window as any)[windowKey] = parsedData;
          }
          
          if (parsedData.lastUpdated) {
            setLastSaved(prev => ({...prev, [currentSection]: parsedData.lastUpdated}));
          }
          
          return;
        } catch (e) {
          console.error(`Error parsing session data for ${currentSection}:`, e);
        }
      }
      
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (!savedProfileJson) return;
      
      const savedProfile = JSON.parse(savedProfileJson);
      if (savedProfile && savedProfile[currentSection]) {
        console.log(`Loaded ${currentSection} data from localStorage:`, savedProfile[currentSection]);
        
        const windowKey = getCurrentSectionWindowKey(currentSection);
        if (windowKey) {
          console.log(`Setting ${windowKey} data from localStorage`);
          (window as any)[windowKey] = savedProfile[currentSection];
          
          sessionStorage.setItem(sessionKey, JSON.stringify(savedProfile[currentSection]));
        }
        
        if (savedProfile[currentSection].lastUpdated) {
          setLastSaved(prev => ({...prev, [currentSection]: savedProfile[currentSection].lastUpdated}));
        }
      }
    } catch (error) {
      console.error(`Error loading data for ${currentSection}:`, error);
    }
  };

  useEffect(() => {
    const reloadTimeout = setTimeout(() => {
      loadCurrentSectionData();
    }, 100);
    
    const autoSaveInterval = setInterval(() => {
      const windowKey = getCurrentSectionWindowKey(currentSection);
      if (windowKey && (window as any)[windowKey]) {
        const sessionKey = `${currentSection}FormData`;
        const currentData = (window as any)[windowKey];
        sessionStorage.setItem(sessionKey, JSON.stringify(currentData));
        console.log(`Auto-saved ${currentSection} data to session storage:`, currentData);
      }
    }, 30000);
    
    return () => {
      clearTimeout(reloadTimeout);
      clearInterval(autoSaveInterval);
    };
  }, [currentSection]);

  const saveCurrentSectionData = () => {
    const formDataKey = getCurrentSectionWindowKey(currentSection);
    console.log(`Attempting to save data for section: ${currentSection}, using key: ${formDataKey}`);
    
    const currentFormData = (window as any)[formDataKey];
    
    if (!currentFormData) {
      console.log(`No form data found for ${currentSection} with key ${formDataKey}`);
      return false;
    }
    
    console.log(`Auto-saving ${currentSection} data before tab change:`, currentFormData);
    setIsSaving(true);
    
    try {
      const existingProfileJson = localStorage.getItem('medicalProfile');
      const existingProfile = existingProfileJson ? JSON.parse(existingProfileJson) : {};
      const existingSectionData = existingProfile[currentSection] || {};
      
      const changes: {field: string; oldValue: any; newValue: any}[] = [];
      
      if (currentSection === 'medications' || 
          currentSection === 'social' || 
          currentSection === 'reproductive' || 
          currentSection === 'mental' || 
          currentSection === 'functional' ||
          currentSection === 'cultural' ||
          currentSection === 'preventative' ||
          currentSection === 'allergies') {
        
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
      
      const saveTimestamp = new Date().toISOString();
      
      const updatedProfile = {
        ...existingProfile,
        [currentSection]: {
          ...currentFormData,
          lastUpdated: saveTimestamp
        }
      };
      
      localStorage.setItem('medicalProfile', JSON.stringify(updatedProfile));
      console.log('Auto-saved updated profile:', updatedProfile);
      
      sessionStorage.setItem(`${currentSection}FormData`, JSON.stringify({
        ...currentFormData,
        lastUpdated: saveTimestamp
      }));
      console.log(`Updated session storage for ${currentSection}FormData`);
      
      setLastSaved(prev => ({...prev, [currentSection]: saveTimestamp}));
      
      if (changes.length > 0) {
        logChanges(currentSection, changes);
      }
      
      setIsSaving(false);
      setProfileData(prev => ({
        ...prev,
        [currentSection]: {
          ...currentFormData,
          lastUpdated: saveTimestamp
        }
      }));
      return true;
    } catch (error) {
      console.error(`Error auto-saving ${currentSection} data:`, error);
      setIsSaving(false);
      return false;
    }
  };

  const handleTabChange = (value: string) => {
    const saved = saveCurrentSectionData();
    
    if (saved) {
      toast.success(`${getSectionTitle(currentSection)} information saved automatically`);
    }
    
    navigate(`/profile/${value}`);
  };

  const getCurrentSectionWindowKey = (section: string): string => {
    switch (section) {
      case 'personal': return 'personalFormData';
      case 'history': return 'historyFormData';
      case 'medications': return 'medicationsFormData';
      case 'allergies': return 'allergiesFormData';
      case 'immunizations': return 'immunizationsFormData';
      case 'social': return 'socialHistoryFormData';
      case 'reproductive': return 'reproductiveHistoryFormData';
      case 'mental': return 'mentalHealthFormData';
      case 'functional': return 'functionalStatusFormData';
      case 'cultural': return 'culturalPreferencesFormData';
      case 'preventative': return 'preventativeCareFormData';
      default: return '';
    }
  };

  const getSectionTitle = (section: string): string => {
    const sectionObj = sections.find(s => s.id === section);
    return sectionObj ? sectionObj.label : 'Section';
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
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      console.error('Error formatting timestamp:', e);
      return null;
    }
  };

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
          <div className="flex justify-between items-center">
            <p className="text-gray-600 mt-1">
              Update your comprehensive medical information with our new section-by-section editor
            </p>
            <div className="flex items-center">
              <Button
                onClick={saveCurrentSectionData}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 text-xs"
                disabled={isSaving || isLoadingData}
              >
                {isSaving ? 'Saving...' : isLoadingData ? 'Loading...' : 'Save'}
                {!isSaving && !isLoadingData && <Save className="h-3 w-3" />}
              </Button>
              {lastSaved[currentSection] && (
                <p className="text-xs text-gray-500 ml-2">
                  Last saved: {formatLastSaved(lastSaved[currentSection])}
                </p>
              )}
            </div>
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
                        {lastSaved[section.id] && (
                          <span className="text-xs text-gray-500 ml-1">
                            {formatLastSaved(lastSaved[section.id])}
                          </span>
                        )}
                      </div>
                    </TabsTrigger>
                  ))
                }
              </TabsList>
            </Tabs>
          </div>
          
          <div className="md:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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
                <Outlet />
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MedicalProfile;
