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

const getInterestService = () => {
  logger.message(`Executing getInterestService`);
  return new Promise((resolve, reject) => {
    models.Interest.findAll({})
      .then((interest) => {
        logger.message(`Executing getInterestService was successful`);
        return resolve(interest);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing getInterestService ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException('Unable to getInterestService'),
        );
      });
  });
};
export default getInterestService;
