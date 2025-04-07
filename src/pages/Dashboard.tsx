
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { generateQRCodeUrl } from '@/utils/qrcode';
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import QRCodeCard from '@/components/dashboard/QRCodeCard';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { toast } from '@/lib/toast';
import { supabase } from '@/integrations/supabase/client';
import { generateAccessCode } from '@/utils/accessCode';

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
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.error('Please login to access the dashboard');
          navigate('/login');
          return;
        }
        
        // Get user metadata and email
        const { email, id } = session.user;
        const firstName = session.user.user_metadata.firstName || '';
        const lastName = session.user.user_metadata.lastName || '';
        
        // Generate or retrieve access code
        let accessCode = localStorage.getItem(`accessCode_${id}`);
        if (!accessCode) {
          // Use the utility function to generate code
          accessCode = generateAccessCode();
          localStorage.setItem(`accessCode_${id}`, accessCode);
        }
        
        const userData: UserData = {
          id,
          firstName,
          lastName,
          email: email || '',
          accessCode,
          createdAt: session.user.created_at || new Date().toISOString(),
        };
        
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
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error loading user information');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoading) {
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

  if (!user) {
    return (
      <PageLayout className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-400">User not found</div>
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
            <UserProfileCard user={user} completionPercentage={completionPercentage} />
            <QRCodeCard userId={user.id} accessCode={user.accessCode} />
          </div>
          
          {/* Right Column - Main Dashboard Content */}
          <div className="lg:col-span-2">
            <DashboardTabs completionPercentage={completionPercentage} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
