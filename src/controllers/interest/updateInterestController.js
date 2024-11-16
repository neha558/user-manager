import interestService from 'services/interest';
import logger from 'appConfig/logger';

const updateInterestController = (req, res, next) => {
  logger.message(`Executing updateInterestController controller`);
  interestService
    .updateInterestService(req.body, req.params)
    .then(() => {
      logger.message(
        `Executing updateInterestController was successful`,
      );
      res.status(204).send();
    })
    .catch((error) => {
      logger.message(
        `Error while executing updateInterestController`,
        'error',
      );
      next(error);
    });
};

export default updateInterestController;
