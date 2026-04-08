import { NextApiRequest, NextApiResponse } from 'next';
import serverAuth from './serverAuth';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    name?: string;
    role: 'USER' | 'ADMIN';
  };
}

/**
 * Middleware to verify user is authenticated and has ADMIN role
 * Returns true if authorized, sends error response and returns false if not
 */
export const requireAdminRole = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<boolean> => {
  try {
    const session = await serverAuth(req, res);
    
    if (!session || !session.currentUser) {
      res.status(401).json({ error: 'Unauthorized: No session found' });
      return false;
    }

    const userRole = (session.currentUser as any).role;
    
    if (userRole !== 'ADMIN') {
      res.status(403).json({ 
        error: 'Forbidden: Admin role required',
        userRole: userRole || 'USER'
      });
      return false;
    }

    // Attach user to request
    req.user = {
      id: session.currentUser.id,
      email: session.currentUser.email || '',
      name: session.currentUser.name,
      role: 'ADMIN',
    };

    return true;
  } catch (error) {
    console.error('Role auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
    return false;
  }
};

/**
 * Middleware to verify user is authenticated (any role)
 * Returns true if authorized, sends error response and returns false if not
 */
export const requireUserAuth = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
): Promise<boolean> => {
  try {
    const session = await serverAuth(req, res);
    
    if (!session || !session.currentUser) {
      res.status(401).json({ error: 'Unauthorized: Please log in' });
      return false;
    }

    const userRole = (session.currentUser as any).role || 'USER';

    // Attach user to request
    req.user = {
      id: session.currentUser.id,
      email: session.currentUser.email || '',
      name: session.currentUser.name,
      role: userRole,
    };

    return true;
  } catch (error) {
    console.error('User auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
    return false;
  }
};
