import adminService from 'services/admin';
import logger from 'appConfig/logger';

const getUserStatisticsController = (req, res, next) => {
  logger.message(`Executing getUserStatisticsController`);
  adminService
    .getUsersStatistics()
    .then((statics) => {
      logger.message(
        `Executing getUserStatisticsController was successful`,
      );
      return res.status(200).json(statics);
    })
    .catch((error) => {
      logger.message(
        `Error while executing getUserStatisticsController`,
        'error',
      );
      return next(error);
    });
};

export default getUserStatisticsController;
