import {
  ServerException,
  ResourceNotFoundException,
} from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import safeAwait from 'safe-await';

const followerExists = (loggedUserId, followerId) => {
  const whereCondition = {
    where: { userId: loggedUserId, followerId },
  };
  return models.Follow.findAll(whereCondition).then((count) => {
    if (count.length === 0) {
      return false;
    }
    return true;
  });
};

const isBlocked = (loggedUserId, searchedUserID) => {
  logger.message('Executing Blocked user checking');
  const whereCondition = {
    where: {
      blockByUserId: loggedUserId,
      blockedUserId: searchedUserID,
    },
  };
  return models.BlockUser.findAll(whereCondition).then((count) => {
    if (count.length === 0) {
      return false;
    }
    return true;
  });
};

/**
 *
 * @param {
 * "name":string
 * "UserType":string,
 * "fieldType":string,
 * "minOptionLimit":int,
 * "maxOptionLimit":int,
 * "status":ENUM
 * } data
 */

const getUserByUserNameService = (loggedInUserId, userName) => {
  logger.message(`Executing getUserByUserNameService`);
  // NOTE: This is to stop UI from breaking as currently UI sends userId instead of sending userName, this logic can be removed once UI starts sending userName only
  let where = {};

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(userName)) {
    where = { userName, isSuspended: false };
  } else {
    where = { userId: userName, isSuspended: false };
  }

  return new Promise((resolve, reject) => {
    models.User.findOne({ where })
      .then(async (user) => {
        if (user?.userId == null) {
          logger.message(
            `Unable to find getUserByUserNameService by userName ${userName}`,
          );
          return reject(
            new ResourceNotFoundException('User not found'),
          );
        }
        let youFollowed = false;
        let youBlocked = false;

        try {
          youBlocked = await isBlocked(loggedInUserId, user.userId);
          const [, isUserBlocked] = await safeAwait(
            isBlocked(user.userId, loggedInUserId),
          );

          if (isUserBlocked)
            return reject(
              new ResourceNotFoundException('User not found'),
            );

          youFollowed = await followerExists(
            loggedInUserId,
            user.userId,
          );
        } catch (error) {
          throw new ServerException('Unable to get Followed detail');
        }

        const userObject = {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          gender: user.gender,
          profileBanner: user.profileBanner,
          imageId: user.imageId,
          followers: user.followers,
          youFollowed,
          youBlocked,
          bio: user.bio,
          description: user.description,
          dateOfBirth: user.dateOfBirth,
          followings: user.followings,
          createdAt: user.createdAt,
        };
        logger.message(
          `Executing getUserByUserNameService was successful`,
        );
        return resolve(userObject);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing getUserByUserNameService ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException(
            'Unable to find getUserByUserNameService',
          ),
        );
      });
  });
};
module.exports = getUserByUserNameService;
