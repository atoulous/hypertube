export default {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  localization: { timezone: process.env.TIMEZONE || 'Europe/Paris' },
  db: {
    url: process.env.DB_URL || 'mongodb://localhost:27017/hypertube',
  },
  expressSession: {
    secret: process.env.SESSION_SECRET || 'secret',
    name: process.env.SESSION_NAME || 'sessionId',
  },
  regexEmail: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  regexInput: /^[a-zA-Z0-9 _-èéêë]{3,20}$/,
  regexPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
  regexAge: /^[0-9]{1,3}$/,
  hashSalt: process.env.HASH_SALT || 10,
  jwtKey: process.env.JWT_KEY || 'secret',
};
