import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/lib/toast';
import ProxyInviteEmail from './ProxyInviteEmail';
import { Mail } from 'lucide-react';

interface ProxyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProxy: (proxy: ProxyUser) => void;
}

export interface ProxyUser {
  id: string;
  name: string;
  email: string;
  relationship: string;
  accessLevel: 'full_edit' | 'view_comment' | 'view_only';
  dateAdded: string;
  inviteStatus: 'pending' | 'accepted' | 'expired';
  inviteToken?: string;
}

const ProxyAccessModal: React.FC<ProxyAccessModalProps> = ({ isOpen, onClose, onAddProxy }) => {
  const [proxyData, setProxyData] = useState<Omit<ProxyUser, 'id' | 'dateAdded' | 'inviteStatus' | 'inviteToken'>>({
    name: '',
    email: '',
    relationship: '',
    accessLevel: 'view_only',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProxyData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setProxyData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!proxyData.name.trim()) newErrors.name = 'Name is required';
    
    if (!proxyData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(proxyData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!proxyData.relationship.trim()) newErrors.relationship = 'Relationship is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateInviteToken = () => {
    return `invite_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  };

  const handleSendInvite = () => {
    if (!validate()) return;
    
    setIsSending(true);
    
    setTimeout(() => {
      const inviteToken = generateInviteToken();
      const newProxy: ProxyUser = {
        ...proxyData,
        id: `proxy_${Date.now()}`,
        dateAdded: new Date().toISOString(),
        inviteStatus: 'pending',
        inviteToken,
      };
      
      onAddProxy(newProxy);
      toast.success('Invitation sent successfully!');
      
      setProxyData({
        name: '',
        email: '',
        relationship: '',
        accessLevel: 'view_only',
      });
      setIsPreviewOpen(false);
      setIsSending(false);
      onClose();
    }, 1500);
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    setIsPreviewOpen(true);
  };

  const handleBackFromPreview = () => {
    setIsPreviewOpen(false);
  };

  const getCurrentUser = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return { firstName: 'Your', lastName: 'Name' };
    
    const user = JSON.parse(userData);
    return {
      firstName: user.firstName || 'Your',
      lastName: user.lastName || 'Name'
    };
  };

  const getInviteLink = () => {
    const inviteToken = generateInviteToken();
    const baseUrl = window.location.origin;
    return `${baseUrl}/proxy/register/${inviteToken}`;
  };

  return (
    <>
      <Dialog open={isOpen && !isPreviewOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Proxy Access</DialogTitle>
            <DialogDescription>
              Grant someone access to your medical information
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePreview} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                name="name"
                value={proxyData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.name ? 'border-red-300' : ''}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={proxyData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={errors.email ? 'border-red-300' : ''}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input 
                id="relationship"
                name="relationship"
                value={proxyData.relationship}
                onChange={handleChange}
                placeholder="Family Member, Doctor, Caregiver"
                className={errors.relationship ? 'border-red-300' : ''}
              />
              {errors.relationship && <p className="text-xs text-red-500">{errors.relationship}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <Select 
                value={proxyData.accessLevel} 
                onValueChange={(value) => handleSelectChange('accessLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_edit">Full Editing Access</SelectItem>
                  <SelectItem value="view_comment">View and Comment Only</SelectItem>
                  <SelectItem value="view_only">View Only</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {proxyData.accessLevel === 'full_edit' 
                  ? 'Can view, comment, and edit all your medical information'
                  : proxyData.accessLevel === 'view_comment'
                    ? 'Can view and add comments, but cannot edit your medical information'
                    : 'Can only view your medical information, no editing or comments'}
              </p>
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" className="bg-safet-500 hover:bg-safet-600">
                Preview Invite
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preview Invitation Email</DialogTitle>
            <DialogDescription>
              Review the invitation before sending
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-md p-4 bg-gray-50 my-4">
            <ProxyInviteEmail 
              recipientName={proxyData.name}
              recipientEmail={proxyData.email}
              senderName={`${getCurrentUser().firstName} ${getCurrentUser().lastName}`}
              accessLevel={proxyData.accessLevel}
              inviteLink={getInviteLink()}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleBackFromPreview}>
              Back
            </Button>
            <Button 
              onClick={handleSendInvite} 
              className="bg-safet-500 hover:bg-safet-600"
              disabled={isSending}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProxyAccessModal;
