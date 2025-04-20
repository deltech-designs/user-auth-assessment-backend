import jwt from 'jsonwebtoken';
import User from '../models/user.js';
export const authMiddle = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Authorization header is require' });
  }
  const [type, token] = req.headers.authorization.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid authorization header' });
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret'
    );
    const userId = await User.findById(decoded.id);
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
