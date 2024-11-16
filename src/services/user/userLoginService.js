import {
  ServerException,
  ResourceNotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from 'utils/exceptions';
import logger from 'appConfig/logger';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import {
  emailDuplicationMessage,
  checkUserSuspended,
} from 'utils/commons';

import checkUserExists from 'utils/checkUserExists';
import { EXPIRES_IN } from 'utils/constants';
import ROLES from '../../constant/roles';

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

const userLoginService = (credentials) => {
  logger.message(`Executing userLoginService`);
  return new Promise((resolve, reject) =>
    checkUserExists(credentials)
      .then((userResponse) => {
        if (userResponse === null) {
          return reject(
            new ResourceNotFoundException('User not found'),
          );
        }

        if (userResponse.isSuspended) {
          checkUserSuspended(reject, UnauthorizedException, logger);
        }
        const user = userResponse.get({ plain: true });

        if (user.googleId || user.facebookId || user.appleId) {
          const message = emailDuplicationMessage(user);
          return reject(new ForbiddenException(message));
        }

        if (
          credentials.mobileNumber &&
          user.verifyByMobile === null
        ) {
          return reject(
            new ForbiddenException(
              'Please verify your mobile number via OTP',
            ),
          );
        }
        if (credentials.email && user.verifyByEmail === null) {
          return reject(
            new ForbiddenException(
              'Please verify your email via verification link',
            ),
          );
        }
        if (
          credentials.userName &&
          user.verifyByEmail === null &&
          user.verifyByMobile === null
        ) {
          const message = user.email
            ? 'Please verify your email via verification link'
            : 'Please verify your mobile number via OTP';
          return reject(new ForbiddenException(message));
        }
        if (
          !bcrypt.compareSync(credentials.password, user.password)
        ) {
          return reject(
            new UnauthorizedException('Invalid password'),
          );
        }

        if (
          credentials.email === config.get('adminEmail') ||
          credentials.mobileNumber ===
            config.get('adminMobileNumber') ||
          credentials.userName === config.get('adminUserName')
        ) {
          // eslint-disable-next-line no-param-reassign
          user.roles = [ROLES.ADMIN];
        }
        delete user.password;
        delete user.googleId;
        delete user.facebookId;

        const token = jwt.sign({ user }, config.get('TOKEN_SECRET'), {
          expiresIn: EXPIRES_IN, // expires in 60 days
        });

        return resolve({ token });
      })
      .catch((error) => {
        logger.message(
          `Error occurred while verify token ${
            error?.stack || error
          }`,
        );
        return reject(new ServerException('Unable to verify token'));
      }),
  );
};
module.exports = userLoginService;
