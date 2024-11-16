import { ServerException } from 'utils/exceptions';

import models from 'models';
import logger from 'appConfig/logger';

const createUserReportService = async ({
  userId,
  reportedUserId,
  reason,
}) => {
  try {
    logger.message(
      `Executing createPollReportService of user ${reportedUserId} by user ${userId}`,
    );

    const userReport = await models.ReportedUser.create({
      reportedBy: userId,
      userId: reportedUserId,
      reason,
    });

    logger.message(`Executed createUserReportService successfully`);

    return Promise.resolve(userReport);
  } catch (error) {
    logger.message(
      `Error occurred while executing createUserReportService ${
        error?.stack || error
      }`,
    );

    return Promise.reject(
      new ServerException('Failed to createUserReportService'),
    );
  }
};

module.exports = createUserReportService;
