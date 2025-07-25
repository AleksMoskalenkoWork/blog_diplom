const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
      required: true,
    },
    password: { type: String, minlength: 6, required: true },
    isAdmin: { type: Boolean, default: false },
    resetToken: { type: String, required: false, default: null },
    resetExpires: { type: Number, required: false, default: null },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  }
);

const User = mongoose.model('users', userSchema);

module.exports = User;
