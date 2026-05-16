const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/register', (req, res) => {
    res.render('register', { messages: req.flash() });
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters.');
            return res.redirect('/register');
        }
        const existing = await User.findOne({ email });
        if (existing) {
            req.flash('error', 'Email already in use.');
            return res.redirect('/register');
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        req.flash('success', 'Account created! Please log in.');
        res.redirect('/login');
    } catch (err) {
        console.error('Register error:', err);
        req.flash('error', 'Something went wrong.');
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('login', { messages: req.flash() });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            req.flash('error', 'Invalid username or password.');
            return res.redirect('/login');
        }
        const passOk = await bcrypt.compare(password, foundUser.password);
        if (!passOk) {
            req.flash('error', 'Invalid username or password.');
            return res.redirect('/login');
        }
        req.session.userId = foundUser._id;
        req.session.userName = foundUser.name;
        req.session.userRole = foundUser.role;
        req.flash('success', `Welcome back, ${foundUser.name}!`);
        res.redirect('/');
    } catch (err) {
        req.flash('error', 'Something went wrong.');
        res.redirect('/login');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;