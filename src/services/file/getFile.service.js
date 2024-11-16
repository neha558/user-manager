import {
  ServerException,
  ResourceNotFoundException,
} from 'utils/exceptions';
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

const getFileService = (fileId) => {
  logger.message(`Executing getFileService`);
  return new Promise((resolve, reject) => {
    models.File.findByPk(fileId)
      .then((files) => {
        if (files == null) {
          logger.message(
            `Error occurred while executing getFileService`,
          );
          return reject(
            new ResourceNotFoundException('File not found.'),
          );
        }
        logger.message(`Executing getFileService was successful`);
        return resolve(files);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing getFileService ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException('Unable to getFileService'),
        );
      });
  });
};
module.exports = getFileService;
