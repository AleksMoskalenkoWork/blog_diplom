const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: { type: String },
    url: { type: String },
    content: { type: String },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;
