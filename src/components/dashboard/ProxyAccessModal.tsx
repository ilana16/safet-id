
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/lib/toast';

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
  accessLevel: 'full' | 'limited' | 'emergency' | 'other';
  dateAdded: string;
}

const ProxyAccessModal: React.FC<ProxyAccessModalProps> = ({ isOpen, onClose, onAddProxy }) => {
  const [proxyData, setProxyData] = useState<Omit<ProxyUser, 'id' | 'dateAdded'>>({
    name: '',
    email: '',
    relationship: '',
    accessLevel: 'limited',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProxyData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setProxyData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    // Create new proxy user
    const newProxy: ProxyUser = {
      ...proxyData,
      id: `proxy_${Date.now()}`,
      dateAdded: new Date().toISOString(),
    };
    
    onAddProxy(newProxy);
    toast.success('Proxy access granted successfully!');
    
    // Reset form and close modal
    setProxyData({
      name: '',
      email: '',
      relationship: '',
      accessLevel: 'limited',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Proxy Access</DialogTitle>
          <DialogDescription>
            Grant someone access to your medical information
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
                <SelectItem value="full">Full Access</SelectItem>
                <SelectItem value="limited">Limited Access</SelectItem>
                <SelectItem value="emergency">Emergency Only</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {proxyData.accessLevel === 'full' 
                ? 'Can view and manage all your medical information'
                : proxyData.accessLevel === 'limited'
                  ? 'Can view only specific sections of your medical information'
                  : proxyData.accessLevel === 'emergency'
                    ? 'Can only access information during emergencies'
                    : 'Custom access level'}
            </p>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-safet-500 hover:bg-safet-600">Add Proxy</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProxyAccessModal;
