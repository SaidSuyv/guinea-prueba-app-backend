const jwt = require('jsonwebtoken');

// Middleware to authenticate requests using JWT
// This middleware checks for a JWT in the Authorization header and verifies it
// If the token is valid, it attaches the user information to the request object
module.exports = (req, res, next) => {
  
  // Ensure the JWT secret is set in the environment variables
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Server configuration error.' });
  }

  // Extract the token from the Authorization header
  // The token is expected to be in the format "Bearer <token>"
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // If no token is provided, return a 401 Unauthorized response
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Verify the token using the secret key
  // If the token is valid, the user information is decoded and attached to the request object
  // If the token is invalid, return a 400 Bad Request response
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  } catch (ex) {
    
    res.status(400).json({ error: 'Invalid token.' });
  }
}