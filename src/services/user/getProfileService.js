import { ServerException } from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';

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

const getProfileService = (userId) => {
  logger.message(`Executing getUserService`);
  // const attributes = [
  //   'userId',
  //   'firstName',
  //   'lastName',
  //   'email',
  //   'mobileNumber',
  //   'gender',
  //   'profileBanner',
  //   'imageId',
  //   'followers',
  //   'followings',
  // ];
  return new Promise((resolve, reject) => {
    models.User.findByPk(userId)
      .then((user) => {
        logger.message(`Executing getUserService was successful`);
        return resolve(user);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing getUserService ${
            error?.stack || error
          }`,
          '',
        );
        return reject(new ServerException('Unable to get user'));
      });
  });
};
module.exports = getProfileService;
