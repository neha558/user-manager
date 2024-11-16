import { ServerException } from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import publishToKafka from '../../kafka/publisher/publishToKafka';

/**
 *
 * @param {
 * "name":string
 * "addressType":string,
 * "fieldType":string,
 * "minOptionLimit":int,
 * "maxOptionLimit":int,
 * "status":ENUM
 * } data
 */

const createAddressService = (addressDetail) => {
  logger.message(`Executing createAddressService`);
  return new Promise((resolve, reject) =>
    models.Address.create(addressDetail)
      .then((savedAddress) => {
        logger.message(
          `Executing createAddressService was successful`,
        );
        publishToKafka(
          'UPDATE-ADDRESS-TOPIC',
          savedAddress,
          'CREATE',
        );
        return resolve(savedAddress.addressId);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing createAddressService ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException('Unable to create Address'),
        );
      }),
  );
};

module.exports = createAddressService;
