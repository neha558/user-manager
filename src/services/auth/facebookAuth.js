/* eslint-disable no-console */
import models from 'models';
import logger from 'appConfig/logger';
import bcrypt from 'bcrypt';
import { cloneDeep } from 'lodash';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from 'config';
import { EXPIRES_IN, SALT_ROUND, CHARACTERS } from 'utils/constants';
import { emailDuplicationMessage } from 'utils/commons';

import publishToKafka from '../../kafka/publisher/publishToKafka';

const FacebookStrategy = require('passport-facebook').Strategy;

const generateString = (length, userName) => {
  let result = '';
  const charactersLength = CHARACTERS.length;
  for (let i = 0; i < length; i += 1) {
    result += CHARACTERS.charAt(
      Math.floor(Math.random() * charactersLength),
    );
  }
  return userName + result;
};

const checkUserName = (userName) =>
  models.Username.count({
    where: { userName },
  }).then((count) => {
    if (count) {
      return userName;
    }
    return generateString(5, userName);
  });

const saveUserName = (userData) => {
  logger.message(`Executing saveUserName`);
  return new Promise((resolve, reject) => {
    models.Username.create(userData)
      .then((createUserName) => {
        logger.message(`successfully execute saveUserName`);
        resolve(createUserName);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing saveUserName ${error}`,
        );
        reject(error);
      });
  });
};

const checkEmailExits = (email) =>
  models.User.findOne({
    where: { email },
  }).then((userObject) => userObject);

const generateToken = async (user) => {
  const token = await jwt.sign({ user }, config.get('TOKEN_SECRET'), {
    expiresIn: EXPIRES_IN, // expires in 60 days
  });
  return token;
};

const createUser = async (profile, accessToken) => {
  try {
    const dataObject = cloneDeep(profile);
    dataObject.password = await bcrypt.hash(accessToken, SALT_ROUND);
    const userName = await checkUserName(
      dataObject?.emails[0].value.split('@')[0],
    );
    const user = await models.User.create({
      facebookId: dataObject.id,
      firstName: dataObject?.name?.givenName,
      lastName: dataObject?.name?.familyName,
      email: dataObject?.emails[0].value,
      userName:
        dataObject.userName === undefined
          ? userName
          : dataObject.userName,
      password: dataObject.password,
      verifyByEmail: new Date(),
      areTermsAccepted: true,
    });
    saveUserName({
      userId: user.userId,
      userName: user.userName,
    });

    publishToKafka('USER-NOTIFICATION', user, 'CREATE');
    const token = await generateToken(user);
    return Promise.resolve(token);
  } catch (error) {
    logger.message(
      `Error occurred createUser social auth while fetching ${error}`,
    );
    return Promise.reject(error);
  }
};

const facebookAuth = (authType) => {
  const facebookOptions = {
    clientID: config.get('clientID'),
    clientSecret: config.get('clientSecret'),
    callbackURL: config.get('callbackURL'),
    profileFields: ['id', 'email', 'name'],
  };

  const facebookCallback = async (
    accessToken,
    refreshToken,
    profile,
    done,
  ) => {
    logger.message('init facebook login');
    let token;
    try {
      const user = await models.User.findOne({
        where: { facebookId: profile.id },
      });
      logger.message(`Executing facebookCallback`);
      if (user !== null) {
        if (user.isSuspended) {
          const error = 'Your account has been suspended by admin';
          done(null, { error });
        }
        logger.message(
          `Executing facebookCallback user found successfully`,
        );
        token = await generateToken(user);
        console.log('Login success', token);
        done(null, { token });
      } else {
        logger.message(
          `Executing facebookCallback not user found request for create new user`,
        );
        const isEmailExists = await checkEmailExits(
          profile.emails[0].value,
        );
        if (isEmailExists !== null) {
          logger.message(`Email already exists`);
          const error = emailDuplicationMessage(isEmailExists);
          done(null, { error });
        } else {
          logger.message(`Executing googleCallback token generated`);
          token = await createUser(profile, accessToken);
          done(null, { token });
        }
      }
    } catch (error) {
      logger.message(
        `Error occurred while fetching facebookCallback ${error}`,
      );
    }
  };
  passport.use(
    new FacebookStrategy(facebookOptions, facebookCallback),
  );

  if (authType === 'signup') {
    return passport.authenticate('facebook', {
      scope: 'email',
    });
  }
  return passport.authenticate('facebook', {
    failureRedirect: config.get('callbackFailureURL'),
  });
};

module.exports = facebookAuth;
