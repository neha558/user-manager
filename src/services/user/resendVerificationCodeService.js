import {
  ServerException,
  BadRequestException,
} from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import moment from 'moment';
import { generateVerificationCode } from 'utils/verificationCodeUtil';
import generateOtp from 'utils/generateOtp';
import config from 'config';
import publishToKafka from '../../kafka/publisher/publishToKafka';
import userCreateTemplate from '../../templates/userCreateTemplate';

const sendEmailOrSms = (email, updatedUser) => {
  const notificationEvent = {};
  if (email) {
    notificationEvent.type = 'EMAIL';
    notificationEvent.activityTime = updatedUser.createdAt;
    notificationEvent.userId = updatedUser.userId;
    notificationEvent.emailOptions = {
      from: config.get('adminEmailId'),
      to: updatedUser.email,
      subject: 'Public poll email verification',
      html: userCreateTemplate(
        config.get('emailVerificationUrl'),
        updatedUser.emailVerificationCode,
        config.get('IMAGE_URL'),
      ),
    };
  } else {
    notificationEvent.type = 'SMS';
    notificationEvent.activityTime = updatedUser.createdAt;
    notificationEvent.userId = updatedUser.userId;
    notificationEvent.smsOptions = {
      message: `${updatedUser.otp} is your one time password (OTP) for Public Poll.`,
      phoneNumber: updatedUser.mobileNumber,
    };
  }
  publishToKafka(
    'SMS-EMAIL-NOTIFICATION',
    notificationEvent,
    'CREATE',
  );
};

const resendVerificationCodeService = ({ mobileNumber, email }) => {
  logger.message(
    `Executing resendVerificationCodeService for email ${email} or mobileNumber ${mobileNumber}`,
  );
  return new Promise((resolve, reject) => {
    let updateDetails = {};
    let whereClause = {};
    const currentDate = new Date();
    if (mobileNumber) {
      whereClause = { mobileNumber };
      updateDetails = {
        otp: generateOtp(),
        otpExpiryTime: moment(currentDate).add(
          config.get('otpExpiryDuration'),
          'minutes',
        ),
      };
    } else {
      whereClause = { email };
      updateDetails = {
        emailVerificationCode: generateVerificationCode(
          moment(currentDate).add(
            config.get('verificationLinkExpiryDuration'),
            'hours',
          ),
          { email },
        ),
      };
    }
    models.User.update(updateDetails, {
      where: whereClause,
      returning: true,
    })
      .then((updatedUser) => {
        logger.message(
          `Successfully executed resendVerificationCodeService`,
        );
        if (updatedUser[1].length === 0) {
          if (email) {
            return reject(
              new BadRequestException(`This email is not registered`),
            );
          }
          return reject(
            new BadRequestException(
              `This mobile number is not registered`,
            ),
          );
        }
        sendEmailOrSms(email, updatedUser[1][0]);
        return resolve({
          userId: updatedUser[1][0].userId,
        });
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing resendVerificationCodeService ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException(
            'Something went wrong while sending verification code',
          ),
        );
      });
  });
};

export default resendVerificationCodeService;
