import { ServerException } from 'utils/exceptions/index';
import models from 'models';
import ResourceNotFoundException from 'utils/exceptions/ResourceNotFoundException';
import logger from 'appConfig/logger';

/**
 *
 * @param { id:string } params
 */
const getAddressService = (params) => {
  logger.message(`Executing getAddressByIdService`);
  return new Promise((resolve, reject) => {
    models.Address.findOne({ where: { userId: params.id } })
      .then((address) => {
        if (address) {
          logger.message(`Executing getAddress was successful`);
          return resolve(address);
        }
        return reject(
          new ResourceNotFoundException('Address Not Found'),
        );
      })
      .catch((error) => {
        logger.message(
          `Uncaught error occurred status get address ${
            error?.stack || error
          }`,
        );
        return reject(new ServerException('Unable to get address'));
      });
  });
};

module.exports = getAddressService;
