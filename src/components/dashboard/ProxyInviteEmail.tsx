
import React from 'react';
import { Mail, Link, Shield } from 'lucide-react';

interface ProxyInviteEmailProps {
  recipientName: string;
  recipientEmail: string;
  senderName: string;
  accessLevel: string;
  inviteLink: string;
}

const ProxyInviteEmail: React.FC<ProxyInviteEmailProps> = ({
  recipientName,
  recipientEmail,
  senderName,
  accessLevel,
  inviteLink,
}) => {
  const getAccessLevelDescription = (level: string) => {
    switch(level) {
      case 'full': 
        return 'full access to view and manage all medical information';
      case 'limited': 
        return 'limited access to view specific sections of medical information';
      case 'emergency': 
        return 'emergency-only access to critical medical information';
      default: 
        return 'customized access to medical information';
    }
  };

  return (
    <div className="font-sans text-gray-800">
      <div className="flex items-center mb-4">
        <Mail className="h-5 w-5 text-safet-500 mr-2" />
        <div>
          <div className="text-sm text-gray-500">To: {recipientEmail}</div>
          <div className="text-sm text-gray-500">Subject: Medical Information Access Invitation</div>
        </div>
      </div>

      <div className="space-y-4">
        <p>Hello {recipientName},</p>
        
        <p>
          <strong>{senderName}</strong> has invited you to have {getAccessLevelDescription(accessLevel)} 
          through the SafeT-iD platform.
        </p>
        
        <div className="bg-white border border-gray-200 rounded-md p-4 my-4">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-safet-500 mr-2" />
            <h3 className="font-medium">Access Details</h3>
          </div>
          <ul className="pl-8 list-disc space-y-1 text-sm">
            <li>Granted by: {senderName}</li>
            <li>Access type: {accessLevel === 'full' 
              ? 'Full Access' 
              : accessLevel === 'limited' 
                ? 'Limited Access' 
                : accessLevel === 'emergency'
                  ? 'Emergency Only'
                  : 'Custom Access'}</li>
            <li>You will need to create an account to access this information</li>
          </ul>
        </div>
        
        <div className="bg-safet-50 border border-safet-100 rounded-md p-4 flex items-center">
          <Link className="h-5 w-5 text-safet-500 mr-2 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Click below to accept this invitation:</p>
            <a 
              href={inviteLink} 
              className="text-safet-600 hover:underline text-sm break-all"
              target="_blank" 
              rel="noopener noreferrer"
            >
              {inviteLink}
            </a>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          This invitation will expire in 7 days. If you have any questions, please contact {senderName} directly.
        </p>
        
        <p>Regards,<br />SafeT-iD Team</p>
      </div>
    </div>
  );
};

export default ProxyInviteEmail;
