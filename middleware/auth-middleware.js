const jwt = require('jsonwebtoken');

// frontend guy will pass the bearer token (which was created during login) check the token is valid then send the homepage
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    // this token holds the user info like id, username and role.
    if(!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided. Please login to continue',
        });
    }

    // decode the token to get user info.
    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedTokenInfo);
        req.userInfo = decodedTokenInfo;
        next();
    } catch(e) {
        return res.status(500).json({
            success: false,
            message: 'Access denied. No token provided. Please login to continue',
        });
    }
}

module.exports = authMiddleware;