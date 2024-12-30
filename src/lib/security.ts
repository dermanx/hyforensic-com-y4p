import { AES, enc } from 'crypto-js';
import { User } from './auth';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY is required');
}

export function encryptData(data: string): string {
  try {
    if (!data) return '';
    return AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decryptData(encryptedData: string): string {
  try {
    if (!encryptedData) return '';
    const bytes = AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove potential JavaScript
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

export function hasPermission(user: User | undefined, requiredRole: string): boolean {
  if (!user) return false;
  if (requiredRole === 'admin') return user.role === 'admin';
  return true;
}

export function logSecurityEvent(event: {
  type: string;
  userId?: string;
  action: string;
  details?: Record<string, unknown>;
}): void {
  // Remove sensitive data from logs
  const sanitizedDetails = event.details ? 
    Object.fromEntries(
      Object.entries(event.details).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.substring(0, 100) : value
      ])
    ) : {};

  const logEntry = {
    ...event,
    details: sanitizedDetails,
    timestamp: new Date().toISOString(),
    environment: import.meta.env.MODE
  };
  
  if (import.meta.env.PROD) {
    // Send to secure logging service
    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    }).catch(console.error);
  } else {
    console.debug('Security event:', logEntry);
  }
}