import { SignJWT, jwtVerify } from 'jose';
import { encryptData } from './security';

const JWT_SECRET = new TextEncoder().encode(
  import.meta.env.VITE_JWT_SECRET || 'development-secret'
);

export interface User {
  id: string;
  role: 'user' | 'admin';
  email: string;
}

export interface Session {
  user: User;
  exp: number;
}

export async function createSession(user: User): Promise<string> {
  const jwt = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
    
  return jwt;
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as Session;
  } catch {
    return null;
  }
}

export function hasPermission(user: User, requiredRole: 'user' | 'admin'): boolean {
  if (requiredRole === 'admin') {
    return user.role === 'admin';
  }
  return true;
}