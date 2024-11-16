import {
  ServerException,
  ResourceNotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from 'utils/exceptions';
import logger from 'appConfig/logger';
import models from 'models';
import { generateVerificationCode } from 'utils/verificationCodeUtil';
import checkUserExists from 'utils/checkUserExists';
import moment from 'moment';
import config from 'config';
import {
  emailDuplicationMessage,
  checkUserSuspended,
} from 'utils/commons';
import generateOtp from 'utils/generateOtp';
import publishToKafka from '../../kafka/publisher/publishToKafka';
import forgotPasswordTemplate from '../../templates/forgotPasswordTemplate';

const sendEmailOrSms = (credentials, updatedUser, otp) => {
  let notificationEvent = {};

  const emailNotification = {
    type: 'EMAIL',
    activityTime: updatedUser.createdAt,
    userId: updatedUser.userId,
    emailOptions: {
      from: config.get('adminEmailId'),
      to: updatedUser.email,
      subject: 'Public poll reset password',
      html: forgotPasswordTemplate(
        config.get('forgotPasswordVerificationUrl'),
        updatedUser.forgotPasswordToken,
        config.get('IMAGE_URL'),
      ),
    },
  };

  const smsNotification = {
    type: 'SMS',
    activityTime: updatedUser.createdAt,
    userId: updatedUser.userId,
    smsOptions: {
      message: `${otp} is your one time password (OTP) to reset your password on Public Poll`,
      phoneNumber: updatedUser.mobileNumber,
    },
  };

  if (credentials.email) {
    notificationEvent = emailNotification;
  } else if (credentials.mobileNumber) {
    notificationEvent = smsNotification;
  } else if (credentials.userName && updatedUser.email) {
    notificationEvent = emailNotification;
  } else if (credentials.userName && updatedUser.mobileNumber) {
    notificationEvent = smsNotification;
  }
  publishToKafka(
    'SMS-EMAIL-NOTIFICATION',
    notificationEvent,
    'CREATE',
  );
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

const forgotPasswordService = (credentials) => {
  logger.message(`Executing forgotPasswordService`);
  return new Promise((resolve, reject) => {
    checkUserExists(credentials)
      .then((user) => {
        if (user === null) {
          throw reject(
            new ResourceNotFoundException('User not found'),
          );
        }

        if (user.isSuspended) {
          checkUserSuspended(reject, UnauthorizedException, logger);
        }

        if (user.googleId || user.facebookId || user.appleId) {
          const message = emailDuplicationMessage(user);
          return reject(new ForbiddenException(message));
        }
        const currentDate = new Date();
        let updateObject;
        let provider;
        const otp = generateOtp();
        const forgotPasswordToken = generateVerificationCode(
          moment(currentDate).add(
            config.get('verificationLinkExpiryDuration'),
            'hours',
          ),
          credentials,
        );
        const otpExpiryTime = moment(currentDate).add(
          config.get('otpExpiryDuration'),
          'minutes',
        );
        if (credentials.email) {
          updateObject = { forgotPasswordToken };
          provider = 'email';
        } else if (credentials.mobileNumber) {
          updateObject = { otp, otpExpiryTime };
          provider = 'mobile';
        } else if (credentials.userName && user.email) {
          updateObject = { forgotPasswordToken };
          provider = 'email';
        } else if (credentials.userName && user.mobileNumber) {
          updateObject = { otp, otpExpiryTime };
          provider = 'mobile';
        }

        return models.User.update(updateObject, {
          where: credentials,
          returning: true,
        })
          .then((updatedUser) => {
            logger.message(
              'Successfully set the forgotPasswordToken',
            );

            sendEmailOrSms(credentials, updatedUser[1][0], otp);
            const generateResponse = {
              userId: user.userId,
              provider,
            };
            if (provider === 'mobile') {
              generateResponse.mobile = user.mobileNumber;
            }
            return resolve(generateResponse);
          })
          .catch((error) => {
            logger.message(
              `Error occurred while updating forgot password token ${
                error?.stack || error
              }`,
            );
            return reject(
              new ServerException(
                'Failed to execute forgot password',
              ),
            );
          });
      })
      .catch((error) => {
        logger.message(
          `Error occurred while verify token ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException('Failed to execute forgot password'),
        );
      });
  });
};
module.exports = forgotPasswordService;
