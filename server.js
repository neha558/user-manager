import express from 'express';
import controllers from 'controllers/index';
import logger from 'appConfig/logger';
import models from 'models';
import dotenv from 'dotenv';
import fileupload from 'express-fileupload';
import cors from 'cors';

import passport from 'passport';
import socket from 'socket.io';

// eslint-disable-next-line import/named
import facebookAuth from './src/services/auth/facebookAuth';
import googleAuth from './src/services/auth/googleAuth';

import createKafkaTopics from './src/kafka/createKafkaTopics';

const app = express();

// Passport session setup.
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(passport.initialize());
// app.use(passport.session());

dotenv.config();

app.use(express.json());

app.use(fileupload());

app.use(cors());
// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Setting middleware for static resources
app.use(express.static('public'));

// Application health end point
app.get('/user-manager/health', (req, res) => {
  const healthStatus = { status: 'UP' };
  models.sequelize
    .authenticate()
    .then(() => {
      healthStatus.status = 'UP';
      return res.send(healthStatus);
    })
    .catch((error) => {
      healthStatus.status = 'Down';
      healthStatus.error = error;
      return res.status(503).send(healthStatus);
    });
});

// BEING FACEBOOK LOGIN ROUTES
app.get('/user-manager/auth/facebook', facebookAuth('signup'));

app.get(
  '/user-manager/auth/facebook/callback',
  facebookAuth('callback'),
  (req, res) => {
    const response = req.user?.token
      ? `?token=${req.user?.token}`
      : `?error=${req.user?.error}`;
    res.redirect(`${process.env.CALLBACK_REDIRECT_URL}${response}`);
  },
);
// ENDING FACEBOOK LOGIN ROUTES

// BEING GOOGLE LOGIN ROUTES
app.get('/user-manager/auth/google', googleAuth('signup'));

app.get(
  '/user-manager/auth/google/callback',
  googleAuth('callback'),
  (req, res) => {
    const response = req.user?.token
      ? `?token=${req.user?.token}`
      : `?error=${req.user?.error}`;
    res.redirect(`${process.env.CALLBACK_REDIRECT_URL}${response}`);
  },
);
// ENDING GOOGLE LOGIN ROUTES

// Loading all the routes
app.use('/user-manager/v1', controllers);

app.use((req, res) => {
  logger.message(
    `Route not found in user-manager ${req.originalUrl} for method ${req.method}`,
  );
  res
    .status(404)
    .json({ error: `Cannot ${req.method} ${req.originalUrl}` });
});

// Default 500 is returned if the route is not available
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error.statusCode && error.title) {
    res.status(error.statusCode).json({
      error: {
        title: error.title,
        description: error.description,
      },
    });
  } else {
    logger.message(
      `Uncaught error occurred status : 500 ${error?.stack}`,
      'error',
    );
    res.status(500).json({
      error: {
        title: 'Request timed out',
        description: 'Request has timed out, please try again',
      },
    });
  }
});

models.sequelize.sync({ force: false }).catch((error) => {
  logger.message(
    `Error occurred while connecting to database ${
      error.stack || error
    }`,
  );
  process.exit();
});

// Function to start express server
const startServer = () =>
  app.listen(process.env.PORT, () => {
    createKafkaTopics();
    logger.message(
      `User Manager Running on port ${process.env.PORT} environment is ${process.env.NODE_ENV}`,
    );
  });

// This function is not used much, it can be used in test-cases when server is mocked
const stopServer = () => {
  app.close(() => {
    process.exit();
  });
};

// Start the server
const server = startServer();

const io = socket(server, {
  path: '/user-manager/socket.io',
  cors: {
    origin: '*',
  },
});

app.set('io', io);

// On connection join room of all people you follow
io.on('connection', (socketInstance) => {
  // eslint-disable-next-line no-underscore-dangle
  const userId = socketInstance?.request?._query?.userId;
  if (userId) {
    // Connected user joins their own room because, in case of multiple tabs,
    // we can simply send the data to these rooms thus providing real time
    // notification to all the tabs
    logger.message(`Received connection request from user ${userId}`);
    socketInstance.join(`session-of-${userId}`);
  }
});

/**
 *  We are exporting start and stop server so that this
 * can be accessed by test cases to mock the server
 * */
module.exports = {
  startServer,
  stopServer,
};
