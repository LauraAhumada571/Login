const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user');

passport.serializeUser ((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    //Google start
    callbackURL: '/user/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret

    }, function(accessToken, refreshToken, profile, done){
        //User already exists DB
        User.findOne({token: profile.id}).then((currentUser) => {
            if(currentUser){
                done (null, currentUser);
            }else{
                if(/^[a-zA-Z]+@correo.udistrital.edu.co*/.test(profile._json.email)){
                    new User({
                        token: profile.id,
                        name: profile.name.givenName,
                        last_name: profile.name.familyName, 
                        email: profile._json.email,
                        rol: "estudiante"
            
                    }).save(). then((newUser) => {
                        done(null, newUser);
                    });
                }else{
                    done (null, null, {message: 'Correo institucional invalido'});
                }
                
            }
        })
    }
))    


module.exports = function(passport){
    passport.use(
        new LocalStrategy ({usernameField: 'email'}, (email,password, done) => {
        //Match User
        User.findOne({ 
            email: email
        }).then(user =>{
            let err = [];
            if (!user) {
                return done (null, false, { message: 'Usuario no registrado'});
            }

                //Math password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                if (isMatch){
                    return done(null, user);
                } else {
                    return done (null, false, {message: 'Contraseña incorrecta'});
                }
               });
            })
            .catch (err => console.log(err));
        })
    );

    passport.serializeUser ((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err,user);
        });
    });
}