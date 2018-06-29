const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const qdStrategy = require('passport-42').Strategy;
const githubStrategy = require('passport-github2').Strategy;
const passportJWT = require('passport-jwt');
const readchunk = require('read-chunk');
const isPng = require('is-png');
const isJpg = require('is-jpg');

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

  // LOCAL sign-up
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
    passReqToCallback: true, // allows us to pass back the entire request to the callback
  },
    ((req, email, password, done) => {
      process.nextTick(() => {
        User.findOne({ email: req.body.email }, (err, user) => {
          if (err) { return done(err); }
          if (user) {
            return done(null, false, 'That email is already taken.');
          }
          User.findOne({ name: req.body.name }, (err, user) => {
            if (err) { return done(err); }
            if (user) {
              return done(null, false, 'That login is already taken.');
            }
            const newUser = new User();
            newUser.email = req.body.email;
            newUser.firstname = req.body.firstname;
            newUser.lastname = req.body.lastname;
            newUser.name = req.body.name;
            newUser.auth = 'local';
            newUser.password = newUser.generateHash(req.body.password);
            if (req.file) {
              if (fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
                const type = readchunk.sync(`${__dirname}/../uploads/${req.file.filename}`, 0, 8);
                if (!isPng(type) && !isJpg(type)) {
                  fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
                    if (err) throw err;
                  });
                  return done(null, false, 'Incorrect picture file.');
                }

                const ext = isJpg(type) ? 'jpg' : 'png';
                newUser.picture = `http://localhost:5000/uploads/${req.body.name}.${ext}`;
                fs.rename(`${__dirname}/../uploads/${req.file.filename}`, `${__dirname}/../uploads/${req.body.name}.${ext}`, (err) => {
                  if (err) throw err;
                });
              }
            }
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
      User.findOne({ name: req.body.name }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false, 'No user found.'); }
        if (!user.validPassword(password, user.password)) { return done(null, false, 'Oops! Wrong password.'); }
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
        User.findOne({ idauth: profile.id }, (err, user) => {
          if (err) { return done(err); }
          if (user) {
            return done(null, user);
          }
            User.findOne({ name: profile.nickname || profile.displayName }, (err, user) => {
                if (user) {
                    return done('user name already used');
                }
                User.findOne({email: profile.emails[0].value}, (err, user) => {
                    if (user) {
                        return done('email already used');
                    }
                    const newUser = new User();
                    newUser.idauth = profile.id;
                    newUser.token = token;
                    newUser.name = profile._json.nickname || profile.displayName;
                    newUser.firstname = profile.name.givenName;
                    newUser.lastname = profile.name.familyName;
                    newUser.email = profile.emails[0].value;
                    newUser.picture = profile.photos[0].value;
                    newUser.auth = 'google';
                    newUser.save((err) => {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                })
            })
        });
      });
    })));

  // github
  passport.use(new githubStrategy({
    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL,
  },
  (token, refreshToken, profile, done) => {
    process.nextTick(() => {
      User.findOne({ idauth: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
        User.findOne({ name: profile.displayName || profile.username }, (err, user) => {
          if (user) {
            return done('user name already used');
          }
          User.findOne({ email: profile._json.email }, (err, user) => {
            if (user) { return done('email already used'); }
            const newUser = new User();
            newUser.idauth = profile.id;
            newUser.token = token;
            newUser.firstname = '';
            newUser.lastname = profile.name;
            newUser.name = profile.displayName || profile.username;
            newUser.email = profile._json.email;
            newUser.picture = profile.photos[0].value;
            newUser.auth = 'github';
            newUser.save((err) => {
              if (err) throw err;
              return done(null, newUser);
            });
          });
        });
      });
    });
  }));

  // 42
  passport.use(new qdStrategy({
    clientID: configAuth.qdAuth.clientID,
    clientSecret: configAuth.qdAuth.clientSecret,
    callbackURL: configAuth.qdAuth.callbackURL,
  },
    ((token, refreshToken, profile, done) => {
      process.nextTick(() => {
        User.findOne({ idauth: profile.id }, (err, user) => {
          if (err) { return done(err); }
          if (user) {
            return done(null, user);
          }
            User.findOne({ name: profile.username }, (err, user) => {
                if (user) {
                    return done('user name already used');
                }
                User.findOne({email: profile.emails[0].value}, (err, user) => {
                    if (user) {
                        return done('email already used');
                    }
                    const newUser = new User();
                    newUser.idauth = profile.id;
                    newUser.token = token;
                    newUser.name = profile.username;
                    newUser.firstname = profile.name.givenName;
                    newUser.lastname = profile.name.familyName;
                    newUser.email = profile.emails[0].value;
                    newUser.picture = profile.photos[0].value;
                    newUser.auth = 'qd';
                    newUser.save((err) => {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                })
            })
        });
      });
    })));

  passport.use(new jwtstrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtsecret,
  }, (jwtPayload, cb) => {
    User.findById(jwtPayload._id, (err, user) => {
      if (err) { return cb(err, { login: false }); }
      if (!user) { return cb('fail', { login: false }); }
      const { name, picture, email, firstname, lastname, auth, _id, language } = user;
      if (!name || !picture || !email || !firstname || !lastname) { return cb(null, { name, email, picture, firstname, lastname, auth, _id, language, profile: false, login: true }); }
      return cb(null, { name, email, picture, firstname, lastname, auth, _id, language, profile: true, login: true });
    });
  }));
};
