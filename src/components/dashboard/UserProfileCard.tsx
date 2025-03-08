
import React from 'react';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';
import { toast } from '@/lib/toast';

interface UserProfileCardProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    accessCode: string;
  };
  completionPercentage: number;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, completionPercentage }) => {
  const copyAccessCode = () => {
    if (user?.accessCode) {
      navigator.clipboard.writeText(user.accessCode);
      toast.success('Access code copied to clipboard!');
    }
  };

  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-safet-50 to-safet-100 border-b">
        <div className="flex items-center space-x-4">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <User className="h-8 w-8 text-safet-500" />
          </div>
          <div>
            <CardTitle className="text-xl">
              {user.firstName} {user.lastName}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Profile Completion</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-safet-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {completionPercentage < 100 ? (
                <>Your profile is {completionPercentage}% complete. Complete your medical information to get the most out of SafeT-iD.</>
              ) : (
                <>Your profile is complete! You can always update your information as needed.</>
              )}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-3">Your Access Code <span className="text-xs text-gray-400">(cannot be changed)</span></p>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex justify-between items-center">
              <div className="font-mono text-xl font-semibold tracking-widest text-gray-900">
                {user.accessCode}
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={copyAccessCode}
                className="hover:bg-gray-200"
                aria-label="Copy access code"
                title="Copy to clipboard"
              >
                <ClipboardCheck className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Share this code with healthcare providers to access your medical information
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;
