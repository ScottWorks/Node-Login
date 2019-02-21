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

app.use(bodyParser.json());
app.use(passport.initialize());

/////////// PASSPORT STRATEGY \\\\\\\\\\\
passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log(username);

    const matchedUser = users.find(function(user) {
      return user.username === username && user.password === password;
    });

    if (matchedUser) return done(null, matchedUser);
    return done(null, false, { message: 'Incorrect username or password' });
  })
);

/////////// PASSPORT ENDPOINT \\\\\\\\\\\
app.post(
  '/api/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);
// app.post('/api/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user) {
//     console.log(user);

//     if (err) return next(err);

//     if (!user) return res.sendStatus(404);

//     req.logIn(user, function(err) {
//       if (err) return next(err);
//       else return res.sendStatus(200);
//     });
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
