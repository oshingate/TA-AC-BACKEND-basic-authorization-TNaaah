var express = require('express');

var User = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//handle user registration

router.get('/register', (req, res, next) => {
  res.render('userRegisterForm');
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    res.redirect('/users/login');
  });
});

//handle user login

router.get('/login', (req, res, next) => {
  let error = req.flash('error')[0];
  res.render('userLoginForm', { error });
});

router.post('/login', (req, res, next) => {
  let data = req.body;

  if (!data.email || !data.password) {
    req.flash('error', 'Email/Password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email: data.email }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      req.flash('error', 'incorrect email');
      return res.redirect('/users/login');
    } else {
      user.matchPassword(data.password, (err, result) => {
        if (err) return next(err);

        if (!result) {
          req.flash('error', 'incorrect Password');
          return res.redirect('/users/login');
        } else {
          req.session.userId = user.id;
          return res.redirect('/blogs');
        }
      });
    }
  });
});

//handle user logout

router.get('/logout', (req, res, next) => {
  if (req.session.userId) {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/users/login');
  } else {
    req.flash('error', 'You must login first');
    res.redirect('/users/login');
  }
});

module.exports = router;
