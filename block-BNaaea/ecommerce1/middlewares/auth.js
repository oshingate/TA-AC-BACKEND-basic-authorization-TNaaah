module.exports = {
  isAdmin: (req, res, next) => {
    if (req.session && req.session.isAdmin === 'true') {
      next();
    } else {
      res.redirect('/home');
    }
  },
};
