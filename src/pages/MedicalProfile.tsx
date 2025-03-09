
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const sections = [
  { id: 'personal', label: 'Personal' },
  { id: 'basic', label: 'Basic Information' },
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
  
  // Extract the current section from the URL
  const pathParts = location.pathname.split('/');
  const currentSection = pathParts[pathParts.length - 1];

  // Load mental health history setting from localStorage
  useEffect(() => {
    try {
      const savedProfileJson = localStorage.getItem('medicalProfile');
      if (!savedProfileJson) return;
      
      const savedProfile = JSON.parse(savedProfileJson);
      console.log('Loaded profile data for tab navigation:', savedProfile);
      
      if (savedProfile && savedProfile.history && savedProfile.history.hasMentalHealthHistory) {
        setHasMentalHealthHistory(savedProfile.history.hasMentalHealthHistory);
      }
    } catch (error) {
      console.error('Error loading mental health history setting:', error);
    }
  }, []);

  const handleTabChange = (value: string) => {
    navigate(`/profile/${value}`);
  };

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
