
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    try {
      const savedPreferences = localStorage.getItem('emailPreferences');
      if (savedPreferences) {
        setEmailPreferences(JSON.parse(savedPreferences));
      }
      
      const savedSecurity = localStorage.getItem('securitySettings');
      if (savedSecurity) {
        const { twoFactor } = JSON.parse(savedSecurity);
        setTwoFactorEnabled(twoFactor);
      }
    } catch (error) {
      console.error("Error loading settings from localStorage:", error);
      toast.error("Failed to load settings");
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
  const [isDeleting, setIsDeleting] = useState(false);

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
    try {
      // Save to localStorage
      localStorage.setItem('emailPreferences', JSON.stringify(emailPreferences));
      
      toast.success('Email preferences updated successfully', {
        description: 'Your notification settings have been saved.'
      });
      setNotificationDialogOpen(false);
    } catch (error) {
      console.error("Error saving email preferences:", error);
      toast.error("Failed to save email preferences");
    }
  };

  const handleSaveSecuritySettings = async () => {
    try {
      // If updating password
      if (passwordForm.getValues().currentPassword || 
          passwordForm.getValues().newPassword || 
          passwordForm.getValues().confirmPassword) {
        
        const formValid = await passwordForm.trigger();
        
        if (!formValid) {
          return; // Form validation failed
        }
        
        const { newPassword, confirmPassword } = passwordForm.getValues();
        
        if (newPassword && newPassword !== confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }
        
        // In a real app, this would call an API to update the password
        // For this demo, we'll just simulate a success
        setPasswordChangeSuccess(true);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setPasswordChangeSuccess(false);
          setSecurityDialogOpen(false);
          passwordForm.reset();
        }, 3000);
      } else {
        // Just saving 2FA setting
        // Save 2FA setting to localStorage
        localStorage.setItem('securitySettings', JSON.stringify({ 
          twoFactor: twoFactorEnabled 
        }));
        
        toast.success('Security settings updated successfully');
        setSecurityDialogOpen(false);
      }
    } catch (error) {
      console.error("Error saving security settings:", error);
      toast.error("Failed to save security settings");
    }
  };

  const handleAccountDeletion = () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion');
      return;
    }
    
    setIsDeleting(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      try {
        // In a real app, this would call an API to delete the account
        
        // Clear all user data from localStorage
        localStorage.clear();
        
        toast.success('Account deleted successfully', {
          description: 'Your account and all associated data have been permanently removed.'
        });
        
        setDeleteDialogOpen(false);
        setDeleteConfirmText('');
        setIsDeleting(false);
        
        // In a real app, this would redirect to the home page after deletion
        // window.location.href = '/';
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Failed to delete account");
        setIsDeleting(false);
      }
    }, 1500);
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
      <Dialog open={securityDialogOpen} onOpenChange={(open) => {
        if (!open) {
          passwordForm.reset();
          setPasswordChangeSuccess(false);
        }
        setSecurityDialogOpen(open);
      }}>
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
              <form className="space-y-4 mt-6" onSubmit={(e) => {
                e.preventDefault();
                handleSaveSecuritySettings();
              }}>
                <h3 className="text-sm font-medium">Change Password</h3>
                
                {passwordChangeSuccess ? (
                  <Alert variant="default" className="bg-green-50 border-green-100">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-700">Success</AlertTitle>
                    <AlertDescription className="text-green-600">
                      Password updated successfully!
                    </AlertDescription>
                  </Alert>
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setDeleteConfirmText('');
        }
        setDeleteDialogOpen(open);
      }}>
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
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={handleAccountDeletion}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsTab;
