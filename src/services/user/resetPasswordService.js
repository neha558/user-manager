/* eslint-disable no-console */
import {
  BadRequestException,
  UnauthorizedException,
  ServerException,
} from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { decodeVerificationCode } from 'utils/verificationCodeUtil';

const { SALT_ROUND } = require('utils/constants');

const findAndVerifyCode = (verificationCode) => {
  logger.message(`Executing findAndVerifyCode`);
  return new Promise((resolve, reject) => {
    models.User.findOne({
      where: { forgotPasswordToken: verificationCode },
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

        const decodedToken = decodeVerificationCode(verificationCode);
        const currentDate = moment(new Date());
        if (
          moment(currentDate).isAfter(
            JSON.parse(decodedToken).expiryDate,
          )
        ) {
          logger.message(`Verification link has expired`);
          return reject(
            new UnauthorizedException(
              'Verification link has expired',
            ),
          );
        }
        return resolve({ user, decodedToken });
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

const resetPasswordService = (credentials) => {
  logger.message(`Executing resetPasswordService`);
  return new Promise((resolve, reject) => {
    findAndVerifyCode(credentials.token)
      // eslint-disable-next-line consistent-return
      .then(async ({ decodedToken }) => {
        const tokenDetails = JSON.parse(decodedToken);

        try {
          const newPassword = await bcrypt.hash(
            credentials.password,
            SALT_ROUND,
          );
          const whereClause = {};
          if (tokenDetails?.data?.mobileNumber) {
            whereClause.mobileNumber = tokenDetails.data.mobileNumber;
          } else if (tokenDetails?.data?.userName) {
            whereClause.userName = tokenDetails.data.userName;
          } else {
            whereClause.email = tokenDetails.data.email;
          }
          models.User.update(
            { password: newPassword, forgotPasswordToken: null },
            { where: whereClause },
          )
            .then(() => {
              logger.message(`Successfully reset password`);
              return resolve();
            })
            .catch((error) => {
              logger.message(
                `Error occurred while resetting password token ${
                  error?.stack || error
                }`,
              );
              return reject(
                new ServerException('Failed to reset password'),
              );
            });
        } catch (error) {
          logger.message(
            `Error occurred while resetting password token ${
              error?.stack || error
            }`,
          );
          return reject(
            new ServerException('Failed to reset password'),
          );
        }
      })
      .catch((error) => {
        logger.message(
          `Error occurred while verifying token ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException(
            'Your reset password link has expired. Request for new link and try again.',
          ),
        );
      });
  });
};
module.exports = resetPasswordService;
