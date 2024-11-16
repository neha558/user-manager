import {
  ServerException,
  BadRequestException,
} from 'utils/exceptions/index';
import models from 'models';
import logger from 'appConfig/logger';
import publishToKafka from '../../kafka/publisher/publishToKafka';

/**
 *
 * @param { id:string } params
 */
const updateAddressService = (data, params) => {
  logger.message(`Executing getAddressByIdService`);
  return new Promise((resolve, reject) => {
    models.Address.update(
      { ...data },
      {
        where: { userId: data.userId, addressId: params.id },
        returning: true,
      },
    )
      .then((updateAddressResponse) => {
        if (updateAddressResponse[0] === 0) {
          return reject(
            new BadRequestException(
              'No such address registered for given user',
            ),
          );
        }
        const updatedAddress = updateAddressResponse[1][0];
        publishToKafka(
          'UPDATE-ADDRESS-TOPIC',
          updatedAddress,
          'UPDATE',
        );
        return resolve(updatedAddress);
      })
      .catch((error) => {
        logger.message(
          `Uncaught error occurred status update address ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException('Unable to update address'),
        );
      });
  });
};

module.exports = updateAddressService;
