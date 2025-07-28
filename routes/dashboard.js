const express = require('express');
const User = require('../schema/user');
const router = express.Router();

module.exports = function () {
  router.get('/dashboard', async (req, res) => {
    // if (!req.session.user) return res.redirect("/login");

    try {
      const users = await User.find();
      res.render('dashboard', { users });
    } catch (err) {
      res.status(500).send('Помилка сервера');
    }
  });

  return router;
};
