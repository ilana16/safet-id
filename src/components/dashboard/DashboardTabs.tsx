
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalProfileTab from './MedicalProfileTab';
import ProxyAccessTab from './ProxyAccessTab';
import SettingsTab from './SettingsTab';
import { User } from 'lucide-react';
import UserProfileCard from './UserProfileCard';

interface DashboardTabsProps {
  completionPercentage: number;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ completionPercentage }) => {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white border-b border-gray-200 rounded-t-lg p-3 h-auto">
        <TabsTrigger 
          value="personal" 
          className="data-[state=active]:bg-safet-50 data-[state=active]:text-safet-900 data-[state=active]:shadow-none rounded-md px-4 flex items-center justify-center"
        >
          <User className="h-4 w-4 mr-2" />
          Personal Info
        </TabsTrigger>
        <TabsTrigger 
          value="profile" 
          className="data-[state=active]:bg-safet-50 data-[state=active]:text-safet-900 data-[state=active]:shadow-none rounded-md px-4 flex items-center justify-center"
        >
          Medical Profile
        </TabsTrigger>
        <TabsTrigger 
          value="proxy" 
          className="data-[state=active]:bg-safet-50 data-[state=active]:text-safet-900 data-[state=active]:shadow-none rounded-md px-4 flex items-center justify-center"
        >
          Proxy Access
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className="data-[state=active]:bg-safet-50 data-[state=active]:text-safet-900 data-[state=active]:shadow-none rounded-md px-4 flex items-center justify-center"
        >
          Settings
        </TabsTrigger>
      </TabsList>
      
      {/* Personal Information Tab */}
      <TabsContent value="personal" className="mt-6 animate-fade-in">
        <UserProfileCard user={JSON.parse(localStorage.getItem('user') || '{}')} completionPercentage={completionPercentage} />
      </TabsContent>
      
      {/* Medical Profile Tab */}
      <TabsContent value="profile" className="mt-6 animate-fade-in">
        <MedicalProfileTab completionPercentage={completionPercentage} />
      </TabsContent>
      
      {/* Proxy Access Tab */}
      <TabsContent value="proxy" className="mt-6 animate-fade-in">
        <ProxyAccessTab />
      </TabsContent>
      
      {/* Settings Tab */}
      <TabsContent value="settings" className="mt-6 animate-fade-in">
        <SettingsTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
