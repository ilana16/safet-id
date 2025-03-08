import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { toast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Save } from 'lucide-react';
import MedicalProfilePersonalForm from '@/components/forms/MedicalProfilePersonalForm';
import MedicalProfileHistoryForm from '@/components/forms/MedicalProfileHistoryForm';
import MedicalProfileMedicationsForm from '@/components/forms/MedicalProfileMedicationsForm';
import MedicalProfileAllergiesForm from '@/components/forms/MedicalProfileAllergiesForm';

// Define the valid section types
type SectionType = 'personal' | 'history' | 'medications' | 'allergies';

const MedicalProfileForm = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section: SectionType }>();
  const [isSaving, setIsSaving] = useState(false);
  
  // Get the current section or default to personal
  const currentSection = section || 'personal';

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update localStorage for demo purposes - in a real app this would hit an API
      const existingProfile = JSON.parse(localStorage.getItem('medicalProfile') || '{}');
      localStorage.setItem('medicalProfile', JSON.stringify({
        ...existingProfile,
        [currentSection]: {
          completed: true,
          lastUpdated: new Date().toISOString()
        }
      }));
      
      setIsSaving(false);
      toast.success('Medical information saved successfully');
      
      // Navigate to the next section if available, otherwise go to dashboard
      const sections: SectionType[] = ['personal', 'history', 'medications', 'allergies'];
      const currentIndex = sections.indexOf(currentSection as SectionType);
      
      if (currentIndex < sections.length - 1) {
        navigate(`/profile/edit/${sections[currentIndex + 1]}`);
      } else {
        navigate('/dashboard');
      }
    }, 1000);
  };

  // Render the appropriate form based on section parameter
  const renderForm = () => {
    switch (currentSection) {
      case 'personal':
        return <MedicalProfilePersonalForm />;
      case 'history':
        return <MedicalProfileHistoryForm />;
      case 'medications':
        return <MedicalProfileMedicationsForm />;
      case 'allergies':
        return <MedicalProfileAllergiesForm />;
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
        return 'Medications';
      case 'allergies':
        return 'Allergies & Immunizations';
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
                  const sections: SectionType[] = ['personal', 'history', 'medications', 'allergies'];
                  const currentIndex = sections.indexOf(currentSection as SectionType);
                  if (currentIndex > 0) {
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
              {isSaving ? 'Saving...' : currentSection === 'allergies' ? 'Complete Profile' : 'Save & Continue'}
              {!isSaving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default MedicalProfileForm;
