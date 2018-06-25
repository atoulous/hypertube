const User = require('./../models/users');
const sendMail = require('./../models/sendmail');
const Secu = require('../models/secu.js');
const readchunk = require('read-chunk')
const isPng = require('is-png')
const isJpg = require('is-jpg')

const urls = 'http://5.196.225.53:8100';
const jwt = require('jsonwebtoken');

const jwtsecret = 'jwtsecretorpfkfgjehdbsqaz';
const fs = require('fs');

module.exports = (app, passport) => {

  app.post('/login', (req, res, next) => {
    passport.authenticate('local-login', { session: false }, (err, user, info) => {
      if (err) { return res.status(400).json({ merror: err, login: false }); }
      if (!user) { return res.status(400).json({ merror: 'fail to login', login: false }); }
        const token = jwt.sign(user.toJSON(), jwtsecret);
        res.cookie('authtoken', token);
        return res.json({ merror: 'success', user, login: true, token });

    })(req, res, next);
  });


  app.post('/signup', (req, res, next) => {
    if (!Secu.verif(req.body.name) || !Secu.verif(req.body.lastname) || !Secu.verif(req.body.firstname) || !Secu.verif(req.body.email) || !Secu.verif(req.body.password) || !Secu.verif(req.file)) {
      return res.json({ merror: 'Complete all sections of the form.', login: false });
    } else if (!Secu.isGoodPassword(req.body.password)) {
      res.json({ merror: 'A strong password consists of a combination of upper and lowercase letters and numbers.', login: false });
    } else if (!Secu.isEmail(req.body.email)) {
      res.json({ merror: 'Incorrect Email.', login: false });
    } else {
      passport.authenticate('local-signup', (err, user, info) => {

        if (err) { return res.json({ merror: err, login: false }); }
        if (!user) {
          return res.json({ login: false, merror: info });
        }
        const token = jwt.sign(user.toJSON(), jwtsecret);
        res.cookie('authtoken', token);
        return res.json({ merror: 'success', user, login: true, profile: true, token });
      })(req, res, next);
    }
  });

  app.get('/profile', (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
      if (err) { return res.json({ message: err, login: false }); }
      if (!user) {
        return res.json({ message: 'incorrect user', login: false });
      }
      return res.json({ message: 'success', login: true, user });
    })(req, res, next);
  });


  app.post('/profile', (req, res, next) => {
    passport.authenticate('jwt', (err, userlogin, info) => {
      let merror = ''
      if (!Secu.verif(req.body.firstname) || !Secu.verif(req.body.lastname) || !Secu.verif(req.body.email)) {
          if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
              fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
                  if (err) throw err;
              })
          }
        res.json({ merror: 'Empty form field.', change: false });
      } else if (!Secu.isEmail(req.body.email)) {
          if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
              fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
                  if (err) throw err;
              })
          }
        res.json({ merror: 'Incorrect Email.', change: false });
      } else {
        User.findOne({ name: userlogin.name }, (err, user) => {
          if (err) throw err;
          if (user) {
              User.findOne({ email: req.body.email, name: {$ne: userlogin.name}}, (err, auser) => {
                  if (err) throw err;
                  if (auser) {
                      if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
                          fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
                              if (err) throw err;
                          })
                      }
                      res.json({ merror: 'Email already used.', change: false });
                  }
                  else {
                      user.email = req.body.email;
                      user.firstname = req.body.firstname;
                      user.lastname = req.body.lastname;
                      if (Secu.verif(req.body.password)) {
                          if (user.auth !== 'local') {
                              merror = 'Only local account can change password.';
                          } else if (Secu.isGoodPassword(req.body.password)) {
                              user.password = user.generateHash(req.body.password);
                          } else {
                              merror = 'A strong password consists of a combination of upper and lowercase letters and numbers.';
                          }
                      }
                      if (req.file) {
                          if (fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
                              const type = readchunk.sync(`${__dirname}/../uploads/${req.file.filename}`, 0, 8)
                              if (!isPng(type) && !isJpg(type))
                              {
                                  fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
                                      if (err) throw err;
                                  })
                                  merror = 'Incorrect picture file.'
                              }
                              else {
                                  const ext = isJpg(type) ? 'jpg' : 'png'
                                  user.picture = `http://localhost:5000/uploads/${userlogin.name}.${ext}`;
                                  fs.rename(`${__dirname}/../uploads/${req.file.filename}`, `${__dirname}/../uploads/${userlogin.name}.${ext}`, (err) => {
                                      if (err) throw err;
                                  });
                              }
                          }
                      }
                      user.save((err) => {
                          if (err) throw err;
                          res.json({
                              message: 'success',
                              merror: merror,
                              change: true,
                              user: {
                                  auth: user.auth,
                                  login: user.login,
                                  picture: user.picture,
                                  firstname: user.firstname,
                                  lastname: user.lastname,
                                  email: user.email
                              }
                          });
                      });
                  }
              })
          } else { res.json({ message: 'Incorrect user', change: false }); }
        });
      }
    })(req, res, next);
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });


  // 42
  app.get('/auth/qd', passport.authenticate('42', { scope: ['public'] }));
  app.get('/auth/qd/callback', (req, res, next) => {
    passport.authenticate('42', (err, user, info) => {
      if (err) { return res.json({ message: err, login: false }); }
      if (!user) {
        return res.json({ message: 'incorrect user', login: false });
      }


        const token = jwt.sign(user.toJSON(), jwtsecret);
        res.cookie('authtoken', token);
        return res.redirect('http://localhost:3000/profile');

    })(req, res, next);
  });

  // github
  app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
  app.get('/auth/github/callback', (req, res, next) => {
    passport.authenticate('github', (err, user, info) => {
      if (err) {
          res.cookie('error', err);
          return res.redirect('http://localhost:3000/home');
      }
      if (!user) {
          res.cookie('error', 'no user');
          return res.redirect('http://localhost:3000/home');
      }


        const token = jwt.sign(user.toJSON(), jwtsecret);
        res.cookie('authtoken', token);
        return res.redirect('http://localhost:3000/profile');

    })(req, res, next);
  });

  // GOOGLE
  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, next) => {
      if (err) { return res.json({ message: err, login: false }); }
      if (!user) {
        return res.json({ message: 'incorrect user', login: false });
      }


        const token = jwt.sign(user.toJSON(), jwtsecret);
        res.cookie('authtoken', token);

        return res.redirect('http://localhost:3000/profile');

    })(req, res, next);
  });

  app.post('/resetpasswd', (req, res) => {
    if (!Secu.verif(req.body.code)) {
      res.json({ message: 'Incorrect code.' });
    } else if (!Secu.verif(req.body.password) || !Secu.isGoodPassword(req.body.password)) {
      res.json({ message: 'A strong password consists of a combination of upper and lowercase letters and numbers.' });
    } else {
      User.findOne({ fpassword: req.query.code }, (err, user) => {
        if (err) throw err;
        if (user) {
          user.password = user.generateHash(req.body.password);
          user.fpassword = '';
          user.save((err) => {
            if (err) throw err;
          });
            const token = jwt.sign(user.toJSON(), jwtsecret);
            res.cookie('authtoken', token);
            return res.json({ message: 'success', user, login: true, token });
        } else {
          res.json({ message: 'Incorrect code2.' });
        }
      });
    }
  });


  app.post('/fpassword', (req, res) => {
    if (!Secu.verif(req.body.name)) {
      res.json({ message: 'Error Login' });
    } else {
      let i = 0;
      let code = '';
      const tab = 'abcdefghijklmnopkrstuvwxyz1234567890';
      while (i < 10) {
        const t = Math.floor(Math.random() * (36 - 1) + 1);
        code += tab[t];
        i++;
      }
      User.findOne({ name: req.body.name, auth: 'local' }, (err, user) => {
        if (err) throw err;
        if (user) {
          user.fpassword = user.name + code;
          const message = `To reset your password, click this link :  ${urls}/resetpasswd?code=${user.name}${code}`;
          sendMail.newmail(user.email, message, 'Hypertube, reset password');
          user.save((err) => {
            if (err) throw err;
          });
          res.json({ message: 'success' });
        } else {
          res.json({ message: 'Incorrect Login' });
        }
      });
    }
  });
};
