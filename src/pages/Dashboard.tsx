import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { generateQRCodeUrl } from '@/utils/qrcode';
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import QRCodeCard from '@/components/dashboard/QRCodeCard';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { toast } from '@/lib/toast';
import { useAuth } from '@/contexts/AuthContext';
import { generateAccessCode } from '@/utils/accessCode';
import { loadAllSectionData } from '@/utils/medicalProfileService';

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
  const { user: firebaseUser } = useAuth();
  const [user, setUser] = useState<UserData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!firebaseUser) {
          toast.error('Please login to access the dashboard');
          navigate('/login');
          return;
        }
        
        // Get user data from Firebase user
        const { email, uid } = firebaseUser;
        const firstName = firebaseUser.displayName?.split(' ')[0] || '';
        const lastName = firebaseUser.displayName?.split(' ')[1] || '';
        
        // Generate or retrieve access code
        let accessCode = localStorage.getItem(`accessCode_${uid}`);
        if (!accessCode) {
          accessCode = generateAccessCode();
          localStorage.setItem(`accessCode_${uid}`, accessCode);
        }
        
        const userData: UserData = {
          id: uid,
          firstName,
          lastName,
          email: email || '',
          accessCode,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
        };
        
        setUser(userData);
        
        // Generate QR code URL
        const baseUrl = window.location.origin;
        const qrUrl = generateQRCodeUrl(`${baseUrl}/view/${uid}/${accessCode}`);
        setQrCodeUrl(qrUrl);
        
        // Load profile data and calculate completion
        setIsLoadingProfile(true);
        try {
          const profileData = await loadAllSectionData();
          const completion = calculateCompletionPercentage(profileData);
          setCompletionPercentage(completion);
        } catch (error) {
          console.error('Error loading profile data:', error);
        } finally {
          setIsLoadingProfile(false);
        }
        
      } catch (error) {
        console.error('Error in dashboard:', error);
        toast.error('Error loading dashboard');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [firebaseUser, navigate]);

  const calculateCompletionPercentage = (profileData: Record<string, any>): number => {
    const sections = ['personal', 'history', 'medications', 'allergies', 'immunizations', 'social', 'reproductive', 'mental', 'functional', 'cultural'];
    let completedSections = 0;
    
    sections.forEach(section => {
      if (profileData[section] && Object.keys(profileData[section]).length > 1) { // More than just lastUpdated
        completedSections++;
      }
    });
    
    return Math.round((completedSections / sections.length) * 100);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-safet-500"></div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your medical profile and access your secure information
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <UserProfileCard 
              user={user} 
              completionPercentage={completionPercentage}
              isLoadingProfile={isLoadingProfile}
            />
          </div>
          <div>
            <QRCodeCard 
              qrCodeUrl={qrCodeUrl} 
              accessCode={user.accessCode}
              userId={user.id}
            />
          </div>
        </div>
        
        <DashboardTabs />
      </div>
    </PageLayout>
  );
};

export default Dashboard;

