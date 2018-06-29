const User = require('./../models/users');
const sendMail = require('./../models/sendmail');
const Secu = require('../models/secu.js');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const jwtsecret = 'jwtsecretorpfkfgjehdbsqaz';

module.exports = (app, passport) => {

  app.get('/checktoken', (req, res, next) => {
      passport.authenticate('jwt', (err, user, info) => {
          if (err) { return res.status(403).json({ merror: err, login: false }); }
          if (!user) {
              return res.status(403).json({ merror: 'incorrect user', login: false });
          }
          return res.json({login: true})
      })(req, res, next);
  })

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
      if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
        fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
          if (err) throw err;
        });
      }
      return res.json({ merror: 'Complete all sections of the form.', login: false });
    } else if (!Secu.isGoodPassword(req.body.password)) {
      if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
        fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
          if (err) throw err;
        });
      }
      res.json({ merror: 'A strong password consists of a combination of upper and lowercase letters and numbers.', login: false });
    } else if (!Secu.isEmail(req.body.email)) {
      if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
        fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
          if (err) throw err;
        });
      }
      res.json({ merror: 'Incorrect Email.', login: false });
    } else {
      passport.authenticate('local-signup', (err, user, info) => {
        if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
          fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
            if (err) throw err;
          });
        }
        if (err) { return res.json({ merror: err, login: false }); }
        if (!user) {
          if (req.file && fs.existsSync(`${__dirname}/../uploads/${req.file.filename}`)) {
            fs.unlink(`${__dirname}/../uploads/${req.file.filename}`, (err) => {
              if (err) throw err;
            });
          }
          return res.json({ login: false, merror: info });
        }
        const token = jwt.sign(user.toJSON(), jwtsecret);
        res.cookie('authtoken', token);
        return res.json({ merror: 'success', user, login: true, profile: true, token });
      })(req, res, next);
    }
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
        return res.redirect('http://localhost:3000/');
      }
      if (!user) {
        res.cookie('error', 'no user');
        return res.redirect('http://localhost:3000/');
      }
      const token = jwt.sign(user.toJSON(), jwtsecret);
      res.cookie('authtoken', token);
      return res.redirect('http://localhost:3000/library');
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
      res.json({ merror: 'Incorrect code.', change: false });
    } else if (!Secu.verif(req.body.password) || !Secu.isGoodPassword(req.body.password)) {
      res.json({ merror: 'A strong password consists of a combination of upper and lowercase letters and numbers.', change: false });
    } else {
      User.findOne({ fpassword: req.body.code }, (err, user) => {
        if (err) throw err;
        if (user) {
          user.password = user.generateHash(req.body.password);
          user.fpassword = '';
          user.save((err) => {
            if (err) throw err;
          });
          const token = jwt.sign(user.toJSON(), jwtsecret);
          res.cookie('authtoken', token);
          return res.json({ change: true, user, login: true, token });
        }
        res.json({ merror: 'Incorrect code.', change: false });
      });
    }
  });


  app.post('/fpassword', (req, res) => {
    if (!Secu.verif(req.body.name)) {
      res.json({ merror: 'Error Login', send: false });
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
          user.fpassword = `${user.name}${code}`;
          const message = `code : ${user.name}${code}`;
          sendMail.newmail(user.email, message, 'Hypertube, reset password');
          user.save((err) => {
            if (err) throw err;
          });
          res.json({ message: 'success', send: true });
        } else {
          res.json({ merror: 'Incorrect Login', send: false });
        }
      });
    }
  });
};
