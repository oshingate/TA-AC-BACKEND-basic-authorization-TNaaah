var express = require('express');
var User = require('../models/User');
var Blog = require('../models/Blog');
var Comment = require('../models/Comment');
var auth = require('../middlewares/auth');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('blogsHome');
});

//list of blog

router.get('/list', (req, res, next) => {
  Blog.find({})
    .populate('author')
    .exec((err, blogs) => {
      if (err) return next(err);

      res.render('blogList', { blogs });
    });
});

//create new blog

router.get('/new', auth.checkLoggedIn, (req, res, next) => {
  res.render('blogCreateForm');
});

router.post('/new', auth.checkLoggedIn, (req, res, next) => {
  req.body.author = req.session.userId;

  Blog.create(req.body, (err, blog) => {
    if (err) return next(err);

    res.redirect('/blogs/list');
  });
});

//get blog details

router.get('/:slug', (req, res, next) => {
  let givenSlug = req.params.slug;

  Blog.findOne({ slug: givenSlug })
    .populate('author comments')
    .exec((err, blog) => {
      if (err) return next(err);
      console.log(blog);
      res.render('blogDetails', { blog });
    });
});

//like handler

router.get('/:slug/likes/:method', auth.checkLoggedIn, (req, res, next) => {
  let givenSlug = req.params.slug;
  let givenMethod = req.params.method;

  if (givenMethod === 'inc') {
    Blog.findOneAndUpdate(
      { slug: givenSlug },
      { $inc: { likes: 1 } },
      (err, updated) => {
        if (err) return next(err);

        return res.redirect('/blogs/' + updated.slug);
      }
    );
  }
  if (givenMethod === 'dec') {
    Blog.findOneAndUpdate(
      { slug: givenSlug },
      { $inc: { likes: -1 } },
      (err, updated) => {
        if (err) return next(err);

        return res.redirect('/blogs/' + updated.slug);
      }
    );
  }
});

//comment create

router.post('/:slug/comment/new', auth.checkLoggedIn, (req, res, next) => {
  let givenSlug = req.params.slug;
  let currentUser = req.session.userId;
  req.body.author = currentUser;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Blog.findOneAndUpdate(
      { slug: givenSlug },
      { $push: { comments: comment.id } },
      (err, blog) => {
        if (err) return next(err);

        res.redirect('/blogs/' + givenSlug);
      }
    );
  });
});

module.exports = router;
