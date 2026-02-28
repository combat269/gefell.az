const jwt = require('jsonwebtoken');

// middleware to verify the jwt token for protected routes
const verifyToken = (req, res, next) => {
    // checking the auth header for the bearer token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access Denied: Missing or malformed token.'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // decoding the token with our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // saving the user data to the request so we can use it later
        req.user = decoded; 
        
        next();
    } catch (error) {
        // if token is expired or fake, block the request
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Token is invalid or has expired.'
        });
    }
};

// checking if the user is an admin
// need this to protect the inventory editing routes
const requireAdmin = (req, res, next) => {
    // req.user comes from the verifyToken function above
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Admin access required.'
        });
    }
};

module.exports = { verifyToken, requireAdmin };