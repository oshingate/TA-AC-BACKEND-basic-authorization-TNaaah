var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Blog = require('../models/Blog');
var Comment = require('../models/Comment');
var auth = require('../middlewares/auth');

//comment editior

router.get('/:id/edit', auth.checkLoggedIn, (req, res, next) => {
  let commentId = req.params.id;
  Comment.findById(commentId, (err, commnet) => {
    if (commnet.author === req.session.userId) {
      Comment.findById(commentId, (err, comment) => {
        if (err) return next(err);

        res.render('commentEditForm', { comment });
      });
    } else {
      req.flash('error', 'user is not same');
      res.redirect('/blogs/list');
    }
  });
});

router.post('/:id/edit', auth.checkLoggedIn, (req, res, next) => {
  let commentId = req.params.id;

  Comment.findByIdAndUpdate(commentId, req.body, (err, comment) => {
    if (err) return next(err);
    res.redirect('/blogs/list');
  });
});

//comment delete handler

router.get('/:id/delete', auth.checkLoggedIn, (req, res, next) => {
  let commentId = req.params.id;
  Comment.findById(commentId, (err, commnet) => {
    if (commnet.author === req.session.userId) {
      Comment.findByIdAndDelete(commentId, (err, deleted) => {
        if (err) return next(err);
        res.redirect('/blogs/list');
      });
    } else {
      req.flash('error', 'user is not same');
      res.redirect('/blogs/list');
    }
  });
});
module.exports = router;
