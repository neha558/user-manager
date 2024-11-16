import interestService from 'services/interest';
import logger from 'appConfig/logger';

const deleteInterestController = (req, res, next) => {
  logger.message(`Executing deleteInterestController controller`);
  interestService
    .deleteInterestService(req.params)
    .then(() => {
      logger.message(
        `Executing deleteInterestController was successful`,
      );
      res.status(204).send();
    })
    .catch((error) => {
      logger.message(
        `Error while executing deleteInterestController`,
        'error',
      );
      next(error);
    });
};

export default deleteInterestController;
