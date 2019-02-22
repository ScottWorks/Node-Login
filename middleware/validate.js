module.exports = {
  registration: function(req, res, next) {
    const { employee_id, password, role } = req.body;

    if (employee_id && password && role) {
      if (employee_id.length > 0 && password.length > 0 && role.length > 0) {
        return next();
      }
    } else {
      return res.status(400).redirect('/register');
    }
  }
};
