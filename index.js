const users = [
  { id: 1, username: 'courtman', password: '123456' },
  { id: 2, username: 'terder', password: 'tulips' },
  { id: 3, username: 'danielle', password: 'garfield' }
];

require('dotenv').config();

const express = require('express'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

const app = express(),
  { PORT } = process.env;

app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());

/////////// PASSPORT STRATEGY \\\\\\\\\\\
passport.use(
  new LocalStrategy(function(username, password, done) {
    const matchedUser = users.find(function(user) {
      return user.username === username && user.password === password;
    });

    if (matchedUser) return done(null, true);
    return done(null, false, { message: 'Incorrect username or password' });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/////////// PASSPORT ROUTES \\\\\\\\\\\
app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

// app.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user) {
//     if (err) return next(err);
//     if (!user) return res.redirect('/login');
//     return res.redirect('/');
//   })(req, res, next);
// });

/////////// ROUTES \\\\\\\\\\\
app.get('/', function(req, res) {
  res.render('./home.ejs');
});

app.get('/login', function(req, res) {
  res.render('./login.ejs');
});

/////////// ENDPOINTS \\\\\\\\\\\
app.get('/api/user', function(req, res) {
  res.status(200).send('User is Courtman!');
});

app.post('/api/user', function(req, res) {
  res.sendStatus(202);
});

app.listen(PORT, function() {
  console.log('Listening on Port: 4000');
});
