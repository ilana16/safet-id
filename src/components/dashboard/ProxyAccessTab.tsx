
import React, { useState, useEffect } from 'react';
import { Users, PlusCircle, Shield, Download, Search, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import ProxyAccessModal, { ProxyUser } from './ProxyAccessModal';
import ProxyCard from './ProxyCard';
import ProxyDetailDialog from './ProxyDetailDialog';
import ConfirmationDialog from './ConfirmationDialog';
import { toast } from '@/lib/toast';
import { exportToCSV } from '@/utils/export';

const ProxyAccessTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proxies, setProxies] = useState<ProxyUser[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAccess, setFilterAccess] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('dateAdded');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    proxyId: '',
    title: '',
    description: ''
  });
  
  // Detail dialog state
  const [detailDialog, setDetailDialog] = useState({
    isOpen: false,
    proxy: null as ProxyUser | null
  });

  const handleAddProxy = (proxy: ProxyUser) => {
    setProxies(prev => [...prev, proxy]);
  };

  const handleInitiateRemove = (id: string) => {
    const proxy = proxies.find(p => p.id === id);
    if (!proxy) return;
    
    setConfirmDialog({
      isOpen: true,
      proxyId: id,
      title: `Remove access for ${proxy.name}?`,
      description: `${proxy.name} will no longer have access to your medical information. This action cannot be undone.`
    });
  };

  const handleConfirmRemove = () => {
    const id = confirmDialog.proxyId;
    setProxies(prev => prev.filter(proxy => proxy.id !== id));
    toast.success('Proxy access revoked successfully');
    setConfirmDialog(prev => ({ ...prev, isOpen: false, proxyId: '' }));
  };

  const handleUpdateAccess = (id: string, level: 'full' | 'limited' | 'emergency') => {
    setProxies(prev => 
      prev.map(proxy => 
        proxy.id === id ? { ...proxy, accessLevel: level } : proxy
      )
    );
    toast.success('Proxy access level updated');
  };
  
  const handleViewDetails = (proxy: ProxyUser) => {
    setDetailDialog({
      isOpen: true,
      proxy
    });
  };
  
  const handleExport = () => {
    if (proxies.length === 0) {
      toast.error('No proxy data to export');
      return;
    }
    
    // Prepare data for export - transform data for better CSV formatting
    const dataToExport = proxies.map(proxy => ({
      Name: proxy.name,
      Email: proxy.email,
      Relationship: proxy.relationship,
      AccessLevel: proxy.accessLevel === 'full' 
        ? 'Full Access' 
        : proxy.accessLevel === 'limited' 
          ? 'Limited Access' 
          : 'Emergency Only',
      dateAdded: proxy.dateAdded, // This will be formatted by the export function
    }));
    
    exportToCSV(dataToExport, 'proxy-access-list');
    toast.success('Proxy data exported successfully');
  };
  
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
  // Filter and sort proxies
  const filteredAndSortedProxies = proxies
    .filter(proxy => {
      // Apply search filter
      const matchesSearch = 
        proxy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proxy.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proxy.relationship.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply access level filter
      const matchesAccessLevel = 
        filterAccess === 'all' || 
        proxy.accessLevel === filterAccess;
        
      return matchesSearch && matchesAccessLevel;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      
      if (sortField === 'dateAdded') {
        return sortDirection === 'asc'
          ? new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
          : new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      
      // Default sort
      return 0;
    });

  // Calculate summary information for screen readers
  const accessSummary = proxies.reduce((acc, proxy) => {
    acc[proxy.accessLevel] = (acc[proxy.accessLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Proxy Access</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage who can access your medical information
          </p>
          
          {/* Screen reader summary */}
          <div className="sr-only" aria-live="polite">
            {proxies.length === 0 ? (
              'No proxy access has been granted yet.'
            ) : (
              <>
                You have {proxies.length} {proxies.length === 1 ? 'person' : 'people'} with proxy access.
                {accessSummary.full ? ` ${accessSummary.full} with full access.` : ''}
                {accessSummary.limited ? ` ${accessSummary.limited} with limited access.` : ''}
                {accessSummary.emergency ? ` ${accessSummary.emergency} with emergency only access.` : ''}
              </>
            )}
          </div>
        </div>
        <Button 
          className="bg-safet-500 hover:bg-safet-600 flex items-center" 
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
          Add Proxy
        </Button>
      </div>
      
      {proxies.length === 0 ? (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-safet-50 mb-4">
            <Users className="h-8 w-8 text-safet-500" aria-hidden="true" />
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
            <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
            Add Your First Proxy
          </Button>
        </div>
      ) : (
        <div>
          {/* Filters and Controls */}
          <div className="mb-4 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input 
                placeholder="Search by name, email, or relationship..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
                aria-label="Search proxies"
              />
            </div>
            
            <div className="flex space-x-3">
              <Select value={filterAccess} onValueChange={setFilterAccess}>
                <SelectTrigger className="w-[180px]" aria-label="Filter by access level">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
                    <SelectValue placeholder="Filter Access" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Access Levels</SelectItem>
                  <SelectItem value="full">Full Access</SelectItem>
                  <SelectItem value="limited">Limited Access</SelectItem>
                  <SelectItem value="emergency">Emergency Only</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-[150px]" aria-label="Sort by field">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="dateAdded">Date Added</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleSortDirection}
                aria-label={sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
              >
                {sortDirection === 'asc' ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleExport}
                aria-label="Export proxy list to CSV"
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                Export
              </Button>
            </div>
          </div>
          
          {/* Results summary for screen readers */}
          <div className="sr-only" aria-live="polite">
            Showing {filteredAndSortedProxies.length} of {proxies.length} proxies
          </div>
          
          {/* Empty state for filtered results */}
          {filteredAndSortedProxies.length === 0 && (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No proxies match your search criteria</p>
            </div>
          )}
          
          {/* Proxy list */}
          <div className="space-y-4">
            {filteredAndSortedProxies.map(proxy => (
              <ProxyCard 
                key={proxy.id} 
                proxy={proxy} 
                onRemove={handleInitiateRemove}
                onUpdateAccess={handleUpdateAccess}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals and Dialogs */}
      <ProxyAccessModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProxy={handleAddProxy}
      />
      
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmRemove}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel="Remove Access"
        destructive={true}
      />
      
      <ProxyDetailDialog
        isOpen={detailDialog.isOpen}
        onClose={() => setDetailDialog(prev => ({ ...prev, isOpen: false }))}
        proxy={detailDialog.proxy}
      />
    </div>
  );
};

export default ProxyAccessTab;
