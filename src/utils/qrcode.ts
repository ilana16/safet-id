
/**
 * Generates a QR code URL for a given user ID
 * Uses QRCode.API to generate the QR code
 */
export const generateQRCodeUrl = (userId: string, accessCode: string): string => {
  // The URL that the QR code will point to
  const viewOnlyUrl = `${window.location.origin}/view/${userId}`;
  
  // Generate QR code using QRCode.API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(viewOnlyUrl)}`;
  
  return qrUrl;
};
