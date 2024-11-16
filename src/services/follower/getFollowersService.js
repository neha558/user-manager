import { ServerException } from 'utils/exceptions/index';
import models from 'models';
import ResourceNotFoundException from 'utils/exceptions/ResourceNotFoundException';
import { paginateData } from 'utils/commons';
import logger from 'appConfig/logger';
import { Op } from 'sequelize';

const createWhereClause = (search, after, userIds) => {
  logger.message('Creating where clause in getFollowersService');

  const where = {
    userId: {
      [Op.in]: userIds,
    },
    isSuspended: false,
  };
  if (after) {
    where.userId = { ...where.userId, [Op.lt]: after };
  }
  if (search) {
    let searchTerms = search.split(' ');
    searchTerms = searchTerms.map((searchTerm) => ({
      [Op.iLike]: `%${searchTerm}%`,
    }));
    if (searchTerms.length < 2) {
      where[Op.or] = {
        ...where[Op.or],
        firstName: { [Op.or]: searchTerms },
        lastName: { [Op.or]: searchTerms },
        userName: { [Op.or]: searchTerms },
      };
    } else {
      where[Op.or] = {
        ...where[Op.or],
        [Op.and]: {
          firstName: {
            [Op.or]: { [Op.or]: searchTerms },
          },
          lastName: {
            [Op.or]: { [Op.or]: searchTerms },
          },
          userName: {
            [Op.or]: { [Op.or]: searchTerms },
          },
        },
      };
    }
  }

  return where;
};

const getListOfFollows = async (userId) => {
  try {
    const follows = await models.Follow.findAll({
      where: { userId },
    });
    const followsIds = follows.map((follow) => follow.followerId);
    return Promise.resolve(followsIds);
  } catch (error) {
    logger.message(
      `Error occurred while getting list of follows ${
        error?.stack || error
      }`,
    );
    return Promise.reject(new ServerException('Unable to get user'));
  }
};

function getFollowers(userIds, search, after, limit, userId) {
  const where = createWhereClause(search, after, userIds);
  const attributes = [
    'userId',
    'firstName',
    'lastName',
    'userName',
    'imageId',
  ];
  return models.User.findAll({
    where,
    limit,
    attributes,
    order: [['createdAt', 'DESC']],
  }).then(async (users) => {
    if (users.length === 0) {
      return {
        data: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      };
    }
    const userFollowsIds = await getListOfFollows(userId);
    const plainUserList = users.map((user) => {
      const plainUserObject = user.get({ plain: true });
      if (userFollowsIds.includes(plainUserObject.userId)) {
        plainUserObject.youFollowed = true;
      } else {
        plainUserObject.youFollowed = false;
      }
      return plainUserObject;
    });

    return paginateData(plainUserList, limit);
  });
}

/**
 *
 * @param { id:string } params
 */

const getFollowersService = (
  userId,
  { search, after, limit = 20 },
) => {
  logger.message(`Executing getFollowersService`);
  return new Promise((resolve, reject) => {
    const pageLimit = Number(limit) + 1;
    models.Follow.findAll({ where: { followerId: userId } })
      .then(async (followers) => {
        try {
          const followerIds = [];
          followers.map((follower) => {
            const followerId = parseInt(follower.userId, 10);
            return followerIds.push(followerId);
          });

          const followersList = await getFollowers(
            followerIds,
            search,
            after,
            pageLimit,
            userId,
          );

          if (followersList) {
            logger.message(
              `Executing getFollowersService was successful`,
            );
            return resolve(followersList);
          }
          return reject(
            new ResourceNotFoundException(
              'You do not have any follower.',
            ),
          );
        } catch (error) {
          if (error) {
            logger.message(
              `Uncaught error occurred status ${
                error?.stack || error
              }`,
            );
            return reject(error);
          }
          return reject(
            new ServerException('Unable to getFollowingService'),
          );
        }
      })
      .catch((error) => {
        logger.message(
          `Uncaught error occurred status getFollowersService ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException('Unable to getFollowersService'),
        );
      });
  });
};

module.exports = getFollowersService;
