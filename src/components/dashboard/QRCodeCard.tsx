
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/lib/toast';

interface QRCodeCardProps {
  qrCodeUrl: string;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({ qrCodeUrl }) => {
  const downloadQRCode = () => {
    // In a real app, this would download the QR code
    toast.success('QR Code downloaded!');
  };
  
  const shareProfile = () => {
    // In a real app, this would open a share dialog
    toast.success('Share dialog opened!');
  };

  return (
    <Card className="border-gray-200 shadow-sm text-center overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your SafeT-iD QR Code</CardTitle>
        <CardDescription>
          Scan to access your medical information
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-2">
        {qrCodeUrl && (
          <div className="border-8 border-white shadow-md rounded-xl bg-white overflow-hidden">
            <img 
              src={qrCodeUrl} 
              alt="Your SafeT-iD QR Code" 
              className="w-48 h-48"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center space-x-2 pt-2 pb-6">
        <Button 
          size="sm" 
          variant="outline"
          onClick={downloadQRCode}
          className="flex items-center space-x-1"
        >
          <span>Download</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={shareProfile}
          className="flex items-center space-x-1"
        >
          <Share2 className="h-4 w-4 mr-1" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeCard;
