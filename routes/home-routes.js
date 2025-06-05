const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');

// before sending the home page, we need to check if the user is logged in
// to check if user is logged in make a middleware
router.get('/welcome', authMiddleware, (req, res) => {
    const { username, userId, role } = req.userInfo;
    res.json({
        message: `Welcome ${username} to the home page`,
        user: {
            _id: userId,
            username: username,
            role,
        }
    });
});

module.exports = router;