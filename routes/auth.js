const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('config');
const User = require('../schema/user');

module.exports = function () {
  router.post('/signin', async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ error: 'Емейл вже зареєстровано' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await User.insertOne({
      username,
      email,
      password: hashPassword,
    });
    return res.json({ message: 'Ви зареєстровані в системі!' });
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({ token });
      return res.json({ message: 'Логін виконано успішно' });
    }
  });

  router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        error: 'Користувача з таким email не знайдено',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 1000 * 60 * 30;

    await User.updateOne(
      { email },
      { $set: { resetToken: token, resetExpires: expires } }
    );

    // const resetLink = `http://localhost:${config.port}/reset-password/${token}`;

    //   console.log('Відновлення пароля:', resetLink);

    res.json({ token });
  });

  router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({
        error: 'Недійсне або прострочене посилання',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: '', resetExpires: '' },
      }
    );
  });

  return router;
};
