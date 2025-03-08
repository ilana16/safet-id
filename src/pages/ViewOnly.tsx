
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Lock, AlertTriangle, Printer } from 'lucide-react';
import { validateAccessCode } from '@/utils/accessCode';
import { toast } from '@/lib/toast';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accessCode: string;
}

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

const ViewOnly = () => {
  const { userId, accessCode: urlAccessCode } = useParams<{ userId: string; accessCode?: string }>();
  const [accessCode, setAccessCode] = useState(urlAccessCode || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<MedicalProfileData | null>(null);
  
  useEffect(() => {
    // In a real app, this would validate the userId exists
    // For demo, we'll use localStorage user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    
    // If we have a URL access code, try to verify automatically
    if (urlAccessCode && validateAccessCode(urlAccessCode)) {
      handleAutoVerify(urlAccessCode);
    }
  }, [userId, urlAccessCode]);

  const handleAutoVerify = (code: string) => {
    setIsVerifying(true);
    
    // In a real app, this would verify against an API
    setTimeout(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (code === user.accessCode) {
          setIsVerified(true);
          
          // Get medical profile data
          const storedProfile = localStorage.getItem('medicalProfile');
          if (storedProfile) {
            setProfileData(JSON.parse(storedProfile));
          }
          
          toast.success('Access code verified!');
        } else {
          setError('Invalid access code. Please try again.');
        }
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleAccessCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setAccessCode(value);
    if (error) setError('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAccessCode(accessCode)) {
      setError('Please enter a valid 5-digit access code');
      return;
    }
    
    setIsVerifying(true);
    
    // In a real app, this would verify against an API
    setTimeout(() => {
      if (userData && accessCode === userData.accessCode) {
        setIsVerified(true);
        
        // Get medical profile data
        const storedProfile = localStorage.getItem('medicalProfile');
        if (storedProfile) {
          setProfileData(JSON.parse(storedProfile));
        }
        
        toast.success('Access code verified!');
      } else {
        setError('Invalid access code. Please try again.');
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            This QR code link appears to be invalid or has expired. Please contact the SafeT-iD owner for a valid QR code.
          </p>
          <Link to="/">
            <Button className="bg-safet-500 hover:bg-safet-600">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-safet-50 mb-4">
            <ShieldCheck className="h-8 w-8 text-safet-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">SafeT-iD Protected Information</h1>
          <p className="text-gray-600 mb-6">
            Enter the 5-digit access code to view medical information for {userData.firstName} {userData.lastName}
          </p>
          
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative w-56 mx-auto">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="5-digit code"
                value={accessCode}
                onChange={handleAccessCodeChange}
                className={`pl-10 text-center text-xl tracking-widest h-12 ${error ? 'border-red-300' : ''}`}
                inputMode="numeric"
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-56 bg-safet-500 hover:bg-safet-600" 
              disabled={isVerifying || accessCode.length !== 5}
            >
              {isVerifying ? 'Verifying...' : 'View Medical Information'}
            </Button>
          </form>
          
          <p className="text-sm text-gray-500 mt-8">
            This is a secure page. The access code protects the personal medical information and is only available to authorized individuals.
          </p>
        </div>
      </div>
    );
  }

  // Verified state - show full medical record
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-6 w-6 text-safet-500" />
              <span className="text-lg font-semibold text-gray-900">SafeT-iD</span>
            </div>
            <div className="text-sm text-gray-600">
              View-only Medical Information
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-safet-50 to-white px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Medical Information for {userData.firstName} {userData.lastName}
                  </h1>
                  <p className="text-sm text-gray-600">
                    This is a view-only page. Information last updated on {new Date().toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={handlePrint}
                  className="print:hidden flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Personal Information Section */}
              <section className="mb-8 print:mb-12">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <span className="bg-safet-100 text-safet-800 py-1 px-3 rounded-full text-sm mr-3">1</span>
                  Personal Information
                  {profileData?.personal?.completed && (
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
                  {profileData?.history?.completed && (
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
                  {profileData?.medications?.completed && (
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
                  {profileData?.allergies?.completed && (
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
          
          <div className="mt-8 flex justify-center print:hidden">
            <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg max-w-lg">
              <p className="text-sm text-yellow-800 text-center">
                <strong>Emergency Access Notice:</strong> This information is being viewed in emergency/view-only mode. 
                Contact {userData.firstName} {userData.lastName} for further details or for full medical history.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8 print:hidden">
            <Link to="/">
              <Button variant="outline" className="text-safet-700 border-safet-200 hover:bg-safet-50">
                Return to SafeT-iD Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600 text-center">
            This information is provided by SafeT-iD under HIPAA-compliant privacy protocols.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ViewOnly;
