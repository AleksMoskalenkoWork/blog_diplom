const express = require('express');
const Article = require('../schema/article');
const router = express.Router();

module.exports = function () {
  router.get('/', async (req, res) => {
    const articles = await Article.find({ published: true });
    res.render('home', { articles });
  });

  // router.get("/article/:url", async (req, res) => {
  //   // const article = await articlesCollection.findOne({ url: req.params.url });
  //   res.render("article", { article });
  // });

  return router;
};
