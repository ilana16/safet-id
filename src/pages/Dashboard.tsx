
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateQRCodeUrl } from '@/utils/qrcode';
import { toast } from '@/lib/toast';
import { User, QrCode, ClipboardCheck, Share2, Users, Settings } from 'lucide-react';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accessCode: string;
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser) as UserData;
    setUser(userData);
    
    // Generate QR code
    if (userData.id && userData.accessCode) {
      const qrUrl = generateQRCodeUrl(userData.id, userData.accessCode);
      setQrCodeUrl(qrUrl);
    }
    
    // Calculate profile completion (for demo purposes)
    // In a real app, this would check actual profile data
    const hasProfile = localStorage.getItem('medicalProfile');
    setCompletionPercentage(hasProfile ? 85 : 15);
  }, [navigate]);

  const copyAccessCode = () => {
    if (user?.accessCode) {
      navigator.clipboard.writeText(user.accessCode);
      toast.success('Access code copied to clipboard!');
    }
  };
  
  const downloadQRCode = () => {
    // In a real app, this would download the QR code
    toast.success('QR Code downloaded!');
  };
  
  const shareProfile = () => {
    // In a real app, this would open a share dialog
    toast.success('Share dialog opened!');
  };

  if (!user) {
    return (
      <PageLayout className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your medical information and access settings
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info & QR Code */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-safet-50 to-safet-100 border-b">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <User className="h-8 w-8 text-safet-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {user.firstName} {user.lastName}
                    </CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Profile Completion</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-safet-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {completionPercentage < 100 ? (
                        <>Your profile is {completionPercentage}% complete. Complete your medical information to get the most out of SafeT-iD.</>
                      ) : (
                        <>Your profile is complete! You can always update your information as needed.</>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-3">Your Access Code</p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex justify-between items-center">
                      <div className="font-mono text-xl font-semibold tracking-widest text-gray-900">
                        {user.accessCode}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={copyAccessCode}
                        className="hover:bg-gray-200"
                      >
                        <ClipboardCheck className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Share this code with healthcare providers to access your medical information
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200 shadow-sm text-center overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your SafeT-iD QR Code</CardTitle>
                <CardDescription>
                  Scan to access your medical information
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-2">
                {qrCodeUrl && (
                  <div className="border-8 border-white shadow-md rounded-xl bg-white overflow-hidden">
                    <img 
                      src={qrCodeUrl} 
                      alt="Your SafeT-iD QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center space-x-2 pt-2 pb-6">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={downloadQRCode}
                  className="flex items-center space-x-1"
                >
                  <span>Download</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={shareProfile}
                  className="flex items-center space-x-1"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  <span>Share</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right Column - Main Dashboard Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="w-full bg-white border-b border-gray-200 rounded-t-lg px-3 h-14">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-safet-50 data-[state=active]:text-safet-900 data-[state=active]:shadow-none rounded-md px-4"
                >
                  Medical Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="proxy" 
                  className="data-[state=active]:bg-safet-50 data-[state=active]:text-safet-900 data-[state=active]:shadow-none rounded-md px-4"
                >
                  Proxy Access
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="data-[state=active]:bg-safet-50 data-[state=active]:text-safet-900 data-[state=active]:shadow-none rounded-md px-4"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
              
              {/* Medical Profile Tab */}
              <TabsContent value="profile" className="mt-6 animate-fade-in">
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
              </TabsContent>
              
              {/* Proxy Access Tab */}
              <TabsContent value="proxy" className="mt-6 animate-fade-in">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Proxy Access</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Manage who can access your medical information
                      </p>
                    </div>
                    <Button className="bg-safet-500 hover:bg-safet-600">
                      Add Proxy
                    </Button>
                  </div>
                  
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-safet-50 mb-4">
                      <Users className="h-8 w-8 text-safet-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No proxy access granted yet
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-6">
                      Allow trusted individuals like family members or caregivers to access all or parts of your medical information.
                    </p>
                    <Button className="bg-safet-500 hover:bg-safet-600">
                      Add Your First Proxy
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-6 animate-fade-in">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <Settings className="h-5 w-5 text-safet-500 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Email Notifications</h3>
                      <p className="text-xs text-gray-600 mb-3">Manage when you receive emails from SafeT-iD</p>
                      <div className="flex items-center">
                        <Button size="sm" variant="outline" className="text-xs">
                          Manage Preferences
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pb-4 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Security Settings</h3>
                      <p className="text-xs text-gray-600 mb-3">Update your password and security preferences</p>
                      <div className="flex items-center">
                        <Button size="sm" variant="outline" className="text-xs">
                          Manage Security
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pb-4 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Access Code</h3>
                      <p className="text-xs text-gray-600 mb-3">Reset your 5-digit access code</p>
                      <div className="flex items-center">
                        <Button size="sm" variant="outline" className="text-xs">
                          Reset Code
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Delete Account</h3>
                      <p className="text-xs text-gray-600 mb-3">Permanently remove your account and all associated data</p>
                      <div className="flex items-center">
                        <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 text-xs">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
