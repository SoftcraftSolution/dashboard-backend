const Admin = require('../models/addaddmin.model');

// Controller to create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
