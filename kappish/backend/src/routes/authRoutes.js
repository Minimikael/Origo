const express = require('express');
const { body, validationResult } = require('express-validator');
const { getAuth } = require('../services/firebaseAdmin');

const router = express.Router();

// Middleware to validate request body
const validateSignIn = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
];

const validateSignUp = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('displayName').optional().trim().isLength({ min: 2 })
];

// Sign in route
router.post('/signin', validateSignIn, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password } = req.body;
    const auth = getAuth();

    // Note: In a real implementation, you would handle Firebase Auth here
    // For now, we'll return a mock response
    res.json({
      success: true,
      message: 'Sign in successful',
      user: {
        uid: 'mock-user-id',
        email: email,
        displayName: 'Mock User'
      }
    });

  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
});

// Sign up route
router.post('/signup', validateSignUp, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { email, password, displayName } = req.body;
    const auth = getAuth();

    // Note: In a real implementation, you would create a Firebase user here
    // For now, we'll return a mock response
    res.json({
      success: true,
      message: 'Account created successfully',
      user: {
        uid: 'mock-user-id',
        email: email,
        displayName: displayName || 'New User'
      }
    });

  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ 
      error: 'Account creation failed',
      message: error.message 
    });
  }
});

// Verify token route
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ 
        error: 'Token is required' 
      });
    }

    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    
    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      error: 'Invalid token',
      message: error.message 
    });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    
    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(401).json({ 
      error: 'Failed to fetch profile',
      message: error.message 
    });
  }
});

module.exports = router; 