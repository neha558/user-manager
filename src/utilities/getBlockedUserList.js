import { ServerException } from 'utils/exceptions/index';
import models from 'models';
import { QueryTypes } from 'sequelize';
import logger from 'appConfig/logger';

const getBlockedUserList = async (userId) => {
  try {
    logger.message('Getting Blocked User');

    const blockedUserId = [];

    const blockedIds = await models.sequelize.query(
      `SELECT "blockByUserId","blockedUserId" FROM "blockUsers" WHERE "blockByUserId"= ${userId} OR "blockedUserId" = ${userId}`,
      { type: QueryTypes.SELECT },
    );

    blockedIds.map((blocked) => {
      const blockedId = parseInt(blocked.blockedUserId, 10);
      const blockedById = parseInt(blocked.blockByUserId, 10);
      return blockedUserId.push(blockedId, blockedById);
    });

    logger.message('BlockedUser Executed Successfully');
    return blockedUserId;
  } catch (error) {
    logger.message('Error while getting Blocked User');

    return Promise.reject(
      new ServerException('Unable to Connect BlockUserModel'),
    );
  }
};

export default getBlockedUserList;
