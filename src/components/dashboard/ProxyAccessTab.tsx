import React, { useState, useEffect } from 'react';
import { Users, PlusCircle, Shield, Download, Search, ChevronUp, ChevronDown, Filter, Mail } from 'lucide-react';
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
  const [filterStatus, setFilterStatus] = useState<string>('all');
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

  // Load from localStorage on mount
  useEffect(() => {
    const savedProxies = localStorage.getItem('proxies');
    if (savedProxies) {
      try {
        setProxies(JSON.parse(savedProxies));
      } catch (error) {
        console.error("Error loading proxies from localStorage:", error);
      }
    }
  }, []);

  // Save to localStorage when proxies change
  useEffect(() => {
    if (proxies.length > 0) {
      localStorage.setItem('proxies', JSON.stringify(proxies));
    }
  }, [proxies]);

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
  
  const handleResendInvite = (id: string) => {
    const proxy = proxies.find(p => p.id === id);
    if (!proxy) return;
    
    // In a real app, this would send another email
    toast.success(`Invitation resent to ${proxy.name}`);
    
    // Update the proxy with a new invite token and reset expiry
    setProxies(prev => 
      prev.map(p => 
        p.id === id 
          ? { 
              ...p, 
              inviteToken: `invite_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
              // Keep it as pending since we're resending
              inviteStatus: 'pending' 
            } 
          : p
      )
    );
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
      Status: proxy.inviteStatus === 'pending'
        ? 'Invitation Pending'
        : proxy.inviteStatus === 'accepted'
          ? 'Active'
          : 'Expired',
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
        
      // Apply status filter
      const matchesStatus =
        filterStatus === 'all' ||
        proxy.inviteStatus === filterStatus;
        
      return matchesSearch && matchesAccessLevel && matchesStatus;
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

  const statusSummary = proxies.reduce((acc, proxy) => {
    acc[proxy.inviteStatus] = (acc[proxy.inviteStatus] || 0) + 1;
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
                {statusSummary.pending ? ` ${statusSummary.pending} with pending invitations.` : ''}
                {statusSummary.accepted ? ` ${statusSummary.accepted} with accepted invitations.` : ''}
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
            
            <div className="flex flex-wrap gap-3">
              <Select value={filterAccess} onValueChange={setFilterAccess}>
                <SelectTrigger className="w-36 sm:w-40" aria-label="Filter by access level">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" aria-hidden="true" />
                    <SelectValue placeholder="Access Level" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Access Levels</SelectItem>
                  <SelectItem value="full">Full Access</SelectItem>
                  <SelectItem value="limited">Limited Access</SelectItem>
                  <SelectItem value="emergency">Emergency Only</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 sm:w-36" aria-label="Filter by status">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="w-28 sm:w-32" aria-label="Sort by field">
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
                onResendInvite={handleResendInvite}
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
