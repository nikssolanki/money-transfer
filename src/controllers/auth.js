import { signupUser, loginUser, getUserById } from '../services/auth.js';
import logger from '../services/logger.js';

// Sign up
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("body", req.body);
    console.log("name:", name, "email:", email, "password:", password);

    
    const { user, token } = await signupUser({ name, email, password });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    logger.error('Error signing up:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    logger.error('Error logging in:', error.message);
    res.status(401).json({ error: error.message });
  }
};

// Get current user (protected route)
export const getMe = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    logger.error('Error getting user:', error.message);
    res.status(404).json({ error: error.message });
  }
};