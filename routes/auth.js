const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../schema/user");
const config = require("config");

module.exports = function () {
  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.get("/signin", (req, res) => {
    res.render("signin");
  });

  router.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  });

  router.get("/forgot-password", (req, res) => {
    res.render("forgot-password");
  });

  router.get("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.render("reset-password", {
        error: "Недійсне або прострочене посилання",
      });
    }

    res.render("reset-password", { token });
  });
  // api
  router.post("/signin", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.render("signin", { error: "Емейл вже зареєстровано" });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      await User.insertOne({
        username,
        email,
        password: hashPassword,
      });
      req.session.user = username;
      req.session.email = email;
      res.redirect("/dashboard");
    } catch (error) {
      res.status(500).send("Server error");
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (
        user &&
        (await bcrypt.compare(password, user.password)) &&
        !user.isAdmin
      ) {
        req.session.user = user.username;
        req.session.email = user.email;
        return res.redirect("/");
      } else {
        req.session.user = user.username;
        req.session.email = user.email;
        res.redirect("/dashboard");
      }

      res.status(401).json({ message: "Невірний логін або пароль" });
    } catch (error) {
      res.status(500).send("Server error");
    }
  });

  router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        error: "Користувача з таким email не знайдено",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 1000 * 60 * 30;

    await User.updateOne(
      { email },
      { $set: { resetToken: token, resetExpires: expires } }
    );

    const resetLink = `http://localhost:${config.port}/reset-password/${token}`;

    console.log("Відновлення пароля:", resetLink);

    res.render("forgot-password", {
      message: "Посилання для відновлення надіслано",
    });
  });

  router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({
        error: "Недійсне або прострочене посилання",
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

    res.redirect("/login");
  });

  return router;
};
