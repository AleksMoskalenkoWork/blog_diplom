const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../schema/user');
const config = require('config');
const he = require('he');

module.exports = function () {
  router.get('/login', (req, res) => {
    try {
      res.render('login');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/signin', (req, res) => {
    try {
      res.render('signin');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/logout', (req, res) => {
    try {
      req.session.destroy(() => {
        res.redirect('/');
      });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/forgot-password', (req, res) => {
    try {
      res.render('forgot-password');
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/reset-password/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const user = await User.findOne({
        resetToken: token,
        resetExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.render('reset-password', {
          error: 'Недійсне або прострочене посилання',
        });
      }

      res.render('reset-password', { token });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });
  // api
  router.post('/signin', async (req, res) => {
    try {
      const email = he.encode(req.body.email.trim().toLowerCase());
      const username = he.encode(req.body.username.trim().toLowerCase());

      const user = await User.findOne({ email });

      if (user) {
        return res.render('signin', { error: 'Емейл вже зареєстровано' });
      }

      const hashPassword = await bcrypt.hash(req.body.password.trim(), 10);
      await User.insertOne({
        username,
        email,
        password: hashPassword,
      });

      req.session.username = username;
      req.session.email = email;

      return res.render('login', {
        message: 'user created successfully, please login',
      });
    } catch (error) {
      res.status(500).send('Server error');
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const email = he.encode(req.body.email.trim().toLowerCase());
      const password = he.encode(req.body.password.trim());
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.isAdmin = user.isAdmin;
        req.session.userId = user._id;

        if (user.isAdmin === true) {
          return res.redirect('/dashboard');
        }
        return res.redirect('/');
      }

      res.render('login', { error: 'Невірний логін або пароль' });
    } catch (error) {
      res.status(500).send('Server error');
    }
  });

  router.post('/forgot-password', async (req, res) => {
    const email = he.encode(req.body.email.trim().toLowerCase());
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

    const resetLink = `http://localhost:${config.port}/reset-password/${token}`;

    console.log('Відновлення пароля:', resetLink);

    res.render('forgot-password', {
      message: 'Посилання для відновлення надіслано',
    });
  });

  router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const password = he.encode(req.body.password.trim());

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
        $unset: { resetToken, resetExpires },
      }
    );

    res.redirect('/login');
  });

  return router;
};
