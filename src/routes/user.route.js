const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');

// Route to create a new admin
router.post('/create-admin', adminController.createAdmin);
router.get('/list-all-admin',adminController.listAllAdmins);
router.post('/login',adminController.loginAdmin)
module.exports = router;
