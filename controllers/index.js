const employees = require('../mockDB'),
  passport = require('passport');

module.exports = {
  login: function(req, res, next) {
    passport.authenticate('login', function(err, employee) {
      if (err) {
        console.error(err);
        return next(err);
      }

      if (employee) {
        req.login(employee, function(err) {
          if (err) {
            console.error(err);
            return next(err);
          }
          res.redirect(`/api/${employee.employee_id}`);
        });
      } else {
        res.status(401);
        res.render('./login.ejs');
      }
    })(req, res, next);
  },
  register: function(req, res, next) {
    const { employee_id, password, role } = req.body;

    passport.authenticate('register', function(err, employee) {
      if (err) {
        console.error(err);
        return next(err);
      }

      if (!employee) {
        console.log('hit');
        const newEmployee = new Object({
          id: employees.length + 1,
          employee_id: employee_id,
          password: password,
          role: role
        });

        employees.push(newEmployee);

        req.login(newEmployee, function(err) {
          if (err) {
            console.error(err);
            return next(err);
          }
          res.redirect(`/api/${newEmployee.employee_id}`);
        });
      } else {
        res.status(400);
        res.render('./register.ejs');
      }
    })(req, res, next);
  },
  getEmployee: function(req, res) {
    const { employee } = req.params,
      { user } = req.session.passport;

    if (employee === user) {
      const matchedEmployee = employees.find(function(_employee) {
        return _employee.employee_id === employee;
      });
      res.status(200).json(matchedEmployee);
    } else {
      res.sendStatus(403);
    }
  }
};
