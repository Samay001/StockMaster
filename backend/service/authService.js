import StockMasterUser from '../model/userModel.js';
import crypto from 'crypto';

export const registerService = async (userData) => {
    try {
        console.log("inside register service");
        
        const { username, email, password } = userData;
        
        // Check if user already exists
        const existingUser = await StockMasterUser.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return {
                success: false,
                message: 'User with this email or username already exists'
            };
        }
        
        // Create salt and hash the password
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
            .toString('hex');
        
        // Create new user
        const newUser = new StockMasterUser({
            username,
            email,
            password: hashedPassword,
            salt
        });
        
        // Save user to database
        await newUser.save();
        
        // Return user data without sensitive information
        const userToReturn = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt
        };
        
        return {
            success: true,
            message: 'User registered successfully',
            user: userToReturn
        };
    }
    catch (e) {
        console.log("error inside register service", e);
        return {
            success: false,
            message: 'Failed to register user',
            error: e.message
        };
    }
};


export const loginService = async (credentials) => {
    try {
        console.log("inside login service");
        
        const { username, password } = credentials;
        
        // Find user by username
        const user = await StockMasterUser.findOne({ username });
        
        if (!user) {
            return {
                success: false,
                message: 'Invalid username or password'
            };
        }
        
        // Verify password
        const hashedPassword = crypto
            .pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
            .toString('hex');
        
        if (hashedPassword !== user.password) {
            return {
                success: false,
                message: 'Invalid username or password'
            };
        }
        
        if (!user.salt) {
            return {
              success: false,
              message: 'User data is corrupted. Missing salt.'
            };
        }
          
        // Return user data without sensitive information
        const userToReturn = {
            _id: user._id,
            username: user.username,
            email: user.email
        };
        
        return {
            success: true,
            message: 'Login successful',
            user: userToReturn
        };
    }
    catch (e) {
        console.log("error inside login service", e);
        return {
            success: false,
            message: 'Failed to login',
            error: e.message
        };
    }
};

