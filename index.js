require('dotenv').config();
const express = require('express'),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  session = require('express-session'),
  passport = require('passport'),
  auth = require('./middleware/authentication'),
  validate = require('./middleware/validate'),
  controller = require('./controllers/index');

const app = express(),
  { PORT, SESSION_SECRET } = process.env;

app.use(
  session({
    secret: SESSION_SECRET,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(passport.initialize());
app.use(passport.session());

require('./middleware/passport')(passport);

/////////// API ENDPOINTS \\\\\\\\\\\
app.post('/api/login', controller.login);
app.post('/api/register', validate.registration, controller.register);
app.get('/api/:employee', auth.isLoggedIn, controller.getEmployee);

/////////// ROUTE ENDPOINTS \\\\\\\\\\\
app.get('/', function(req, res) {
  res.render('./home.ejs');
});

app.get('/login', function(req, res) {
  res.render('./login.ejs');
});

app.get('/register', function(req, res) {
  res.render('./register.ejs');
});

app.listen(PORT, function() {
  console.log('Listening on Port: 4000');
});
