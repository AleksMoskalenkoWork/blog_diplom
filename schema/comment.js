const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'articles',
    },
    visible: { type: Boolean, default: true },
    text: { type: String },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

const Comment = mongoose.model('comments', commentSchema);

module.exports = Comment;
