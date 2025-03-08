
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { validateAccessCode } from '@/utils/accessCode';
import { toast } from '@/components/ui/sonner';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accessCode: string;
}

const ViewOnly = () => {
  const { userId } = useParams<{ userId: string }>();
  const [accessCode, setAccessCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    // In a real app, this would validate the userId exists
    // For demo, we'll use localStorage user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, [userId]);

  const handleAccessCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setAccessCode(value);
    if (error) setError('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAccessCode(accessCode)) {
      setError('Please enter a valid 5-digit access code');
      return;
    }
    
    setIsVerifying(true);
    
    // In a real app, this would verify against an API
    setTimeout(() => {
      if (userData && accessCode === userData.accessCode) {
        setIsVerified(true);
        toast.success('Access code verified!');
      } else {
        setError('Invalid access code. Please try again.');
      }
      setIsVerifying(false);
    }, 1500);
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
          <p className="text-gray-600 mb-6">
            This QR code link appears to be invalid or has expired. Please contact the SafeT-iD owner for a valid QR code.
          </p>
          <Link to="/">
            <Button className="bg-safet-500 hover:bg-safet-600">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-safet-50 mb-4">
            <ShieldCheck className="h-8 w-8 text-safet-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">SafeT-iD Protected Information</h1>
          <p className="text-gray-600 mb-6">
            Enter the 5-digit access code to view medical information for {userData.firstName} {userData.lastName}
          </p>
          
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative w-56 mx-auto">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="5-digit code"
                value={accessCode}
                onChange={handleAccessCodeChange}
                className={`pl-10 text-center text-xl tracking-widest h-12 ${error ? 'border-red-300' : ''}`}
                inputMode="numeric"
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-56 bg-safet-500 hover:bg-safet-600" 
              disabled={isVerifying || accessCode.length !== 5}
            >
              {isVerifying ? 'Verifying...' : 'View Medical Information'}
            </Button>
          </form>
          
          <p className="text-sm text-gray-500 mt-8">
            This is a secure page. The access code protects the personal medical information and is only available to authorized individuals.
          </p>
        </div>
      </div>
    );
  }

  // Verified state - would normally show full medical information
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-6 w-6 text-safet-500" />
              <span className="text-lg font-semibold text-gray-900">SafeT-iD</span>
            </div>
            <div className="text-sm text-gray-600">
              View-only Medical Information
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gradient-to-r from-safet-50 to-white px-6 py-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Medical Information for {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-sm text-gray-600">
                This is a view-only page. Information last updated on {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="p-6">
              <div className="text-center py-12">
                <p className="text-gray-600 mb-6">
                  In a complete implementation, this page would display the user's comprehensive medical information, including:
                </p>
                <ul className="space-y-2 text-left max-w-lg mx-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <li className="text-sm">• Personal identification information</li>
                  <li className="text-sm">• Medical history and conditions</li>
                  <li className="text-sm">• Medications and dosages</li>
                  <li className="text-sm">• Allergies and immunizations</li>
                  <li className="text-sm">• Family medical history</li>
                  <li className="text-sm">• Social history and lifestyle factors</li>
                  <li className="text-sm">• Emergency contact information</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/">
              <Button variant="outline" className="text-safet-700 border-safet-200 hover:bg-safet-50">
                Return to SafeT-iD Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-600 text-center">
            This information is provided by SafeT-iD under HIPAA-compliant privacy protocols.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ViewOnly;
