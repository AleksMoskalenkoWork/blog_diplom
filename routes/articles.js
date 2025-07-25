const express = require('express');
const Article = require('../schema/article');
const router = express.Router();
const he = require('he');

module.exports = function () {
  router.get('/', async (req, res) => {
    const articles = await Article.find();
    res.render('articles', { articles });
  });

  router.get('/new', (req, res) => {
    res.render('article-form', { article: {}, action: '/articles/new' });
  });

  router.get('/:url', async (req, res) => {
    const article = await Article.findOne({ url: req.params.url });
    res.render('article', { article });
  });

  router.get('/:url/edit', async (req, res) => {
    const article = await Article.findOne({ url: req.params.url });

    res.render('article-form', {
      article,
      action: `/articles/${article.url}/edit`,
    });
  });

  //api
  router.post('/new', async (req, res) => {
    const title = he.encode(req.body.title.trim());
    const url = he.encode(req.body.url.trim());
    const content = he.encode(req.body.content.trim());

    await Article.insertOne({
      title,
      url,
      content,
      published: req.body.published === 'on' ? true : false,
    });
    res.redirect('/articles');
  });

  router.post('/:url/edit', async (req, res) => {
    const title = he.encode(req.body.title.trim());
    const url = he.encode(req.body.url.trim());
    const content = he.encode(req.body.content.trim());

    await Article.findOneAndUpdate(
      { url: req.params.url },
      {
        $set: {
          title,
          content,
          url,
          published: req.body.published === 'on' ? true : false,
        },
      }
    );
    res.redirect('/articles');
  });

  router.post('/:url/delete', async (req, res) => {
    await Article.findOneAndDelete({ url: req.params.url });
    res.redirect('/articles');
  });

  return router;
};
