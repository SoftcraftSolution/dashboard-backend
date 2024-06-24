const Admin = require('../models/addaddmin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret';
// Controller to create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { role, ...rest } = req.body;
    
    // Validate the role field
    if (!role || (role !== 'admin' && role !== 'superadmin')) {
      return res.status(400).json({ error: 'Invalid role. Role must be either "admin" or "superadmin".' });
    }

    // Create a new Admin instance with the extracted data and the validated role
    const newAdmin = new Admin({
      ...rest,
      role,
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      role: admin.role, // Include the role in the response
      message: admin.role === 'superadmin' ? 'Super Admin logged in successfully' : 'Admin logged in successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to authenticate and authorize based on JWT token and role
exports.authMiddleware = (roles) => {
  return (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};