const express = require('express');
const Article = require('../schema/article');
const router = express.Router();

module.exports = function () {
  router.get('/', async (req, res) => {
    const articles = await Article.find();
    res.render('articles', { articles });
  });

  router.get('/new', (req, res) => {
    res.render('article-form', { article: {}, action: '/articles/new' });
  });
  return router;
};
