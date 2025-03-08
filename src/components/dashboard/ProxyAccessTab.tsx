
import React, { useState } from 'react';
import { Users, PlusCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProxyAccessModal, { ProxyUser } from './ProxyAccessModal';
import ProxyCard from './ProxyCard';
import { toast } from '@/lib/toast';

const ProxyAccessTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proxies, setProxies] = useState<ProxyUser[]>([]);

  const handleAddProxy = (proxy: ProxyUser) => {
    setProxies(prev => [...prev, proxy]);
  };

  const handleRemoveProxy = (id: string) => {
    setProxies(prev => prev.filter(proxy => proxy.id !== id));
    toast.success('Proxy access revoked successfully');
  };

  const handleUpdateAccess = (id: string, level: 'full' | 'limited' | 'emergency') => {
    setProxies(prev => 
      prev.map(proxy => 
        proxy.id === id ? { ...proxy, accessLevel: level } : proxy
      )
    );
    toast.success('Proxy access level updated');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Proxy Access</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage who can access your medical information
          </p>
        </div>
        <Button 
          className="bg-safet-500 hover:bg-safet-600 flex items-center" 
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Proxy
        </Button>
      </div>
      
      {proxies.length === 0 ? (
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
          <Button 
            className="bg-safet-500 hover:bg-safet-600 flex items-center" 
            onClick={() => setIsModalOpen(true)}
          >
            <Shield className="mr-2 h-4 w-4" />
            Add Your First Proxy
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {proxies.map(proxy => (
            <ProxyCard 
              key={proxy.id} 
              proxy={proxy} 
              onRemove={handleRemoveProxy}
              onUpdateAccess={handleUpdateAccess}
            />
          ))}
        </div>
      )}

      <ProxyAccessModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProxy={handleAddProxy}
      />
    </div>
  );
};

export default ProxyAccessTab;
