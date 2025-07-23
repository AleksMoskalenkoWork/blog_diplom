const config = require('config');
const bodyParser = require('body-parser');
const sessionMiddleware = require('./db/session');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./db/db');

const app = express();

app.use(cors());
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  morgan('tiny', {
    skip: (req) => req.url.startsWith('/.well-known'),
  })
);

connectDB().then(() => {
  app.use('/', require('./routes/auth')());

  app.listen(config.port, () => {
    console.log('Сервер запущено на http://localhost:' + config.port);
  });
});
