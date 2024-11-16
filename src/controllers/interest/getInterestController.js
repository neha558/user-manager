import interestService from 'services/interest';
import logger from 'appConfig/logger';

const getInterest = (req, res, next) => {
  logger.message(`Executing getUserById`);
  interestService
    .getInterestService()
    .then((interests) => {
      logger.message(`Executing getUserById was successful`);
      return res.status(200).json(interests);
    })
    .catch((error) => {
      logger.message(`Error while executing getUserById`, 'error');
      return next(error);
    });
};

export default getInterest;
