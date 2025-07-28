const express = require('express');
const User = require('../schema/user');
const Article = require('../schema/article');
const Comment = require('../schema/comment');
const router = express.Router();

module.exports = function () {
  router.get('/dashboard', async (req, res) => {
    try {
      res.redirect('/dashboard/users');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/dashboard/users', async (req, res) => {
    try {
      const users = await User.find();
      res.render('tab-users', {
        users,
        action: '/update-user',
      });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/dashboard/articles', async (req, res) => {
    try {
      const articles = await Article.find();
      res.render('tab-articles', { articles, action: '/update-article' });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/dashboard/comments', async (req, res) => {
    try {
      const comments = await Comment.find().populate('author article');
      res.render('tab-comments', { comments, action: '/update-comment' });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/update-user', async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            isAdmin: req.body.isAdmin === 'true' ? true : false,
          },
        }
      );
      res.redirect('/dashboard');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/update-article', async (req, res) => {
    try {
      await Article.findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            published: req.body.published === 'true' ? true : false,
          },
        }
      );
      res.redirect('/dashboard/articles');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.post('/update-comment', async (req, res) => {
    console.log('Update Comment:', req.body);

    try {
      await Comment.findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            visible: req.body.visible === 'true' ? true : false,
          },
        }
      );
      res.redirect('/dashboard/comments');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
};
