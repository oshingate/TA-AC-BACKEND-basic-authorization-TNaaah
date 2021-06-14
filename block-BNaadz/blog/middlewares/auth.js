module.exports = {
  checkLoggedIn: (req, res, next) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      req.flash('error', 'You must login ');
      res.redirect('/users/login');
    }
  },
};
