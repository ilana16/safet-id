
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicalProfileTab from './MedicalProfileTab';
import ProxyAccessTab from './ProxyAccessTab';
import SettingsTab from './SettingsTab';

interface DashboardTabsProps {
  completionPercentage: number;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ completionPercentage }) => {
  return (
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
