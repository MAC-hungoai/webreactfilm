import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { prisma } from './prismadb';
import { authOptions } from './authOptions';

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
      try {
        const { verifyAdminJWT } = require('./adminJwt');
        const payload = verifyAdminJWT(token);
        if (payload) {
          return payload; // Admin verified
        }
      } catch (jwtError) {
        console.log('JWT verification failed, trying session auth');
      }
    }

    // Fall back to user session - check role field
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.email) {
      return null; // Not authenticated
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    if (!user) {
      return null; // User not found
    }

    // Check if user has ADMIN role
    if (user.role === 'ADMIN') {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }

    return null;
  } catch (error) {
    console.error('Admin verify error:', error);
    return null;
  }
};

