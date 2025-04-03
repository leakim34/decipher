/**
 * Utility functions for QR code scanning
 */

/**
 * Types of QR codes that can be scanned
 */
export enum QRCodeType {
  ALGORAND_ADDRESS = 'algorand_address',
  ALGORAND_APP_ID = 'algorand_app_id',
  URL = 'url',
  UNKNOWN = 'unknown'
}

/**
 * Result after parsing a QR code
 */
export interface QRCodeResult {
  type: QRCodeType;
  value: string;
  rawData: string;
}

/**
 * Determines if a string is a valid Algorand address
 * @param address String to check
 * @returns boolean
 */
export function isValidAlgorandAddress(address: string): boolean {
  // Basic validation - Algorand addresses are 58 characters
  // More comprehensive validation would check the encoding
  return /^[A-Z2-7]{58}$/.test(address);
}

/**
 * Determines if a string is a valid Algorand application ID
 * @param appId String to check
 * @returns boolean
 */
export function isValidAlgorandAppId(appId: string): boolean {
  return /^\d+$/.test(appId);
}

/**
 * Attempts to extract an Algorand app ID from a URL
 * @param url URL that might contain an app ID
 * @returns App ID or null if not found
 */
export function extractAppIdFromUrl(url: string): string | null {
  try {
    // Look for app ID patterns in URLs
    // Examples:
    // - https://app.algorand.org/app/123456789
    // - https://explorer.perawallet.app/application/123456789/
    const appIdMatch = url.match(/app(?:lication)?\/(\d+)/i);
    
    if (appIdMatch && appIdMatch[1]) {
      return appIdMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting app ID from URL:', error);
    return null;
  }
}

/**
 * Parses raw QR code data and identifies its type and value
 * @param qrData Raw QR code scan result
 * @returns Processed QR code result with type and value
 */
export function parseQRCode(qrData: string): QRCodeResult {
  // Trim the data
  let cleanData = qrData.trim().replace(/^algorand:\/\//, '');


  
  // Check if it's an Algorand address
  if (isValidAlgorandAddress(cleanData)) {
    return {
      type: QRCodeType.ALGORAND_ADDRESS,
      value: cleanData,
      rawData: qrData
    };
  }
  
  // Check if it's an Algorand app ID
  if (isValidAlgorandAppId(cleanData)) {
    return {
      type: QRCodeType.ALGORAND_APP_ID,
      value: cleanData,
      rawData: qrData
    };
  }
  
  // Check if it's a URL
  if (cleanData.startsWith('http://') || cleanData.startsWith('https://')) {
    // Try to extract app ID from URL
    const appId = extractAppIdFromUrl(cleanData);
    
    if (appId) {
      return {
        type: QRCodeType.ALGORAND_APP_ID,
        value: appId,
        rawData: qrData
      };
    }
    
    return {
      type: QRCodeType.URL,
      value: cleanData,
      rawData: qrData
    };
  }
  
  // If we can't determine the type, return unknown
  return {
    type: QRCodeType.UNKNOWN,
    value: cleanData,
    rawData: qrData
  };
}

/**
 * Generates a QR code URL for the given value using a free QR code generation service
 * @param value The text to encode in the QR code
 * @param size The size of the QR code image in pixels (default: 200)
 * @returns URL string for the QR code image
 */
export function generateQRCodeUrl(value: string, size: number = 200): string {
  // Encode the value for URL use
  const encodedValue = encodeURIComponent(value);
  
  // Use the Google Charts API to generate a QR code
  // Note: This is a free service with limitations
  return `https://chart.googleapis.com/chart?cht=qr&chl=${encodedValue}&chs=${size}x${size}&choe=UTF-8`;
} 