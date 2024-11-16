import addressService from 'services/address';
import logger from 'appConfig/logger';

const createAddress = (req, res, next) => {
  logger.message(`Executing createTemplate controller`);
  return addressService
    .createAddresservice(req.body)
    .then((addressId) => {
      logger.message(`Executing createAddress was successful`);
      // eslint-disable-next-line object-shorthand
      res.status(201).json({ addressId });
    })
    .catch((error) => {
      logger.message(`Error while executing createAddress`);
      return next(error);
    });
};

module.exports = createAddress;
