function isLoggedIn(req, res, next) {
    if (req.session.userId) return next();
    req.flash('error', 'You need to log in first.');
    res.redirect('/login');
}

function isAdmin(req, res, next) {
    if (req.session.userId && req.session.userRole === 'admin') return next();
    req.flash('error', 'Access Denied.');
    res.redirect('/');
}

module.exports = { isLoggedIn, isAdmin };