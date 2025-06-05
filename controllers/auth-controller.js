const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const checkExistingUser = await User.findOne({$or: [ { username }, { email } ] });
        if(checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        await newlyCreatedUser.save();

        if(newlyCreatedUser) {
            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    id: newlyCreatedUser._id,
                    username: newlyCreatedUser.username,
                    email: newlyCreatedUser.email,
                    role: newlyCreatedUser.role,
                },
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'User registration failed',
            });
        }
    } catch(e) {
        console.error('Error in registerUser:', e);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error',
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({username});
        if(!user) {
            return res.status(400).json({
                success: false,
                message: `User doesn't exist`,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                massage: 'Invalid credentials',
            });
        }

        // create a token: based on the typed username and password.
        // user object got from `findOne`, holds everything, id, email, password, role and everything.
        // bearer token created on the basis of the user object will hold everything about the user too.
        // using this bearer token, we can do various things. eg: store it in cookie, pass that bearer token to frontend.

        // create user token using (Json Web Token) JWT
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role,
        }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15m'
        });

        // return token back to frontend
        res.status(200).json({
            success: true,
            message: 'Login success',
            accessToken // this access token is returned to frontend and holds userId, username and role.
        });
    } catch(e) {
        res.status(500).json({
            success: false,
            message: 'Some error occurred! Please try again',
        });
    }
}

module.exports = { registerUser, loginUser };