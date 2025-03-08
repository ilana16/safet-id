
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProxyAccessTab: React.FC = () => {
  return (
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
  );
};

export default ProxyAccessTab;
