require('dotenv').config();
const express = require('express'),
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  users = require('./mockDB'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

const app = express(),
  { PORT } = process.env;

app.use(bodyParser());
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

/////////// PASSPORT STRATEGY \\\\\\\\\\\
// require('./config/passport')(passport);
passport.use(
  'login',
  new LocalStrategy({ usernameField: 'employee_id' }, function(
    employee_id,
    password,
    done
  ) {
    const matchedUser = users.find(function(user) {
      return user.employee_id === employee_id && user.password === password;
    });

    return matchedUser
      ? done(null, true)
      : done(null, false, { message: 'Incorrect username or password.' });
  })
);

passport.use(
  'register',
  new LocalStrategy({ usernameField: 'employee_id' }, function(
    employee_id,
    password,
    done
  ) {
    const matchedUser = users.find(function(user) {
      return user.employee_id === employee_id;
    });

    return !matchedUser
      ? done(null, false, { message: 'Employee ID is already taken.' })
      : done(null, true);
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
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

app.post('/api/register', function(req, res, next) {
  const { employee_id, password, role } = req.body;

  if (employee_id && employee_id.length > 0) {
    passport.authenticate('register', function(err, user) {
      if (err) {
        console.error(err);
        return next(err);
      }

      if (!user) {
        const newUser = new Object({
          id: users.length + 1,
          employee_id: employee_id,
          password: password,
          role: role
        });

        users.push(newUser);
        return res.redirect('/');
      }

      return res.redirect('/register');
    })(req, res, next);
  } else {
    res.status(400).redirect('/register');
  }
});

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
