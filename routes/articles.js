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

  router.get('/:url', async (req, res) => {
    const article = await articlesCollection.findOne({ url: req.params.url });
    res.render('article', { article });
  });

  router.get('/:url/edit', async (req, res) => {
    const article = await articlesCollection.findOne({ url: req.params.url });

    const tags = article.tags ? article.tags.join(', ') : '';

    res.render('article-form', {
      tags,
      article,
      action: `/articles/${article.url}/edit`,
    });
  });

  //api
  router.post('/new', async (req, res) => {
    const { title, content, url, tags, published } = req.body;

    const articleTemplate = {
      title,
      content,
      url,
      published: published === 'on',
      createdAt: new Date(),
    };

    if (tags && tags.length > 0) {
      articleTemplate.tags = tags.split(',').map((tag) => tag.trim());
    }

    await articlesCollection.insertOne(articleTemplate);
    res.redirect('/articles');
  });

  router.post('/:url/edit', async (req, res) => {
    const { title, content, url, tags, published } = req.body;

    await articlesCollection.updateOne(
      { url: req.params.url },
      {
        $set: {
          title,
          content,
          url,
          tags:
            tags && tags.length > 0
              ? tags.split(',').map((tag) => tag.trim())
              : [],
          published: published === 'on',
          updatedAt: new Date(),
        },
      }
    );
    res.redirect('/articles');
  });

  router.post('/:url/delete', async (req, res) => {
    await articlesCollection.deleteOne({ url: req.params.url });
    res.redirect('/articles');
  });

  return router;
};
