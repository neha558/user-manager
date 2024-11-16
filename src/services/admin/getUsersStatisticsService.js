import models from 'models';
import logger from 'appConfig/logger';
import { ServerException } from 'utils/exceptions';
import { Op } from 'sequelize';

const getUsersStatisticsService = async () => {
  try {
    logger.message(`Executing getUsersStatisticsService`);
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    const totalUsers = await models.User.count();
    const totalUsers24Hours = await models.User.count({
      where: {
        createdAt: {
          [Op.gt]: TODAY_START,
          [Op.lt]: NOW,
        },
      },
    });
    return Promise.resolve({ totalUsers, totalUsers24Hours });
  } catch (error) {
    logger.message(
      `Error occurred while getUsersStatisticsService ${error}`,
    );
    return Promise.reject(
      new ServerException('Unable to get getUsersStatisticsService'),
    );
  }
};

module.exports = getUsersStatisticsService;
