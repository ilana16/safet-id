
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProxyUser } from './ProxyAccessModal';
import { Calendar, Mail, User, Shield, Clock, Link, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProxyDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  proxy: ProxyUser | null;
}

const ProxyDetailDialog: React.FC<ProxyDetailDialogProps> = ({
  isOpen,
  onClose,
  proxy,
}) => {
  if (!proxy) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  const getAccessLevelColor = (level: string) => {
    switch(level) {
      case 'full': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'limited': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'emergency': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'expired': return 'bg-red-100 text-red-800 hover:bg-red-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  const getAccessLevelLabel = (level: string) => {
    switch(level) {
      case 'full': return 'Full Access';
      case 'limited': return 'Limited Access';
      case 'emergency': return 'Emergency Only';
      default: return 'Other';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'accepted': return 'Active';
      case 'pending': return 'Invitation Pending';
      case 'expired': return 'Invitation Expired';
      default: return status;
    }
  };
  
  const getAccessLevelDescription = (level: string) => {
    switch(level) {
      case 'full': 
        return 'Can view and manage all your medical information, including emergency contacts, prescriptions, and medical history.';
      case 'limited': 
        return 'Can view limited sections of your medical information, including allergies and current medications.';
      case 'emergency': 
        return 'Can only access critical information during emergency situations.';
      default: 
        return 'Custom access level';
    }
  };
  
  const getInviteLink = (token?: string) => {
    if (!token) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/proxy/register/${token}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Proxy Details</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="flex items-center">
            <div className="bg-safet-50 p-3 rounded-full mr-4">
              <User className="h-6 w-6 text-safet-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{proxy.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge className={getStatusColor(proxy.inviteStatus)}>
                  {getStatusLabel(proxy.inviteStatus)}
                </Badge>
                <Badge className={getAccessLevelColor(proxy.accessLevel)}>
                  {getAccessLevelLabel(proxy.accessLevel)}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Email</p>
                <p className="text-gray-600">{proxy.email}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Link className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Relationship</p>
                <p className="text-gray-600">{proxy.relationship}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Added On</p>
                <p className="text-gray-600">{formatDate(proxy.dateAdded)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Shield className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Access Level</p>
                <p className="text-gray-600">{getAccessLevelDescription(proxy.accessLevel)}</p>
              </div>
            </div>
            
            {proxy.inviteStatus === 'pending' && proxy.inviteToken && (
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Invitation Link</p>
                  <p className="text-gray-600 break-all text-xs mt-1">{getInviteLink(proxy.inviteToken)}</p>
                  <p className="text-amber-600 text-xs mt-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Invitation is pending acceptance
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProxyDetailDialog;
