const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for an Admin
const adminSchema = new Schema({
  hospitalName: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10}$/, // Example regex for 10 digit mobile number
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic regex for email validation
  },
  dateOfJoining: {
    type: Date,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        // 'this' is the admin document
        return value === this.password;
      },
      message: 'Passwords do not match',
    },
  },
});

// Pre-save middleware to hash the password before saving
adminSchema.pre('save', function(next) {
  const admin = this;
  if (!admin.isModified('password')) return next();

  // Implement password hashing here
  // For example, using bcrypt
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  bcrypt.hash(admin.password, saltRounds, function(err, hash) {
    if (err) return next(err);
    admin.password = hash;
    admin.confirmPassword = hash;
    next();
  });
});

// Create the model from the schema
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
