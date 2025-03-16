
import React, { useState, useEffect } from 'react';
import { Settings, Shield, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
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
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form validation schemas
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const SettingsTab: React.FC = () => {
  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('emailPreferences');
    if (savedPreferences) {
      setEmailPreferences(JSON.parse(savedPreferences));
    }
    
    const savedSecurity = localStorage.getItem('securitySettings');
    if (savedSecurity) {
      const { twoFactor } = JSON.parse(savedSecurity);
      setTwoFactorEnabled(twoFactor);
    }
  }, []);

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
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Delete account
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const handleSaveEmailPreferences = () => {
    // Save to localStorage
    localStorage.setItem('emailPreferences', JSON.stringify(emailPreferences));
    
    toast.success('Email preferences updated successfully', {
      description: 'Your notification settings have been saved.'
    });
    setNotificationDialogOpen(false);
  };

  const handleSaveSecuritySettings = async () => {
    const formValid = await passwordForm.trigger();
    
    if (!formValid) {
      return; // Form validation failed
    }
    
    const { newPassword, confirmPassword } = passwordForm.getValues();
    
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    // Save 2FA setting to localStorage
    localStorage.setItem('securitySettings', JSON.stringify({ 
      twoFactor: twoFactorEnabled 
    }));
    
    // If password fields are filled, handle password change
    if (newPassword) {
      // In a real app, this would call an API to update the password
      setPasswordChangeSuccess(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setPasswordChangeSuccess(false);
        setSecurityDialogOpen(false);
        passwordForm.reset();
      }, 3000);
    } else {
      toast.success('Security settings updated successfully');
      setSecurityDialogOpen(false);
    }
  };

  const handleAccountDeletion = () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion');
      return;
    }
    
    // In a real app, this would call an API to delete the account
    toast.success('Account deleted successfully', {
      description: 'Your account and all associated data have been permanently removed.'
    });
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
            
            <Form {...passwordForm}>
              <form className="space-y-4 mt-6">
                <h3 className="text-sm font-medium">Change Password</h3>
                
                {passwordChangeSuccess ? (
                  <div className="p-3 bg-green-50 border border-green-100 rounded-md flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="text-sm text-green-600">Password updated successfully!</p>
                  </div>
                ) : (
                  <>
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter your current password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter new password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            At least 8 characters with uppercase, lowercase, number and special character
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirm new password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </form>
            </Form>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSecurityDialogOpen(false);
              passwordForm.reset();
            }}>
              Cancel
            </Button>
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
            <AlertDialogCancel 
              onClick={() => {
                setDeleteConfirmText('');
              }}
            >
              Cancel
            </AlertDialogCancel>
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
