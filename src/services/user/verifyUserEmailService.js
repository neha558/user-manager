import {
  ServerException,
  BadRequestException,
  UnauthorizedException,
} from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import moment from 'moment';
import { decodeVerificationCode } from 'utils/verificationCodeUtil';

const findAndVerifyCode = (verificationCode) => {
  logger.message(`Executing findAndVerifyCode`);
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: { emailVerificationCode: verificationCode },
    })
      .then((user) => {
        logger.message(
          `Found user with code ${verificationCode} for verification`,
        );
        if (!user) {
          logger.message(
            `Invalid verification code ${verificationCode}`,
          );
          return reject(
            new BadRequestException('Invalid verification code'),
          );
        }

        const decodedValue = decodeVerificationCode(verificationCode);
        const currentDate = moment(new Date());
        if (
          moment(currentDate).isAfter(
            JSON.parse(decodedValue).expiryDate,
          )
        ) {
          logger.message(`Verification link has expired`);
          return reject(
            new UnauthorizedException(
              'Verification link has expired',
            ),
          );
        }
        const newEmail = JSON.parse(decodedValue).data.email;
        return resolve({ user, newEmail });
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing findAndVerifyCode ${
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

const updateUserVerificationDetails = (userDetails, email) => {
  logger.message(
    `Executing updateUserVerificationDetails for user ${userDetails.userId}`,
  );
  return new Promise((resolve, reject) => {
    const updateUserObject = {
      ...userDetails,
      email,
      emailVerificationCode: null,
      verifyByEmail: new Date(),
    };

    models.User.update(updateUserObject, {
      where: { userId: userDetails.userId },
      returning: true,
    })
      .then((updatedUser) => {
        logger.message(
          `Successfully executed updateUserVerificationDetails`,
        );
        return resolve(updatedUser);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing updateUserVerificationDetails ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException(
            'Something went wrong while verifying code',
          ),
        );
      });
  });
};

const verifyUserEmailService = (verificationCode) => {
  logger.message(
    `Executing verifyUserEmailService for verificationCode ${verificationCode}`,
  );
  return new Promise((resolve, reject) => {
    findAndVerifyCode(verificationCode)
      .then(({ user, newEmail }) => {
        updateUserVerificationDetails(user, newEmail)
          .then(() => {
            logger.message(
              `Successfully executed verifyUserEmailService`,
            );
            return resolve();
          })
          .catch((error) => {
            logger.message(
              `Error occurred while updating verification details ${
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

export default verifyUserEmailService;
