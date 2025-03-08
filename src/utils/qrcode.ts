
/**
 * Generates a QR code URL for a given user ID and access code
 * Uses QRCode.API to generate the QR code
 */
export const generateQRCodeUrl = (userId: string, accessCode: string, size = 200): string => {
  // The URL that the QR code will point to - now points to the full medical record view
  const viewUrl = `${window.location.origin}/profile/view`;
  
  // Generate QR code using QRCode.API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(viewUrl)}`;
  
  return qrUrl;
};

/**
 * Get the shareable URL for a user's medical profile
 */
export const getShareableUrl = (userId: string, accessCode: string): string => {
  return `${window.location.origin}/view/${userId}/${accessCode}`;
};
