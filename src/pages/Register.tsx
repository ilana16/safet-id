import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/lib/toast';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Update the local storage isLoggedIn flag
      localStorage.setItem('isLoggedIn', 'true');
      
      setIsLoading(false);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      setIsLoading(false);
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      
      // Handle specific errors
      if (error.message?.includes('email')) {
        setErrors(prev => ({
          ...prev,
          email: 'Email already in use or invalid'
        }));
      } else if (error.message?.includes('password')) {
        setErrors(prev => ({
          ...prev,
          password: 'Password is too weak'
        }));
      }
    }
  };

  return (
    <PageLayout className="bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-safet-100 rounded-full mb-4">
            <ShieldCheck className="h-8 w-8 text-safet-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Your SafeT-iD Account</h1>
          <p className="text-gray-600 mt-2">Secure your medical information in minutes</p>
        </div>
        
        <Card className="border-gray-200 shadow-sm animate-scale-in">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'border-red-300' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'border-red-300' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${errors.email ? 'border-red-300' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
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

export default Register;
