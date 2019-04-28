const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/user');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Forgot-password
router.get('/forgot-password', (req, res) => res.render('forgot-password'));

// Register
router.post('/register', (req, res) => {
  const { name, last_name, email, password, password2, rol } = req.body;
  let err = [];

  // Check passwords match
    if (password != password2) {
        err.push({ msg: 'Las contraseñas no coinciden' }); 
    }

    if (err.length > 0) {
        res.render('register', {
            err
        });
    } else {
        User.findOne({ email: email }).then(user => {
        if (user) {
            err.push({ msg: 'El usuario ya existe' });
            res.render('register', {
                err, 
                password
            });
        } else {
            const newUser = new User({
                name,
                last_name,
                email,
                password,
                rol
            });
            
            newUser.password = newUser.encryptPassword(password);
            newUser.save()
                .then(user => {
                    res.redirect('/user/login');
                })
                .catch (err => console.log(err));
        }
        });
    }
});

// Login 
router.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/principal',
        failureRedirect: '/user/login',
        failureFlash: true
    }));

// Login with google+
router.get('/google', 
    passport.authenticate('google', {scope: ['profile', 'email']}));

//Redirect to callback google
router.get('/google/redirect', passport.authenticate('google'), (req, res) =>{
    //res.send(req.user);
    res.redirect('/principal');
});

//Logout
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/user/login');
});

module.exports = router;