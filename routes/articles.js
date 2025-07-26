const express = require('express');
const Article = require('../schema/article');
const router = express.Router();
const he = require('he');

module.exports = function () {
  router.get('/', async (req, res) => {
    try {
      const userId = req.session.userId;
      const articles = await Article.find({ author: userId }).populate(
        'author'
      );
      res.render('articles', { articles });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/new', (req, res) => {
    try {
      res.render('article-form', { article: {}, action: '/articles/new' });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/:url', async (req, res) => {
    try {
      const article = await Article.findOne({ url: req.params.url });
      res.render('article', { article });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/:url/edit', async (req, res) => {
    try {
      const article = await Article.findOne({ url: req.params.url });

      res.render('article-form', {
        article,
        action: `/articles/${article.url}/edit`,
      });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/new', async (req, res) => {
    try {
      const title = he.encode(req.body.title.trim());
      const url = he.encode(req.body.url.trim());
      const content = he.encode(req.body.content.trim());
      const author = req.session.userId;

      await Article.insertOne({
        author,
        title,
        url,
        content,
        published: req.body.published === 'on' ? true : false,
      });
      res.redirect('/articles');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/:url/edit', async (req, res) => {
    try {
      const title = he.encode(req.body.title.trim());
      const url = he.encode(req.body.url.trim());
      const content = he.encode(req.body.content.trim());
      const author = req.session.userId;

      await Article.findOneAndUpdate(
        { url: req.params.url },
        {
          $set: {
            author,
            title,
            content,
            url,
            published: req.body.published === 'on' ? true : false,
          },
        }
      );
      res.redirect('/articles');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/:url/delete', async (req, res) => {
    try {
      await Article.findOneAndDelete({ url: req.params.url });
      res.redirect('/articles');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
};
