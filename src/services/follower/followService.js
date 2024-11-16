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
    return true;
  });
}

const increaseFollowerCount = async (userId) => {
  const isIncrease = await models.User.increment('followers', {
    by: 1,
    where: { userId },
  }).then((count) => {
    if (count.length === 0) {
      return false;
    }
    return true;
  });
  return isIncrease;
};

const increaseFollowingCount = async (userId) => {
  const isIncrease = await models.User.increment('followings', {
    by: 1,
    where: { userId },
  }).then((count) => {
    if (count.length === 0) {
      return false;
    }
    return true;
  });
  return isIncrease;
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
        const isAlreadyFollowed = await followerExists(
          followData.userId.toString(),
          followData.followerId,
        ).then((isUnique) => {
          if (isUnique) {
            return reject(
              new BadRequestException(
                'You are already followed this user',
              ),
            );
          }
          return true;
        });
        if (isAlreadyFollowed) {
          await models.Follow.create(followData)
            .then(async (savedFollower) => {
              logger.message(
                `Executing followService was successful`,
              );
              await increaseFollowerCount(followData.followerId);
              await increaseFollowingCount(followData.userId);
              publishToKafka(
                'FOLLOWER-UPDATES',
                savedFollower,
                'CREATE',
              );
              return resolve({
                followId: savedFollower.followId,
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
      }
      return reject(
        new ResourceNotFoundException('Unable to find follower'),
      );
    });
  });
};

module.exports = followService;
