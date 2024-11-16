import adminUserReportService from 'services/admin/report';
import logger from 'appConfig/logger';

const getReports = (req, res, next) => {
  logger.message(`Executing admin getReportsController`);

  adminUserReportService
    .getAdminUserReportService(req)
    .then((reportedUsers) => {
      logger.message(
        `Executing admin getReportsController was successful`,
      );
      res.status(200).json(reportedUsers);
    })
    .catch((error) => {
      logger.message(
        `Error while executing admin getReportsController ${
          error?.stack || error
        }`,
        'error',
      );
      next(error);
    });
};

module.exports = getReports;
