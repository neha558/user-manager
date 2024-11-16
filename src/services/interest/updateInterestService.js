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

const updateInterestService = (body, params) => {
  logger.message(`Executing updateInterestService`);
  return new Promise((resolve, reject) => {
    const { image, interest } = body;
    models.Interest.update(
      { image, interest },
      {
        where: { interestId: params.interestId },
      },
    )
      .then((interestObject) => {
        logger.message(
          `Executing updateInterestService was successful`,
        );
        return resolve(interestObject);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing updateInterestService ${
            error?.stack || error
          }`,
          '',
        );
        return reject(
          new ServerException('Unable to get updateInterestService'),
        );
      });
  });
};
export default updateInterestService;
