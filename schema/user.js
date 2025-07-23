const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    user: { type: String },
    email: {
      type: String,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
    },
    password: { type: String, minlength: 6, maxlength: 6 },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

const User = mongoose.model('users', userSchema);

module.exports = User;
