const config = require("config");
const bodyParser = require("body-parser");
const sessionMiddleware = require("./db/session");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const connectDB = require("./db/db");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");
app.use(cors());
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  morgan("tiny", {
    skip: (req) => req.url.startsWith("/.well-known"),
  })
);

app.use((req, res, next) => {
  app.locals.user = req.session?.user || null;
  app.locals.email = req.session?.email || null;
  next();
});

connectDB().then(() => {
  app.use("/", require("./routes/auth")());
  app.use("/", require("./routes/index")());
  app.use("/", require("./routes/dashboard")());

  app.listen(config.port, () => {
    console.log("Сервер запущено на http://localhost:" + config.port);
  });
});
