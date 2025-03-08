
import React, { useState } from 'react';
import { QrCode, Share2, Download, Maximize2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/lib/toast';
import { generateQRCodeUrl, getShareableUrl } from '@/utils/qrcode';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface QRCodeCardProps {
  userId: string;
  accessCode: string;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({ userId, accessCode }) => {
  const [qrSize, setQrSize] = useState(200);
  
  // Generate QR code URL using the utility
  const qrCodeUrl = generateQRCodeUrl(userId, accessCode, qrSize);
  const shareableUrl = getShareableUrl(userId, accessCode);
  
  const downloadQRCode = () => {
    // Create a temporary link to download the QR code
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `safet-id-qrcode-${userId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR Code downloaded!');
  };
  
  const copyShareableLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    toast.success('Shareable link copied to clipboard!');
  };

  return (
    <Card className="border-gray-200 shadow-sm text-center overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-center">
          <QrCode className="h-5 w-5 text-safet-500 mr-2" />
          Your SafeT-iD QR Code
        </CardTitle>
        <CardDescription>
          Scan to access your medical information
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-2">
        {qrCodeUrl && (
          <div className="border-8 border-white shadow-md rounded-xl bg-white overflow-hidden relative group">
            <img 
              src={qrCodeUrl} 
              alt="Your SafeT-iD QR Code" 
              className="w-48 h-48"
            />
            
            <Dialog>
              <DialogTrigger asChild>
                <button className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" title="View larger QR code">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Your SafeT-iD QR Code</DialogTitle>
                  <DialogDescription>
                    Share this QR code with healthcare providers for quick access to your medical information.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-4">
                  <div className="border-8 border-white shadow-md rounded-xl bg-white">
                    <img 
                      src={generateQRCodeUrl(userId, accessCode, 300)} 
                      alt="Your SafeT-iD QR Code (Large)" 
                      className="w-64 h-64"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <div className="text-xs text-gray-500 italic">
                      Includes your access code for direct access
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={downloadQRCode}
                    className="px-3"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    <span>Download</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
      
      <div className="px-6 pb-2">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-2 text-xs text-gray-700 flex items-center justify-between">
          <span className="truncate max-w-[160px]">{shareableUrl}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={copyShareableLink}
            title="Copy shareable link"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <CardFooter className="flex justify-center space-x-2 pt-2 pb-6">
        <Button 
          size="sm" 
          variant="outline"
          onClick={downloadQRCode}
          className="flex items-center space-x-1"
        >
          <Download className="h-4 w-4 mr-1" />
          <span>Download</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeCard;
