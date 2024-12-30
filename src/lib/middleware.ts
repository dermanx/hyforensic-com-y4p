import { User, verifySession } from './auth';
import { logSecurityEvent } from './security';

export async function requireAuth(
  handler: (user: User) => Promise<Response>
): Promise<Response> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }

  const session = await verifySession(token);
  
  if (!session) {
    localStorage.removeItem('auth_token');
    return new Response('Session expired', { status: 401 });
  }

  logSecurityEvent({
    type: 'auth',
    userId: session.user.id,
    action: 'access_protected_route'
  });

  return handler(session.user);
}