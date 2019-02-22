const users = require('../mockDB'),
  LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
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
      let matchedUser = false;
      const validatedID = employee_id.trim();

      if (validatedID && validatedID !== '') {
        console.log('hit');
        matchedUser = users.find(function(user) {
          return user.employee_id === employee_id;
        });
      }

      console.log(matchedUser);

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
};
