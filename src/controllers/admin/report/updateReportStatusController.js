import adminUserReportService from 'services/admin/report';
import logger from 'appConfig/logger';

const updateUserReportStatus = (req, res, next) => {
  logger.message(`Executing admin updateUserReportStatus`);

  adminUserReportService
    .updateUserReportStatusService(req)
    .then((userReport) => {
      logger.message(
        `Executing admin updateUserReportStatus was successful`,
      );
      res.status(204).send(userReport);
    })
    .catch((error) => {
      logger.message(
        `Error while executing admin updateUserReportStatus ${
          error?.stack || error
        }`,
        'error',
      );
      next(error);
    });
};

module.exports = updateUserReportStatus;
