import models from 'models';
import logger from 'appConfig/logger';
import bcrypt from 'bcrypt';
import { cloneDeep } from 'lodash';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from 'config';
import { EXPIRES_IN, SALT_ROUND, CHARACTERS } from 'utils/constants';
import { emailDuplicationMessage } from 'utils/commons';
import ROLES from '../../constant/roles';

import publishToKafka from '../../kafka/publisher/publishToKafka';

const GoogleStrategy = require('passport-google-oauth')
  .OAuth2Strategy;

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
    const newUserName =
      count === 0 ? userName : generateString(5, userName);
    return newUserName;
  });

const checkEmailExits = (email) =>
  models.User.findOne({
    where: { email },
  }).then((userObject) => userObject);

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

const generateToken = async (user) => {
  const userObject = user.get({ plain: true });

  if (
    userObject.email === config.get('adminEmail') ||
    userObject.mobileNumber === config.get('adminMobileNumber') ||
    userObject.userName === config.get('adminUserName')
  ) {
    userObject.roles = [ROLES.ADMIN];
  }
  const token = await jwt.sign(
    { user: userObject },
    config.get('TOKEN_SECRET'),
    {
      expiresIn: EXPIRES_IN, // expires in 60 days
    },
  );
  return token;
};

// eslint-disable-next-line no-unused-vars
const createUser = async (profile, accessToken) => {
  try {
    const dataObject = cloneDeep(profile);
    dataObject.password = await bcrypt.hash(accessToken, SALT_ROUND);
    const userName = await checkUserName(
      dataObject?.emails[0].value.split('@')[0],
    );
    const user = await models.User.create({
      googleId: dataObject.id,
      firstName: dataObject?.name?.givenName
        ? dataObject?.name?.givenName
        : 'Google',
      lastName: dataObject?.name?.familyName
        ? dataObject?.name?.familyName
        : 'User',
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

const googleAuth = (authType) => {
  const googleOptions = {
    clientID: config.get('googleClientID'),
    clientSecret: config.get('googleClientSecret'),
    callbackURL: config.get('googleCallbackURL'),
    profileFields: ['id', 'email', 'name'],
  };

  const googleCallback = async (
    accessToken,
    refreshToken,
    profile,
    done,
  ) => {
    let token;
    try {
      const user = await models.User.findOne({
        where: { googleId: profile.id },
      });
      logger.message(`Executing googleCallback`);
      if (user !== null) {
        if (user.isSuspended) {
          const error = 'Your account has been suspended by admin';
          done(null, { error });
        }
        logger.message(
          `Executing googleCallback user found successfully`,
        );
        token = await generateToken(user);
        done(null, { token });
      } else {
        logger.message(
          `Executing googleCallback not user found request for create new user`,
        );
        const isEmailExists = await checkEmailExits(
          profile.emails[0].value,
        );

        if (isEmailExists !== null) {
          logger.message(
            `Email ${profile.emails[0].value} already exists`,
          );
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
        `Error occurred while fetching googleCallback ${error}`,
      );
    }
  };
  passport.use(new GoogleStrategy(googleOptions, googleCallback));

  if (authType === 'signup') {
    return passport.authenticate('google', {
      scope: ['email', 'profile'],
    });
  }
  return passport.authenticate('google', {
    failureRedirect: config.get('callbackFailureURL'),
  });
};

module.exports = googleAuth;
