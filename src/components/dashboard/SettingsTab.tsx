
import React, { useState } from 'react';
import { Settings, Shield, Mail, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

const SettingsTab: React.FC = () => {
  // Email notification preferences
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [emailPreferences, setEmailPreferences] = useState({
    updates: true,
    securityAlerts: true,
    medicalReminders: false,
    marketingEmails: false
  });

  // Security settings
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Delete account
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Forms
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleSaveEmailPreferences = () => {
    toast.success('Email preferences updated successfully');
    setNotificationDialogOpen(false);
  };

  const handleSaveSecuritySettings = () => {
    if (passwordForm.getValues('newPassword') !== passwordForm.getValues('confirmPassword')) {
      toast.error('New passwords do not match');
      return;
    }
    
    toast.success('Security settings updated successfully');
    setSecurityDialogOpen(false);
    passwordForm.reset();
  };

  const handleAccountDeletion = () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion');
      return;
    }
    
    toast.success('Account deleted successfully');
    setDeleteDialogOpen(false);
    setDeleteConfirmText('');
    
    // In a real app, this would redirect to the home page after deletion
    // or perform additional cleanup
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <Settings className="h-5 w-5 text-safet-500 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
      </div>
      
      <div className="space-y-6">
        {/* Email Notifications */}
        <div className="pb-4 border-b border-gray-100">
          <div className="flex items-center mb-2">
            <Mail className="h-4 w-4 text-safet-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">Manage when you receive emails from SafeT-iD</p>
          <div className="flex items-center">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => setNotificationDialogOpen(true)}
            >
              Manage Preferences
            </Button>
          </div>
        </div>
        
        {/* Security Settings */}
        <div className="pb-4 border-b border-gray-100">
          <div className="flex items-center mb-2">
            <Shield className="h-4 w-4 text-safet-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Security Settings</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">Update your password and security preferences</p>
          <div className="flex items-center">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs"
              onClick={() => setSecurityDialogOpen(true)}
            >
              Manage Security
            </Button>
          </div>
        </div>
        
        {/* Delete Account */}
        <div>
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
          </div>
          <p className="text-xs text-gray-600 mb-3">Permanently remove your account and all associated data</p>
          <div className="flex items-center">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-red-500 border-red-200 hover:bg-red-50 text-xs"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Email Preferences Dialog */}
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Email Notification Preferences</DialogTitle>
            <DialogDescription>
              Choose which emails you'd like to receive from SafeT-iD
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Account Updates</FormLabel>
                <FormDescription>Important information about your account</FormDescription>
              </div>
              <Switch 
                checked={emailPreferences.updates} 
                onCheckedChange={(checked) => setEmailPreferences({...emailPreferences, updates: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Security Alerts</FormLabel>
                <FormDescription>Notifications about your account security</FormDescription>
              </div>
              <Switch 
                checked={emailPreferences.securityAlerts} 
                onCheckedChange={(checked) => setEmailPreferences({...emailPreferences, securityAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Medical Reminders</FormLabel>
                <FormDescription>Reminders to update your medical information</FormDescription>
              </div>
              <Switch 
                checked={emailPreferences.medicalReminders} 
                onCheckedChange={(checked) => setEmailPreferences({...emailPreferences, medicalReminders: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Marketing Emails</FormLabel>
                <FormDescription>Updates about new features and offerings</FormDescription>
              </div>
              <Switch 
                checked={emailPreferences.marketingEmails} 
                onCheckedChange={(checked) => setEmailPreferences({...emailPreferences, marketingEmails: checked})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotificationDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEmailPreferences}>Save Preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security Settings Dialog */}
      <Dialog open={securityDialogOpen} onOpenChange={setSecurityDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Security Settings</DialogTitle>
            <DialogDescription>
              Update your password and security preferences
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Two-Factor Authentication</FormLabel>
                <FormDescription>Add an extra layer of security to your account</FormDescription>
              </div>
              <Switch 
                checked={twoFactorEnabled} 
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
            
            <div className="space-y-4 mt-6">
              <h3 className="text-sm font-medium">Change Password</h3>
              
              <div className="space-y-2">
                <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
                <Input 
                  id="currentPassword"
                  type="password" 
                  placeholder="Enter your current password" 
                  {...passwordForm.register('currentPassword')}
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel htmlFor="newPassword">New Password</FormLabel>
                <Input 
                  id="newPassword"
                  type="password" 
                  placeholder="Enter new password" 
                  {...passwordForm.register('newPassword')}
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                <Input 
                  id="confirmPassword"
                  type="password" 
                  placeholder="Confirm new password" 
                  {...passwordForm.register('confirmPassword')}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSecurityDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSecuritySettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">Delete Account</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-gray-700 font-medium mb-2">
              Type DELETE to confirm:
            </p>
            <Input 
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="border-red-200 focus-visible:ring-red-500"
              placeholder="Type DELETE to confirm"
            />
            
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-xs text-red-600">
                Warning: Deleting your account will remove all your medical information, proxy accesses, and personal data. This action is irreversible.
              </p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={handleAccountDeletion}
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsTab;
