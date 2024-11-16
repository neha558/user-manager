import {
  ServerException,
  BadRequestException,
} from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import bcrypt from 'bcrypt';
import { SALT_ROUND } from 'utils/constants';
import { cloneDeep } from 'lodash';
import checkUserExists from 'utils/checkUserExists';
import { generateVerificationCode } from 'utils/verificationCodeUtil';
import generateOtp from 'utils/generateOtp';
import moment from 'moment';
import config from 'config';
import publishToKafka from '../../kafka/publisher/publishToKafka';
import userCreateTemplate from '../../templates/userCreateTemplate';

const capitalize = (inputString) => {
  if (typeof inputString !== 'string') return '';
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
};

const sendEmailOrSms = (savedUser) => {
  const notificationEvent = {};
  if (savedUser.email && savedUser.userName) {
    notificationEvent.type = 'EMAIL';
    notificationEvent.activityTime = savedUser.createdAt;
    notificationEvent.userId = savedUser.userId;
    notificationEvent.emailOptions = {
      from: config.get('adminEmailId'),
      to: savedUser.email,
      subject: 'Public poll email verification',
      html: userCreateTemplate(
        config.get('emailVerificationUrl'),
        savedUser.emailVerificationCode,
        config.get('IMAGE_URL'),
      ),
    };
  } else {
    notificationEvent.type = 'SMS';
    notificationEvent.activityTime = savedUser.createdAt;
    notificationEvent.userId = savedUser.userId;
    notificationEvent.smsOptions = {
      message: `${savedUser.otp} is your one time password (OTP) for Public Poll.`,
      phoneNumber: savedUser.mobileNumber,
    };
  }
  publishToKafka(
    'SMS-EMAIL-NOTIFICATION',
    notificationEvent,
    'CREATE',
  );
};

const checkUserName = (userName) => {
  logger.message(`Executing checkUserName`);
  return new Promise((resolve, reject) => {
    models.Username.count({
      where: { userName },
    })
      .then((success) => {
        logger.message(`successfully Execute checkUserName`);
        const responseData = success !== 0;
        return resolve(responseData);
      })
      .catch((err) => {
        logger.message(`Error on Executing checkUserName${err}`);
        return reject(
          new BadRequestException('Username already exists.'),
        );
      });
  });
};

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

/**
 *
 * @param {
 * "name":string
 * "UserType":string,
 * "fieldType":string,
 * "minOptionLimit":int,
 * "maxOptionLimit":int,
 * "status":ENUM
 * } data
 */

const createUserService = (data) => {
  logger.message(`Executing createUserService`);
  return new Promise((resolve, reject) => {
    if (!data.email && !data.mobileNumber) {
      return reject(
        new BadRequestException(
          'Email or mobile number filed required',
        ),
      );
    }
    return checkUserName(data.userName)
      .then(async (success) => {
        if (success) {
          return reject(
            new BadRequestException('Username already exists.'),
          );
        }
        const dataObject = cloneDeep(data);
        dataObject.password = await bcrypt.hash(
          dataObject.password,
          SALT_ROUND,
        );

        return checkUserExists(data).then((userCount) => {
          if (userCount) {
            if (data.email) {
              return reject(
                new BadRequestException(
                  'This email address is already being used.',
                ),
              );
            }
            return reject(
              new BadRequestException(
                'This Phone Number is already being used.',
              ),
            );
          }

          if (userCount === null) {
            dataObject.firstName = capitalize(dataObject.firstName);
            dataObject.lastName = capitalize(dataObject.lastName);

            if (data.email && data.userName) {
              const currentDate = new Date();
              dataObject.emailVerificationCode = generateVerificationCode(
                moment(currentDate).add(
                  config.get('verificationLinkExpiryDuration'),
                  'hours',
                ),
                { email: data.email },
              );
            }
            if (data.mobileNumber) {
              dataObject.otp = generateOtp();
              const currentDate = new Date();
              dataObject.otpExpiryTime = moment(currentDate).add(
                config.get('otpExpiryDuration'),
                'minutes',
              );
            }

            // start create user
            return models.User.create(dataObject)
              .then((savedUser) => {
                logger.message(
                  `Executing createUserService was successful`,
                );
                publishToKafka(
                  'USER-NOTIFICATION',
                  savedUser,
                  'CREATE',
                );
                sendEmailOrSms(savedUser);
                saveUserName({
                  userId: savedUser.userId,
                  userName: savedUser.userName,
                })
                  .then(() => {
                    logger.message(
                      `Executing saveUserName was successful`,
                    );
                    return resolve({
                      userId: savedUser.userId,
                    });
                  })
                  .catch(() => {
                    logger.message(
                      `Executing saveUserName was successful`,
                    );
                    return reject(
                      new ServerException('Unable to save userName'),
                    );
                  });
              })
              .catch((error) => {
                if (error.errors[0].message) {
                  logger.message(
                    `userName must be unique ${error.errors[0].message}`,
                  );
                  return reject(
                    new ServerException('Unable to create User'),
                  );
                }
                logger.message(
                  `Error occurred while executing createUserService ${
                    error?.stack || error
                  }`,
                );
                return reject(
                  new ServerException('Unable to create User'),
                );
              });
            // end create user
          }
          return userCount;
        });
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing createUserService ${
            error?.stack || error
          }`,
        );
        return reject(new ServerException('Unable to create User'));
      });
  });
};
module.exports = createUserService;
