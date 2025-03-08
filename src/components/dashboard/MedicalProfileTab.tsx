
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';

interface MedicalProfileTabProps {
  completionPercentage: number;
}

const MedicalProfileTab: React.FC<MedicalProfileTabProps> = ({ completionPercentage }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Medical Information</h2>
          <p className="text-gray-600 text-sm mt-1">
            {completionPercentage < 100 ? (
              <>Complete your medical profile</>
            ) : (
              <>Your comprehensive health record</>
            )}
          </p>
        </div>
        <Link to="/profile/edit">
          <Button className="bg-safet-500 hover:bg-safet-600">
            {completionPercentage > 0 ? "Edit Information" : "Complete Profile"}
          </Button>
        </Link>
      </div>
      
      {completionPercentage === 0 ? (
        <div className="py-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-safet-50 mb-4">
            <ClipboardCheck className="h-8 w-8 text-safet-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Time to complete your medical profile
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Add your comprehensive medical information to ensure healthcare providers have what they need in an emergency.
          </p>
          <Link to="/profile/edit">
            <Button className="bg-safet-500 hover:bg-safet-600">
              Start Now
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Preview of medical information sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Personal Information</h3>
              <p className="text-xs text-gray-600">Basic details, emergency contacts, and insurance information</p>
              <div className="mt-2 flex justify-end">
                <Link to="/profile/edit/personal">
                  <Button size="sm" variant="ghost" className="text-xs">
                    View & Edit
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Medical History</h3>
              <p className="text-xs text-gray-600">Past diagnoses, hospitalizations, surgeries, and conditions</p>
              <div className="mt-2 flex justify-end">
                <Link to="/profile/edit/history">
                  <Button size="sm" variant="ghost" className="text-xs">
                    View & Edit
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Medications</h3>
              <p className="text-xs text-gray-600">Current prescriptions, supplements, and over-the-counter medications</p>
              <div className="mt-2 flex justify-end">
                <Link to="/profile/edit/medications">
                  <Button size="sm" variant="ghost" className="text-xs">
                    View & Edit
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Allergies & Immunizations</h3>
              <p className="text-xs text-gray-600">Allergic reactions and vaccination history</p>
              <div className="mt-2 flex justify-end">
                <Link to="/profile/edit/allergies">
                  <Button size="sm" variant="ghost" className="text-xs">
                    View & Edit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-3">
            <Link to="/profile/view">
              <Button variant="outline" className="text-safet-700 border-safet-200 hover:bg-safet-50">
                View Full Medical Record
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalProfileTab;
