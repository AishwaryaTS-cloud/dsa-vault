const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dsa_secret_key_vault_2026';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, name }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expired or invalid token. Please log in again.' });
  }
};

module.exports = { authMiddleware, JWT_SECRET };
