const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const qdStrategy = require('passport-42').Strategy;
const githubStrategy = require('passport-github2').Strategy;
const passportJWT = require('passport-jwt');

const jwtstrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const Secu = require('../models/secu.js');
const fs = require('fs');

const jwtsecret = 'jwtsecretorpfkfgjehdbsqaz';

const User = require('./../models/users');

const configAuth = require('./auth');

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // LOCAL sign-in
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
    ((req, email, password, done) => {
      process.nextTick(() => {
        console.log('la');
        User.findOne({ 'local.email': req.body.email }, (err, user) => {
          if (err) { return done(err); }
          if (user) {
            console.log('MAIL');
            return done(null, false, 'That email is already taken.');
          }
          User.findOne({ 'local.name': req.body.login }, (err, user) => {
            if (err) { return done(err); }
							 if (user) {
              return done(null, 'That login is already taken.');
            }
            const newUser = new User();
            newUser.local.email = req.body.email;
            newUser.local.firstname = req.body.firstname;
            newUser.local.lastname = req.body.lastname;
            newUser.local.name = req.body.login;
            newUser.local.password = newUser.generateHash(req.body.password);
            fs.rename(`${__dirname}/../uploads/${req.file.filename}`, `${__dirname}/../uploads/${req.body.login}`, (err) => {
              if (err) throw err;
            });
            newUser.local.picture = `http://localhost:5000/uploads/${req.body.login}`;
            newUser.save((err) => {
              if (err) throw err;
              return done(null, newUser, 'success');
            });
          });
        });
      });
    })));

  // LOCAL login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
    ((req, email, password, done) => {
      User.findOne({ 'local.name': req.body.name }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false, 'No user found.'); }
        if (!user.validPassword(password, user.local.password)) { return done(null, false, 'Oops! Wrong password.'); }
        return done(null, user);
      });
    })));

  // GOOGLE
  passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL,
  },
    ((token, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOne({ 'google.id': profile.id }, (err, user) => {
          if (err) { return done(err); }
          if (user) {
            return done(null, user);
          }
          const newUser = new User();
          console.log(profile);
          newUser.google.id = profile.id;
          newUser.google.token = token;
          if (profile._json.nickname) { newUser.google.name = profile._json.nickname; } else { newUser.google.name = profile.displayName; }
          newUser.google.firstname = profile.name.givenName;
          newUser.google.lastname = profile.name.familyName;
          newUser.google.email = profile.emails[0].value;
          newUser.google.picture = profile.photos[0].value;
          newUser.save((err) => {
            if (err) throw err;
            return done(null, newUser);
          });
        });
      });
    })));

  // github
  passport.use(new githubStrategy({
    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL,
  },
    ((token, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOne({ 'github.id': profile.id }, (err, user) => {
          if (err) { return done(err); }
          if (user) {
            return done(null, user);
          }
          const newUser = new User();
          console.log(profile);
          newUser.github.id = profile.id;
          newUser.github.token = token;
          newUser.github.name = profile.username;
          newUser.github.email = profile._json.email;
          newUser.github.picture = profile.photos[0].value;
          newUser.save((err) => {
            if (err) throw err;
            return done(null, newUser);
          });
        });
      });
    })));

  // 42
  passport.use(new qdStrategy({
    clientID: configAuth.qdAuth.clientID,
    clientSecret: configAuth.qdAuth.clientSecret,
    callbackURL: configAuth.qdAuth.callbackURL,
  },
    ((token, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOne({ 'qd.id': profile.id }, (err, user) => {
          if (err) { return done(err); }
          if (user) {
            return done(null, user);
          }
          const newUser = new User();
          newUser.qd.id = profile.id;
          newUser.qd.token = token;
          newUser.qd.name = profile.username;
          newUser.qd.firstname = profile.name.givenName;
          newUser.qd.lastname = profile.name.familyName;
          newUser.qd.email = profile.emails[0].value;
          newUser.qd.picture = profile.photos[0].value;
          newUser.save((err) => {
            if (err) throw err;
            return done(null, newUser);
          });
        });
      });
    })));

  passport.use(new jwtstrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtsecret,
  }, (jwtPayload, cb) => {
    User.findById(jwtPayload._id, (err, user) => {
      if (err) { return cb(err); }
      const name = user.local.name || user.google.name || user.github.name || user.qd.name;
      const picture = user.local.picture || user.google.picture || user.github.picture || user.qd.picture;
      const email = user.local.email || user.google.email || user.github.email || user.qd.email;
      const firstname = user.local.firstname || user.google.firstname || user.github.firstname || user.qd.firstname;
      const lastname = user.local.lastname || user.google.lastame || user.github.lastame || user.qd.lastname;
      if (user) { return cb(null, {name, email, picture, firstname, lastname } ); }
      return cb('fail');
    });
  }));
};
