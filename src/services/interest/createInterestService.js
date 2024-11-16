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

const createInterestService = (interests) => {
  logger.message(`Executing createInterestService`);
  return new Promise((resolve, reject) => {
    models.Interest.bulkCreate(interests)
      .then((interest) => {
        const tempInt = interest.map((item) => item.interestId);
        logger.message(
          `Executing createInterestService was successful`,
        );
        return resolve(tempInt);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing createInterestService ${
            error?.stack || error
          }`,
          '',
        );
        return reject(
          new ServerException('Unable to get createInterestService'),
        );
      });
  });
};
export default createInterestService;
