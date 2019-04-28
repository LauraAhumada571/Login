const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const keys = require('./config/keys');
const cookieSession = require('cookie-session'); 

const app = express();
require('./config/Database');
require('./config/passport');
require('./config/passport')(passport);

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(flash());
app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: [keys.session.cookieKey]
}))

// Express session
app.use(
  session({
    secret: 'l&lsecretjobud',
    resave: false,
    saveUninitialized: true,
  })
);

// Global vars
app.use(function(req, res, next) {
  res.locals.error_msg = req.flash('error.msg');
  res.locals.error = req.flash('error');
  next();
});

//middlewares
app.use(express.urlencoded({ extended: false}));
app.use(passport.initialize());
app.use(passport.session());

//Routes 
app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/user.js'));

//set bower_components
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('el servidor comenzo en el puerto ${PORT}'));
