import models from 'models';
import logger from 'appConfig/logger';
import bcrypt from 'bcrypt';
import { cloneDeep } from 'lodash';
import jwt from 'jsonwebtoken';
import config from 'config';
import { EXPIRES_IN, SALT_ROUND, CHARACTERS } from 'utils/constants';
import { emailDuplicationMessage } from 'utils/commons';
import { BadRequestException } from 'utils/exceptions';
import publishToKafka from '../../kafka/publisher/publishToKafka';
import ROLES from '../../constant/roles';

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
const createUser = async (profile, accessToken) => {
  try {
    const dataObject = cloneDeep(profile);
    dataObject.password = await bcrypt.hash(accessToken, SALT_ROUND);
    const userName = await checkUserName(
      profile?.email.split('@')[0],
    );
    let userObject;
    if (dataObject.provider === 'apple') {
      userObject = {
        appleId: dataObject.id,
        firstName: dataObject?.givenName,
        lastName: dataObject?.familyName,
        email: dataObject?.email,
        userName:
          dataObject.userName === undefined
            ? userName
            : dataObject.userName,
        password: dataObject.password,
        verifyByEmail: new Date(),
        areTermsAccepted: true,
      };
    }
    if (dataObject.provider === 'google') {
      userObject = {
        googleId: dataObject.id,
        firstName: dataObject?.givenName,
        lastName: dataObject?.familyName,
        email: dataObject?.email,
        userName:
          dataObject.userName === undefined
            ? userName
            : dataObject.userName,
        password: dataObject.password,
        verifyByEmail: new Date(),
        areTermsAccepted: true,
      };
    }
    if (dataObject.provider === 'facebook') {
      userObject = {
        facebookId: dataObject.id,
        firstName: dataObject?.givenName,
        lastName: dataObject?.familyName,
        email: dataObject?.email,
        userName:
          dataObject.userName === undefined
            ? userName
            : dataObject.userName,
        password: dataObject.password,
        verifyByEmail: new Date(),
        areTermsAccepted: true,
      };
    }

    const user = await models.User.create(userObject);
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

const socialAuth = async (bodyObject) => {
  logger.message(`Executing socialAuth`);
  let where;
  if (bodyObject.provider === 'google') {
    where = {
      googleId: bodyObject.id,
    };
  }
  if (bodyObject.provider === 'facebook') {
    where = {
      facebookId: bodyObject.id,
    };
  }
  if (bodyObject.provider === 'apple') {
    where = {
      appleId: bodyObject.id,
    };
  }
  logger.message(
    `Executing socialAuth with ${bodyObject.provider} provider`,
  );
  const user = await models.User.findOne({
    where,
  });
  if (user !== null) {
    if (user.isSuspended) {
      const error = 'Your account has been suspended by admin';
      return Promise.reject(new BadRequestException(error));
    }
    logger.message(`Executing socialAuth user found successfully`);
    const token = await generateToken(user);
    return Promise.resolve({ token });
  }
  logger.message(
    `Executing socialAuth not user found request for create new user`,
  );
  const isEmailExists = await checkEmailExits(bodyObject.email);

  if (isEmailExists !== null) {
    logger.message(`Email ${bodyObject.email} already exists`);
    const error = emailDuplicationMessage(isEmailExists);
    return Promise.reject(new BadRequestException(error));
  }
  logger.message(`Executing socialAuth token generated`);
  const token = await createUser(bodyObject, bodyObject.accessToken);
  return Promise.resolve({ token });
};

module.exports = socialAuth;
