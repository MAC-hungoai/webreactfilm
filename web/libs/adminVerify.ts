import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth } from './adminAuthMiddleware';
import serverAuth from './serverAuth';

/**
 * Verify request as admin - checks user role from session
 * Returns object with user info if admin, or null if not admin
 */
export const verifyAdminAccess = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Try admin JWT token first
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const { verifyAdminJWT } = require('./adminJwt');
      const payload = verifyAdminJWT(token);
      if (payload) {
        return payload; // Admin verified
      }
    }

    // Fall back to user session - check role field
    const userSession = await serverAuth(req, res);
    if (!userSession) {
      return null;
    }

    // Check if user has ADMIN role
    const userRole = (userSession.currentUser as any).role;
    if (userRole === 'ADMIN') {
      return {
        id: userSession.currentUser.id,
        email: userSession.currentUser.email,
        name: userSession.currentUser.name,
        role: userRole,
      };
    }

    return null;
  } catch (error) {
    console.error('Admin verify error:', error);
    return null;
  }
};

