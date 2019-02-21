const users = [
  { id: 1, employee_id: '1111', password: '123', role: 'owner' },
  { id: 2, employee_id: '1112', password: 'tulips', role: 'manager' },
  {
    id: 3,
    employee_id: '1113',
    password: 'garfield',
    role: 'transmission mechanic'
  },
  {
    id: 4,
    employee_id: '1114',
    password: 'toystory',
    role: 'auto-body technician'
  }
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
  new LocalStrategy({ usernameField: 'employee_id' }, function(
    employee_id,
    password,
    done
  ) {
    const matchedUser = users.find(function(user) {
      return user.employee_id === employee_id && user.password === password;
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

/////////// PASSPORT ENDPOINT \\\\\\\\\\\
app.post(
  '/api/login',
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

app.get('/register', function(req, res) {
  res.render('./register.ejs');
});

/////////// ENDPOINTS \\\\\\\\\\\
app.get('/api/user', function(req, res) {
  res.status(200).send('User is Courtman!');
});

app.listen(PORT, function() {
  console.log('Listening on Port: 4000');
});
