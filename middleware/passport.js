const employees = require('../mockDB'),
  LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'employee_id' }, function(
      employee_id,
      password,
      done
    ) {
      const matchedEmployee = employees.find(function(employee) {
        return (
          employee.employee_id === employee_id && employee.password === password
        );
      });

      return matchedEmployee
        ? done(null, matchedEmployee)
        : done(null, false, { message: 'Incorrect employeename or password.' });
    })
  );

  passport.use(
    'register',
    new LocalStrategy({ usernameField: 'employee_id' }, function(
      employee_id,
      password,
      done
    ) {
      const matchedEmployee = employees.find(function(employee) {
        return employee.employee_id === employee_id;
      });

      return !matchedEmployee
        ? done(null, matchedEmployee)
        : done(null, false, { message: 'Employee ID is already taken.' });
    })
  );

  passport.serializeUser(function(employee, done) {
    done(null, employee.employee_id);
  });

  passport.deserializeUser(function(employeeId, done) {
    const matchedEmployee = employees.find(function(employee) {
      return employee.employee_id === employeeId;
    });

    done(null, matchedEmployee);
  });
};
