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

const deleteInterestService = (params) => {
  logger.message(`Executing deleteInterestService`);
  return new Promise((resolve, reject) => {
    models.Interest.destroy({
      where: { interestId: params.interestId },
    })
      .then((interestObject) => {
        logger.message(
          `Executing deleteInterestService was successful`,
        );
        return resolve(interestObject);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing deleteInterestService ${
            error?.stack || error
          }`,
          '',
        );
        return reject(
          new ServerException('Unable to get deleteInterestService'),
        );
      });
  });
};
export default deleteInterestService;
