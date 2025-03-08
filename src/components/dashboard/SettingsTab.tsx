
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SettingsTab: React.FC = () => {
  return (
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
  );
};

export default SettingsTab;
