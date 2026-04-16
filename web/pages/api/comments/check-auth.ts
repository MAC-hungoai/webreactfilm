import { NextApiRequest, NextApiResponse } from 'next';
import serverAuth from '../../../libs/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authResult = await serverAuth(req, res);
    if (!authResult) {
      return res.status(401).json({ 
        isAuthenticated: false,
        isAdmin: false 
      });
    }

    const { currentUser } = authResult;
    const userRole = (currentUser as any).role || 'USER';
    const isAdmin = userRole === 'ADMIN';

    return res.status(200).json({
      isAuthenticated: true,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole,
      isAdmin
    });
  } catch (error: any) {
    console.error('Error checking auth:', error);
    return res.status(500).json({ error: 'Failed to check auth' });
  }
}
