const express = require('express');
const router = express.Router();
const he = require('he');
const Comment = require('../schema/comment');
const Article = require('../schema/article');

module.exports = function () {
  router.post('/:url/comments', async (req, res) => {
    try {
      const url = req.params.url;
      const author = req.session.userId;
      const article = await Article.findOne({ url });

      await Comment.insertOne({
        author,
        article: article._id,
        text: he.encode(req.body.comment.trim()),
      });

      res.redirect('/articles');
    } catch (error) {
      res.status(500).send('Server error');
    }
  });

  return router;
};
