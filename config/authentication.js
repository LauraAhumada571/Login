module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error', 'Por favor inicie sesión');
      res.redirect('/user/login');
    }
  };