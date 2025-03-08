
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Printer, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface MedicalProfileData {
  personal?: {
    completed: boolean;
    lastUpdated: string;
  };
  history?: {
    completed: boolean;
    lastUpdated: string;
  };
  medications?: {
    completed: boolean;
    lastUpdated: string;
  };
  allergies?: {
    completed: boolean;
    lastUpdated: string;
  };
}

const MedicalRecordView = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<MedicalProfileData | null>(null);
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    setUserData(JSON.parse(storedUser));
    
    // Get medical profile data
    const storedProfile = localStorage.getItem('medicalProfile');
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile));
    }
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (!userData || !profileData) {
    return (
      <PageLayout className="bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900">
              Complete Medical Record
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive health information for {userData.firstName} {userData.lastName}
            </p>
          </div>
          
          <div className="flex gap-2 print:hidden">
            <Button 
              variant="outline"
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
          <div className="print:py-4">
            <div className="flex justify-between items-start mb-6 print:mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 print:text-2xl">
                  Medical Record: {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
              
              <div className="print:hidden">
                <Link to="/profile/edit">
                  <Button size="sm" className="bg-safet-500 hover:bg-safet-600">
                    Edit Information
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Personal Information Section */}
            <section className="mb-8 print:mb-12">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="bg-safet-100 text-safet-800 py-1 px-3 rounded-full text-sm mr-3">1</span>
                Personal Information
                {profileData.personal?.completed && (
                  <span className="ml-3 text-xs text-gray-500">
                    Last updated: {formatDate(profileData.personal.lastUpdated)}
                  </span>
                )}
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h4>
                    <ul className="space-y-2">
                      <li className="text-sm"><span className="font-medium">Name:</span> {userData.firstName} {userData.lastName}</li>
                      <li className="text-sm"><span className="font-medium">Email:</span> {userData.email}</li>
                      <li className="text-sm"><span className="font-medium">Date of Birth:</span> January 1, 1980</li>
                      <li className="text-sm"><span className="font-medium">Blood Type:</span> O+</li>
                      <li className="text-sm"><span className="font-medium">Height:</span> 5'10" (178 cm)</li>
                      <li className="text-sm"><span className="font-medium">Weight:</span> 170 lbs (77 kg)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Emergency Contacts</h4>
                    <ul className="space-y-2">
                      <li className="text-sm"><span className="font-medium">Primary:</span> Jane Doe (Spouse) - (555) 123-4567</li>
                      <li className="text-sm"><span className="font-medium">Secondary:</span> John Smith (Brother) - (555) 987-6543</li>
                    </ul>
                    
                    <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Insurance Information</h4>
                    <ul className="space-y-2">
                      <li className="text-sm"><span className="font-medium">Provider:</span> Health First Insurance</li>
                      <li className="text-sm"><span className="font-medium">Policy Number:</span> HFI-12345678</li>
                      <li className="text-sm"><span className="font-medium">Group Number:</span> GRP-987654</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Medical History Section */}
            <section className="mb-8 print:mb-12">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="bg-safet-100 text-safet-800 py-1 px-3 rounded-full text-sm mr-3">2</span>
                Medical History
                {profileData.history?.completed && (
                  <span className="ml-3 text-xs text-gray-500">
                    Last updated: {formatDate(profileData.history.lastUpdated)}
                  </span>
                )}
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Conditions</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-sm">Type 2 Diabetes (Diagnosed 2015)</li>
                      <li className="text-sm">Hypertension (Diagnosed 2017)</li>
                      <li className="text-sm">Mild Asthma (Diagnosed 1995)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Past Surgeries</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-sm">Appendectomy (2005)</li>
                      <li className="text-sm">Arthroscopic knee surgery (2012)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Hospitalizations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-sm">Pneumonia (2010) - Memorial Hospital, 5 days</li>
                      <li className="text-sm">Dehydration (2018) - County Medical Center, 2 days</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Family Medical History</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-sm">Father: Heart disease, Type 2 Diabetes</li>
                      <li className="text-sm">Mother: Breast cancer (survived), Hypertension</li>
                      <li className="text-sm">Paternal Grandfather: Stroke at age 72</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Medications Section */}
            <section className="mb-8 print:mb-12">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="bg-safet-100 text-safet-800 py-1 px-3 rounded-full text-sm mr-3">3</span>
                Medications
                {profileData.medications?.completed && (
                  <span className="ml-3 text-xs text-gray-500">
                    Last updated: {formatDate(profileData.medications.lastUpdated)}
                  </span>
                )}
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Medications</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left p-2 font-medium">Medication</th>
                            <th className="text-left p-2 font-medium">Dosage</th>
                            <th className="text-left p-2 font-medium">Frequency</th>
                            <th className="text-left p-2 font-medium">Purpose</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="p-2">Metformin</td>
                            <td className="p-2">500 mg</td>
                            <td className="p-2">Twice daily</td>
                            <td className="p-2">Diabetes management</td>
                          </tr>
                          <tr className="border-b border-gray-200">
                            <td className="p-2">Lisinopril</td>
                            <td className="p-2">10 mg</td>
                            <td className="p-2">Once daily</td>
                            <td className="p-2">Blood pressure control</td>
                          </tr>
                          <tr>
                            <td className="p-2">Albuterol Inhaler</td>
                            <td className="p-2">2 puffs</td>
                            <td className="p-2">As needed</td>
                            <td className="p-2">Asthma relief</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Supplements</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-sm">Multivitamin - 1 tablet daily</li>
                      <li className="text-sm">Vitamin D3 - 2000 IU daily</li>
                      <li className="text-sm">Fish Oil - 1000 mg daily</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Allergies Section */}
            <section className="mb-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <span className="bg-safet-100 text-safet-800 py-1 px-3 rounded-full text-sm mr-3">4</span>
                Allergies & Immunizations
                {profileData.allergies?.completed && (
                  <span className="ml-3 text-xs text-gray-500">
                    Last updated: {formatDate(profileData.allergies.lastUpdated)}
                  </span>
                )}
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Allergies</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-sm">Penicillin - Severe (Anaphylaxis)</li>
                      <li className="text-sm">Shellfish - Moderate (Hives, Swelling)</li>
                      <li className="text-sm">Pollen - Mild (Congestion, Itchy Eyes)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Immunizations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li className="text-sm">Influenza - Yearly (Last: Sep 2023)</li>
                      <li className="text-sm">Tetanus/Tdap - 2020</li>
                      <li className="text-sm">COVID-19 - Primary series + 2 boosters (Last: Mar 2023)</li>
                      <li className="text-sm">Pneumococcal - 2022</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        <div className="print:hidden bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600 mb-8">
          <p className="mb-2">
            <strong>Note:</strong> This is a sample medical record with placeholder information for demonstration purposes.
          </p>
          <p>
            In a fully implemented system, this would contain your complete and accurate medical information as entered 
            in the medical profile sections.
          </p>
        </div>
        
        <div className="text-center print:hidden">
          <Link to="/dashboard">
            <Button variant="outline" className="text-safet-700 border-safet-200 hover:bg-safet-50">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};

export default MedicalRecordView;
