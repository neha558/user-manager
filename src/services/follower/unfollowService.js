import {
  ServerException,
  ResourceNotFoundException,
  BadRequestException,
} from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import validUserId from 'utils/validUserId';
import publishToKafka from '../../kafka/publisher/publishToKafka';

/**
 *
 * @param {
 * "name":string
 * "addressType":string,
 * "fieldType":string,
 * "minOptionLimit":int,
 * "maxOptionLimit":int,
 * "status":ENUM
 * } data
 */
function followerExists(userId, followerId) {
  const whereCondition = {
    where: { userId, followerId },
  };
  return models.Follow.findAll(whereCondition).then((count) => {
    if (count.length === 0) {
      return false;
    }
    return count;
  });
}

const decreaseFollowerCount = async (userId) => {
  const isDecrease = await models.User.decrement('followers', {
    by: 1,
    where: { userId },
  }).then((count) => {
    if (count.length === 0) {
      return false;
    }
    return true;
  });
  return isDecrease;
};
const decreaseFollowingCount = async (userId) => {
  const isDecrease = await models.User.decrement('followings', {
    by: 1,
    where: { userId },
  }).then((count) => {
    if (count.length === 0) {
      return false;
    }
    return true;
  });
  return isDecrease;
};

const followService = (followDetail) => {
  logger.message(`Executing followService`);
  return new Promise((resolve, reject) => {
    validUserId(followDetail.followerId).then(async (userCount) => {
      const followData = {
        userId: followDetail.user.userId,
        followerId: followDetail.followerId,
      };
      if (userCount != null) {
        await followerExists(
          followData.userId.toString(),
          followData.followerId,
        ).then(async (isUnique) => {
          if (isUnique) {
            const whereCondition = {
              where: followData,
              force: true,
            };
            await models.Follow.destroy(whereCondition)
              .then(async () => {
                logger.message(
                  `Executing followService was successful`,
                );
                await decreaseFollowerCount(followData.followerId);
                await decreaseFollowingCount(followData.userId);
                publishToKafka(
                  'FOLLOWER-UPDATES',
                  {
                    userId: followDetail.user.userId,
                    followerId: followDetail.followerId,
                  },
                  'DELETE',
                );
                return resolve({
                  message: 'unfollowed successfully',
                });
              })
              .catch((error) => {
                logger.message(
                  `Error occurred while executing followService ${
                    error?.stack || error
                  }`,
                );
                return reject(
                  new ServerException('Unable to followService'),
                );
              });
          }
          return reject(
            new BadRequestException('You are not followed this user'),
          );
        });
      }
      return reject(
        new ResourceNotFoundException('Unable to find follower'),
      );
    });
  });
};

module.exports = followService;
