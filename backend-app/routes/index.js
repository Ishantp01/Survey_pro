const express = require('express');
const userRoutes = require('./user.routes');
const formRoutes = require('./form.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/forms', formRoutes);
router.use('/admin', adminRoutes);

module.exports = router;