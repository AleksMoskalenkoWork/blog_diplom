const express = require('express');
const router = express.Router();
const he = require('he');
const Comment = require('../schema/comment');
const Article = require('../schema/article');
const { text } = require('body-parser');

module.exports = function () {
  router.post('/:url/comments', async (req, res) => {
    try {
      const url = req.params.url;
      const author = req.session.userId;
      const article = await Article.findOne({ url });
      const comments = await Comment.find({ article: article._id }).populate(
        'author'
      );

      if (!req.body.comment || !req.body.comment.trim()) {
        return res.render('article', {
          article,
          comments,
          error: 'Comment field cannot be empty.',
        });
      }

      await Comment.insertOne({
        author,
        article: article._id,
        text: req.body.comment.trim(),
      });

      res.redirect('/');
    } catch (error) {
      res.status(500).send('Server error');
    }
  });

  return router;
};
