import logger from 'appConfig/logger';
import validUserId from 'utils/validUserId';
import models from 'models';
import {
  ResourceNotFoundException,
  BadRequestException,
  ServerException,
} from 'utils/exceptions';
import safeAwait from 'safe-await';
import followerService from 'services/follower';
import publishToKafka from '../../kafka/publisher/publishToKafka';

/**
 *
 * @param {
 * "blockByUserId":int,
 * "blockedUserId":int,
 * } data
 */

const checkIfUserIsBlocked = (blockByUserId, blockedUserId) => {
  const whereCondition = {
    where: { blockByUserId, blockedUserId },
  };

  return models.BlockUser.findOne(whereCondition)
    .then((data) => data)
    .catch(() => {
      logger.message('Unable to connect to BlockUser Model.');
      throw new ServerException('Unable to connect BlockUser!');
    });
};

const blockUser = async (blockUserId, userId) => {
  logger.message('Executing blockUser!');
  try {
    const isBlocked = await checkIfUserIsBlocked(userId, blockUserId);
    if (isBlocked)
      return Promise.reject(
        new BadRequestException(
          'You have already blocked this user!',
        ),
      );

    const blockUserData = {
      blockByUserId: userId,
      blockedUserId: blockUserId,
    };

    return models.BlockUser.create(blockUserData)
      .then(async (insertedData) => {
        // Unfollowing user from both side
        await safeAwait(
          followerService.unfollowService({
            followerId: blockUserId,
            user: { userId },
          }),
        );
        await safeAwait(
          followerService.unfollowService({
            followerId: userId,
            user: { userId: blockUserId },
          }),
        );
        publishToKafka('BLOCK-USER-UPDATES', insertedData, 'CREATE');
        return {
          blockedByUserId: insertedData.blockByUserId,
          blockedUserId: insertedData.blockedUserId,
        };
      })
      .catch(() => {
        logger.message('Error while inserting blockuser data');
        Promise.reject(
          new ServerException('Unable to connect BlockUser Model'),
        );
      });
  } catch (error) {
    logger.message('Error Executing blockService!');
    return Promise.reject(
      new ServerException('Unable to connect BlockUser Model!'),
    );
  }
};

const unblockUser = async (blockUserId, userId) => {
  logger.message('Executing unblockUser!');
  try {
    const isBlocked = await checkIfUserIsBlocked(userId, blockUserId);
    if (!isBlocked)
      return Promise.reject(
        new BadRequestException('You have not blocked this user!'),
      );

    const unblockUserData = {
      blockByUserId: userId,
      blockedUserId: blockUserId,
    };
    const whereCondition = {
      where: unblockUserData,
      force: true,
    };

    return models.BlockUser.destroy(whereCondition)
      .then(() => {
        logger.message(`Executing unblockService was successful`);

        publishToKafka(
          'BLOCK-USER-UPDATES',
          unblockUserData,
          'DELETE',
        );
        return unblockUserData;
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing unblockService ${
            error?.stack || error
          }`,
        );
        return Promise.reject(
          new ServerException('Unable to perform unblockService'),
        );
      });
  } catch (error) {
    logger.message('Error Executing unblockService!');
    return Promise.reject(
      new ServerException('Unable to connect BlockUser Model!'),
    );
  }
};

const blockUserService = (blockUserId, userId, action) => {
  logger.message('Executing blockHandlerService!');
  const blockAction = {
    block: blockUser,
    unblock: unblockUser,
  };

  return new Promise((resolve, reject) => {
    validUserId(blockUserId)
      .then(async (userDetail) => {
        if (userDetail !== null) {
          const allowedActions = ['block', 'unblock'];
          if (allowedActions.includes(action)) {
            const [errorResponse, blockResponse] = await safeAwait(
              blockAction[action](blockUserId, userId),
            );

            if (errorResponse) return reject(errorResponse);
            if (blockResponse) return resolve(blockResponse);
          }
          return reject(
            new BadRequestException(
              'Given block action is invalid. It Should be block/unblock.',
            ),
          );
        }
        return reject(
          new ResourceNotFoundException('Unable to find UserID'),
        );
      })
      .catch((error) => {
        logger.message('Error Executing blockHandlerService');
        if (error) {
          return reject(error);
        }
        return reject(
          new ServerException('Unable to connect User Model'),
        );
      });
  });
};

module.exports = blockUserService;
