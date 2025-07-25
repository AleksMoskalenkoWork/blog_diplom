const express = require('express');
const router = express.Router();

module.exports = function () {
  router.get('/dashboard', async (req, res) => {
    // if (!req.session.user) return res.redirect("/login");

    try {
      // const users = await usersCollection.find({ role: "user" }).toArray();
      res.render('dashboard');
    } catch (err) {
      res.status(500).send('Помилка сервера');
    }
  });

  return router;
};
