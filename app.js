const config = require('config');
const bodyParser = require('body-parser');
const sessionMiddleware = require('./db/session');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./db/db');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(`${__dirname}/assets`));
app.use(cors());
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  morgan('tiny', {
    skip: (req) => req.url.startsWith('/.well-known'),
  })
);

app.use((req, res, next) => {
  res.locals.username = req.session?.username || null;
  res.locals.email = req.session?.email || null;
  res.locals.isAdmin = req.session?.isAdmin || null;
  next();
});

connectDB().then(() => {
  app.use('/', require('./routes/auth')());
  app.use('/', require('./routes/home')());
  app.use('/', require('./routes/dashboard')());
  app.use('/articles', require('./routes/articles')());
  app.use('/', require('./routes/comments')());

  app.listen(config.port, () => {
    console.log('Server run on http://localhost:' + config.port);
  });
});
