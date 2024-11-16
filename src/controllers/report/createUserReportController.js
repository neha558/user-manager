import userReportService from 'services/report';
import logger from 'appConfig/logger';

const createUserReport = (req, res, next) => {
  logger.message(`Executing createReport`);
  const {
    reportedUserId,
    reason,
    user: { userId },
  } = req.body;
  logger.message(
    `Executing createUserReport controller for reportedUserId ${reportedUserId} by userId ${userId}`,
  );
  return userReportService
    .createUserReportService({
      reportedUserId,
      reason,
      userId,
    })
    .then((responseUser) => {
      logger.message(`Executing createUserReport was successful`);
      res.status(201).json(responseUser);
    })
    .catch((error) => {
      logger.message(
        `Error while executing createUserReport ${
          error?.stack || error
        }`,
        'error',
      );
      next(error);
    });
};

module.exports = createUserReport;
