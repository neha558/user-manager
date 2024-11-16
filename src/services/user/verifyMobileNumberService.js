import {
  ServerException,
  BadRequestException,
  UnauthorizedException,
} from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import moment from 'moment';
import { generateVerificationCode } from 'utils/verificationCodeUtil';
import config from 'config';

const findAndVerifyMobileNumberService = (userId, otp) => {
  logger.message(`Executing findAndVerifyMobileNumberService`);
  return new Promise((resolve, reject) => {
    models.User.findByPk(userId)
      .then((user) => {
        logger.message(`Found user with user id ${userId} for Otp`);
        if (user.otp !== otp) {
          logger.message(`Invalid Otp code ${otp}`);
          return reject(new BadRequestException('Invalid Otp'));
        }
        const currentDate = moment(new Date());
        if (moment(currentDate).isAfter(user.otpExpiryTime)) {
          logger.message(`Otp has expired`);
          return reject(new UnauthorizedException('Otp has expired'));
        }
        return resolve(user);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing findAndVerifyMobileNumberService ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException(
            'Something went wrong while verifying otp',
          ),
        );
      });
  });
};

const updateUserOtpDetails = (
  userDetails,
  mobileNumber,
  forgotPasswordToken,
) => {
  logger.message(
    `Executing updateUserOtpDetails for user ${userDetails.userId}`,
  );

  const userUpdateObject = {
    ...userDetails,
    otpExpiryTime: null,
    otp: null,
    verifyByMobile: new Date(),
    forgotPasswordToken,
  };
  if (mobileNumber) {
    userUpdateObject.mobileNumber = mobileNumber;
  }
  return new Promise((resolve, reject) => {
    models.User.update(userUpdateObject, {
      where: { userId: userDetails.userId },
      returning: true,
    })
      .then(() => {
        logger.message(`Successfully executed updateUserOtpDetails`);
        return resolve(userUpdateObject);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing updateUserOtpDetails ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException(
            'Something went wrong while verifying user',
          ),
        );
      });
  });
};

const verifyMobileNumberService = (userId, otp, mobileNumber) => {
  logger.message(
    `Executing verifyMobileNumberService for user ${userId}`,
  );
  return new Promise((resolve, reject) => {
    findAndVerifyMobileNumberService(userId, otp)
      .then((verifiedUserDetails) => {
        const currentDate = new Date();
        const forgotPasswordToken = generateVerificationCode(
          moment(currentDate).add(
            config.get('verificationLinkExpiryDuration'),
            'hours',
          ),
          { mobileNumber },
        );
        updateUserOtpDetails(
          verifiedUserDetails,
          mobileNumber,
          forgotPasswordToken,
        )
          .then(() => {
            logger.message(
              `Successfully executed verifyMobileNumberService`,
            );
            return resolve({ token: forgotPasswordToken });
          })
          .catch((error) => {
            logger.message(
              `Error occurred while updating otp details ${
                error?.stack || error
              }`,
            );
            return reject(error);
          });
      })
      .catch((error) => {
        logger.message(
          `Error occurred while verifying code ${
            error?.stack || error
          }`,
        );
        return reject(error);
      });
  });
};

export default verifyMobileNumberService;
