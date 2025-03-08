
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, UserCheck, Mail, Calendar, Info } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ProxyUser } from './ProxyAccessModal';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ProxyCardProps {
  proxy: ProxyUser;
  onRemove: (id: string) => void;
  onUpdateAccess: (id: string, level: 'full' | 'limited' | 'emergency') => void;
  onViewDetails: (proxy: ProxyUser) => void;
}

const ProxyCard: React.FC<ProxyCardProps> = ({ 
  proxy, 
  onRemove, 
  onUpdateAccess,
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
      case 'full': return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'limited': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'emergency': return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };
  
  const getAccessLevelLabel = (level: string) => {
    switch(level) {
      case 'full': return 'Full Access';
      case 'limited': return 'Limited Access';
      case 'emergency': return 'Emergency Only';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="bg-safet-50 p-2 rounded-full">
              <UserCheck className="h-6 w-6 text-safet-500" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{proxy.name}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Mail className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                <span>{proxy.email}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Calendar className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                <span>Added {formatDate(proxy.dateAdded)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Relationship: {proxy.relationship}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-3">
            <Badge className={`${getAccessLevelColor(proxy.accessLevel)}`} aria-label={`Access level: ${getAccessLevelLabel(proxy.accessLevel)}`}>
              {getAccessLevelLabel(proxy.accessLevel)}
            </Badge>
            
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => onViewDetails(proxy)}
                      aria-label="View proxy details"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <DropdownMenu>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-full"
                          aria-label="Open options menu"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Options</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => onUpdateAccess(proxy.id, 'full')}
                    className={proxy.accessLevel === 'full' ? 'bg-gray-100' : ''}
                  >
                    Set Full Access
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onUpdateAccess(proxy.id, 'limited')}
                    className={proxy.accessLevel === 'limited' ? 'bg-gray-100' : ''}
                  >
                    Set Limited Access
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onUpdateAccess(proxy.id, 'emergency')}
                    className={proxy.accessLevel === 'emergency' ? 'bg-gray-100' : ''}
                  >
                    Set Emergency Only
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onRemove(proxy.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove Access
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProxyCard;
