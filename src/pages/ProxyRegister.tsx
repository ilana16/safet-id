
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/lib/toast';
import { Mail, Lock, User, Shield, AlertTriangle } from 'lucide-react';
import { ProxyUser } from '@/components/dashboard/ProxyAccessModal';

const ProxyRegister = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [inviteData, setInviteData] = useState<{
    valid: boolean;
    proxy?: ProxyUser;
    hostName?: string;
    accessLevel?: string;
  }>({ valid: false });

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate the invitation token
  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      return;
    }

    // Simulate token validation (in a real app, this would be an API call)
    setTimeout(() => {
      // Fetch all proxies from localStorage
      const savedProxies = localStorage.getItem('proxies');
      let proxies: ProxyUser[] = [];
      
      if (savedProxies) {
        try {
          proxies = JSON.parse(savedProxies);
        } catch (error) {
          console.error("Error loading proxies:", error);
        }
      }
      
      // Find the proxy with the matching token
      const proxy = proxies.find(p => p.inviteToken === token);
      
      if (proxy && proxy.inviteStatus === 'pending') {
        // Get host user info
        const userData = localStorage.getItem('user');
        let hostName = 'Account Owner';
        
        if (userData) {
          try {
            const user = JSON.parse(userData);
            hostName = `${user.firstName} ${user.lastName}`;
          } catch (error) {
            console.error("Error loading user data:", error);
          }
        }
        
        setInviteData({
          valid: true,
          proxy,
          hostName,
          accessLevel: proxy.accessLevel
        });
      } else {
        setInviteData({ valid: false });
      }
      
      setIsValidating(false);
    }, 1000);
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and privacy policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate() || !inviteData.valid || !inviteData.proxy) return;
    
    setIsLoading(true);
    
    // In a real app, this would be an API call to register the proxy user
    setTimeout(() => {
      // Update the proxy status in localStorage
      const savedProxies = localStorage.getItem('proxies');
      if (savedProxies) {
        try {
          const proxies: ProxyUser[] = JSON.parse(savedProxies);
          const updatedProxies = proxies.map(p => 
            p.id === inviteData.proxy?.id
              ? { ...p, inviteStatus: 'accepted' }
              : p
          );
          
          localStorage.setItem('proxies', JSON.stringify(updatedProxies));
        } catch (error) {
          console.error("Error updating proxies:", error);
        }
      }
      
      // Create proxy user account - in a real app, this would be in a separate DB
      // For demo, we'll just use localStorage to show the concept
      const proxyAccount = {
        id: `proxy_user_${Date.now()}`,
        name: inviteData.proxy?.name,
        email: inviteData.proxy?.email,
        hostId: 'user_id_from_localStorage', // In a real app, this would be the actual user ID
        accessLevel: inviteData.proxy?.accessLevel,
        relationship: inviteData.proxy?.relationship,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('proxyAccount', JSON.stringify(proxyAccount));
      
      setIsLoading(false);
      toast.success('Proxy account created successfully!');
      navigate('/proxy/dashboard');
    }, 1500);
  };

  // Loading state
  if (isValidating) {
    return (
      <PageLayout className="bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-safet-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-safet-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Validating Invitation</h1>
          <p className="text-gray-600 mt-2">Please wait while we verify your invitation...</p>
        </div>
      </PageLayout>
    );
  }

  // Invalid invitation
  if (!inviteData.valid) {
    return (
      <PageLayout className="bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Invalid Invitation</h1>
          <p className="text-gray-600 mt-2">
            This invitation link is invalid or has expired. Please contact the person who invited you.
          </p>
          <Button className="mt-6" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Valid invitation - show registration form
  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-safet-100 rounded-full mb-4">
            <Shield className="h-8 w-8 text-safet-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Registration</h1>
          <p className="text-gray-600 mt-2">
            {inviteData.hostName} has invited you to access their medical information
          </p>
        </div>
        
        <Card className="border-gray-200 shadow-sm animate-scale-in">
          <CardHeader>
            <CardTitle>Proxy Registration</CardTitle>
            <CardDescription>
              Create your account to access shared medical information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inviteData.proxy && (
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
                <h3 className="font-medium text-blue-800 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Invitation Details
                </h3>
                <div className="mt-2 text-sm text-blue-700 space-y-1">
                  <p><span className="font-medium">Name:</span> {inviteData.proxy.name}</p>
                  <p><span className="font-medium">Email:</span> {inviteData.proxy.email}</p>
                  <p><span className="font-medium">Access Level:</span> {
                    inviteData.proxy.accessLevel === 'full' ? 'Full Access' :
                    inviteData.proxy.accessLevel === 'limited' ? 'Limited Access' :
                    inviteData.proxy.accessLevel === 'emergency' ? 'Emergency Only' :
                    'Custom Access'
                  }</p>
                  <p><span className="font-medium">Relationship:</span> {inviteData.proxy.relationship}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={inviteData.proxy?.email || ''}
                    className="pl-10 bg-gray-100"
                    disabled
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 ${errors.password ? 'border-red-300' : ''}`}
                  />
                </div>
                {errors.password ? (
                  <p className="text-xs text-red-500">{errors.password}</p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="********"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 ${errors.confirmPassword ? 'border-red-300' : ''}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div className="flex items-start">
                <Checkbox 
                  id="agreedToTerms"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, agreedToTerms: checked as boolean })}
                  className="mr-2 mt-1"
                />
                <Label htmlFor="agreedToTerms" className="text-sm leading-tight">
                  I agree to the <a href="/terms" className="text-safet-600 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-safet-600 hover:underline">Privacy Policy</a>
                </Label>
              </div>
              {errors.agreedToTerms && (
                <p className="text-xs text-red-500 -mt-4">{errors.agreedToTerms}</p>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-safet-500 hover:bg-safet-600" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t bg-gray-50/50 rounded-b-xl">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-safet-600 hover:underline font-medium">
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ProxyRegister;
