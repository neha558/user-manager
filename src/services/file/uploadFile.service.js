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

const uploadFileService = (data) => {
  logger.message(`Executing uploadFileService`);
  return new Promise((resolve, reject) => {
    models.File.create(data)
      .then((savedUser) => {
        logger.message(`Executing uploadFileService was successful`);
        return resolve({
          fileId: savedUser.fileId,
        });
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing uploadFileService ${
            error?.stack || error
          }`,
          '',
        );
        return reject(new ServerException('Unable to create User'));
      });
  });
};
module.exports = uploadFileService;
