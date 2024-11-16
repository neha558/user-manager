import interestService from 'services/interest';
import logger from 'appConfig/logger';

const createInterest = (req, res, next) => {
  logger.message(`Executing createUser controller`);
  interestService
    .createInterestService(req.body)
    .then((user) => {
      logger.message(`Executing createUser was successful`);
      res.status(201).json(user);
    })
    .catch((error) => {
      logger.message(`Error while executing createUser`, 'error');
      next(error);
    });
};

export default createInterest;
