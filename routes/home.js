const express = require('express');
const Article = require('../schema/article');
const router = express.Router();

module.exports = function () {
  router.get('/', async (req, res) => {
    const userId = req.session.userId;
    const articles = await Article.find({ published: true }).populate('author');

    res.render('home', { articles });
  });

  return router;
};
