import addressService from 'services/address';
import logger from 'appConfig/logger';

const updateAddress = (req, res, next) => {
  logger.message(`Executing getAddress`);
  return addressService
    .updateAddressService(req.body, req.params)
    .then(() => {
      logger.message(`Executing getAddress was successful`);
      res.status(204).send();
    })
    .catch((error) => {
      logger.message(`Error while executing getAddress`);
      next(error);
    });
};

module.exports = updateAddress;
