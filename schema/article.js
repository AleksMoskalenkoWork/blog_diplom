const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, maxlength: 100, required: true },
    url: { type: String, maxlength: 20, required: true, unique: true },
    content: { type: String, maxlength: 500 },
    published: { type: Boolean, default: true, required: true },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;
