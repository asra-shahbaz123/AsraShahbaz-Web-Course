const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/auth');
const User = require('../models/User');

router.use(isAdmin);

router.get('/', async (req, res) => {
    const allUsers = await User.find({});
    res.render('admin', { users: allUsers, messages: req.flash(), session: req.session });
});

module.exports = router;