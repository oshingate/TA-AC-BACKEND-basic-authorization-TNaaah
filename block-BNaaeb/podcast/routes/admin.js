var express = require('express');
var auth = require('../auth/auth');

var User = require('../models/User');
var Podcast = require('../models/Podcast');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('adminHomePage');
});

//create new podcast

router.get('/newPodcast', auth.isAdmin, (req, res, next) => {
  res.render('adminNewPodcast');
});

router.post('/newPodcast', auth.isAdmin, (req, res, next) => {
  let data = req.body;
  data.createdBy = req.user.id;
  Podcast.create(data, (err, createdPodcast) => {
    if (err) return next(err);
    res.redirect('/admin/listOfPodcast');
  });
});

//list of podcasts

router.get('/listOfPodcast', auth.isAdmin, (req, res, next) => {
  Podcast.find({}, (err, podcasts) => {
    if (err) return next(err);
    res.render('adminPodcastList', { podcasts });
  });
});

//podcast details page

router.get('/podcast/:id', auth.isAdmin, (req, res, next) => {
  let podcastId = req.params.id;

  Podcast.findById(podcastId)
    .populate('createdBy')
    .exec((err, podcast) => {
      if (err) return next(err);
      res.render('adminpodcastDetails', { podcast });
    });
});
module.exports = router;
