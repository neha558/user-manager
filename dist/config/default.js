"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

module.exports = {
  port: process.env.PORT,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  },
  logLevel: process.env.LOGLEVEL,
  db: {
    host: process.env.DB_HOST,
    databaseName: process.env.DB_NAME,
    databaseUser: process.env.DB_USER_NAME,
    databasePassword: process.env.DB_USER_PASSWORD,
    dialect: 'postgres'
  },
  dsn: process.env.SENTRY_DSN,
  TOKEN_SECRET: process.env.TOKEN_SECRET,
  otpExpiryDuration: process.env.OTP_EXPIRY_DURATION_MINS || 5,
  verificationLinkExpiryDuration: process.env.VERIFICATION_LINK_EXPIRY_DURATION_HRS || 24,
  adminEmailId: process.env.ADMIN_EMAIL || 'publicpoll.co.in@gmail.com',
  emailVerificationUrl: process.env.EMAIL_VERIFICATION_URL || 'http://localhost:3000/verify',
  forgotPasswordVerificationUrl: process.env.FORGOT_PASSWORD_VERIFICATION_URL || 'http://localhost:3000/verify',
  kafkaHost: process.env.KAFKA_ENDPOINT || 'localhost:9092',
  // Should be a string of length 32
  cursorEncryptionSecret: process.env.CURSOR_SECRET || 'bl86odo32bmgcyb8obg30lqm3es21j5n',
  IMAGE_URL: process.env.IMAGE_URL || 'https://dev.publicpoll.com',
  loggingMedium: process.env.LOGGING_MEDIUM || 'console',
  logGroupName: process.env.LOG_GROUP || 'public-poll-dev',
  awsRegion: process.env.AWS_REGION || 'us-east-1',
  clientID: process.env.FACEBOOK_CLIENT_ID || '223091173053933',
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '3e64a911588a5c00f3d447611869985a',
  callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3005/user-manager/auth/facebook/callback',
  callbackFailureURL: process.env.FACEBOOK_FAILURE_REDIRECT || 'https://develop.publicpoll.com/login',
  googleClientID: process.env.GOOGLE_CLIENT_ID || '278644148512-0bpvktsv5g7t1pnunv6h09csl2umeqg8.apps.googleusercontent.com',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '0hil5kutn8fC0_HCbb3NUiqF',
  googleCallbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3005/user-manager/auth/google/callback',
  googleCallbackFailureURL: process.env.GOOGLE_FAILURE_REDIRECT || 'https://develop.publicpoll.com/login',
  adminEmail: process.env.ADMIN_UNIQUE_EMAIL || 'admin@gmail.com',
  adminMobileNumber: process.env.ADMIN_MOBILE_NUMBER || '9898989898',
  adminUserName: process.env.ADMIN_USERNAME || 'admin',
  redisPort: process.env.REDIS_PORT || '6379',
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPassword: process.env.REDIS_PASSWORD || ''
};