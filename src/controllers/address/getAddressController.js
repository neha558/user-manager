import addressService from 'services/address';
import logger from 'appConfig/logger';

const getAddress = (req, res, next) => {
  logger.message(`Executing getAddress`);
  return addressService
    .getAddressService(req.params)
    .then((template) => {
      logger.message(`Executing getAddress was successful`);
      res.status(200).json(template);
    })
    .catch((error) => {
      logger.message(`Error while executing getAddress`);
      next(error);
    });
};

module.exports = getAddress;
