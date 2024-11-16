import { ServerException } from 'utils/exceptions/index';
import models from 'models';
import ResourceNotFoundException from 'utils/exceptions/ResourceNotFoundException';
import logger from 'appConfig/logger';
import { paginateData } from 'utils/commons';
import { Op } from 'sequelize';

function createWhereClause(search, after, userIds) {
  logger.message('Creating where clause in getFollowingService');

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
}

function getFollowing(userIds, search, after, limit, userId) {
  const where = createWhereClause(search, after, userIds, userId);
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
  }).then((users) => {
    if (users.length === 0) {
      return {
        data: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      };
    }
    // eslint-disable-next-line no-param-reassign
    users = users.map((user) => {
      const plainUserObject = user.get({ plain: true });
      plainUserObject.youFollowed = true;
      return plainUserObject;
    });
    return paginateData(users, limit);
  });
}

/**
 *
 * @param { id:string } params
 */

const getFollowingService = (
  followerId,
  { search, after, limit = 20 },
) => {
  logger.message(`Executing getFollowingService`);
  return new Promise((resolve, reject) => {
    const pageLimit = Number(limit) + 1;
    models.Follow.findAll({ where: { userId: followerId } })
      .then(async (followers) => {
        try {
          const followerIds = [];
          followers.map((follower) => {
            const followingId = parseInt(follower.followerId, 10);
            return followerIds.push(followingId);
          });

          const followersList = await getFollowing(
            followerIds,
            search,
            after,
            pageLimit,
          );

          if (followersList) {
            logger.message(
              `Executing getFollowingService was successful`,
            );
            return resolve(followersList);
          }
          return reject(
            new ResourceNotFoundException('You have no following.'),
          );
        } catch (error) {
          if (error) {
            return reject(error);
          }
          return reject(
            new ServerException('Unable to getFollowingService'),
          );
        }
      })
      .catch((error) => {
        logger.message(
          `Uncaught error occurred status getFollowingService ${
            error?.stack || error
          }`,
        );
        return reject(
          new ServerException('Unable to getFollowingService'),
        );
      });
  });
};

module.exports = getFollowingService;
