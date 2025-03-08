
import React from 'react';
import { Trash2, MoreVertical, Shield, Eye, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProxyUser } from './ProxyAccessModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface ProxyCardProps {
  proxy: ProxyUser;
  onRemove: (id: string) => void;
  onUpdateAccess: (id: string, level: 'full' | 'limited' | 'emergency') => void;
  onResendInvite?: (id: string) => void;
  onViewDetails: (proxy: ProxyUser) => void;
}

const ProxyCard: React.FC<ProxyCardProps> = ({ 
  proxy, 
  onRemove, 
  onUpdateAccess, 
  onResendInvite,
  onViewDetails 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getAccessLevelColor = (level: string) => {
    switch(level) {
      case 'full': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-blue-100 text-blue-800';
      case 'emergency': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 p-4">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{proxy.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{proxy.email}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(proxy.inviteStatus)}>
                  {getStatusLabel(proxy.inviteStatus)}
                </Badge>
                <Badge className={getAccessLevelColor(proxy.accessLevel)}>
                  {proxy.accessLevel === 'full' 
                    ? 'Full Access' 
                    : proxy.accessLevel === 'limited' 
                      ? 'Limited Access' 
                      : proxy.accessLevel === 'emergency'
                        ? 'Emergency Only'
                        : 'Other'}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-600">
              <div>
                <span className="font-medium">Relationship:</span> {proxy.relationship}
              </div>
              <div>
                <span className="font-medium">Added:</span> {formatDate(proxy.dateAdded)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 justify-end sm:justify-start">
            {proxy.inviteStatus === 'pending' && onResendInvite && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onResendInvite(proxy.id)}
                className="text-safet-500 border-safet-200"
              >
                <Mail className="h-4 w-4 mr-1" />
                Resend
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(proxy)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Details
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => onViewDetails(proxy)}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>View Details</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  disabled={proxy.accessLevel === 'full'}
                  onClick={() => onUpdateAccess(proxy.id, 'full')}
                >
                  <Shield className="mr-2 h-4 w-4 text-green-600" />
                  <span>Set Full Access</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  disabled={proxy.accessLevel === 'limited'}
                  onClick={() => onUpdateAccess(proxy.id, 'limited')}
                >
                  <Shield className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Set Limited Access</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  disabled={proxy.accessLevel === 'emergency'}
                  onClick={() => onUpdateAccess(proxy.id, 'emergency')}
                >
                  <Shield className="mr-2 h-4 w-4 text-amber-600" />
                  <span>Set Emergency Only</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {proxy.inviteStatus === 'pending' && onResendInvite && (
                  <DropdownMenuItem onClick={() => onResendInvite(proxy.id)}>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Resend Invitation</span>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600" 
                  onClick={() => onRemove(proxy.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Remove Access</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProxyCard;
