var express = require('express');
var User = require('../models/User');
var Item = require('../models/Item');
var router = express.Router();

/* GET list . */
router.get('/item/list', function (req, res, next) {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    Item.find({}, (err, items) => {
      res.render('clientItemList', { items });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//get details

router.get('/item/:id/details', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let itemId = req.params.id;

    Item.findById(itemId, (err, item) => {
      if (err) return next(err);
      res.render('clientItemDetail', { item });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//like handler

router.get('/item/:id/like', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let itemId = req.params.id;

    Item.findByIdAndUpdate(itemId, { $inc: { likes: 1 } }, (err, updated) => {
      if (err) return next(err);
      console.log(updated.likes);
      res.redirect('/client/item/' + itemId + '/details');
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

router.get('/item/:id/dislike', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let itemId = req.params.id;

    Item.findByIdAndUpdate(itemId, { $inc: { likes: -1 } }, (err, updated) => {
      if (err) return next(err);
      console.log(updated.likes);
      res.redirect('/client/item/' + itemId + '/details');
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//adding item to cart

router.get('/item/:id/addToCart', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let itemId = req.params.id;

    let userId = req.session.userId;

    User.findByIdAndUpdate(
      userId,
      { $push: { cart: itemId } },
      (err, updated) => {
        if (err) return next(err);

        res.redirect('/client/item/list');
      }
    );
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//getting cart items

router.get('/item/cart', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let userId = req.session.userId;

    User.findById(userId)
      .populate('cart')
      .exec((err, user) => {
        if (err) return next(err);
        let total = user.cart.reduce((acc, cv) => {
          acc = acc + cv.price;
          return acc;
        }, 0);
        res.render('clientCart', { user, total });
      });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//removing item to cart

router.get('/item/:id/removeFromCart', (req, res, next) => {
  if (req.session.isAdmin === 'false' && req.session.userId) {
    let itemId = req.params.id;

    let userId = req.session.userId;

    User.findByIdAndUpdate(
      userId,
      { $pull: { cart: itemId } },
      (err, updated) => {
        if (err) return next(err);

        res.redirect('/client/item/cart');
      }
    );
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

module.exports = router;
