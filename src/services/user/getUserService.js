import { ServerException } from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import { encodeCursor, decodeCursor } from 'utils/cursorUtils';
import { Op } from 'sequelize';

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

const getSearchQuery = (searchText) => {
  let searchTerms = searchText.split(' ');
  searchTerms = searchTerms.map((searchTerm) => ({
    [Op.iLike]: `%${searchTerm}%`,
  }));
  const searchQuery = {};
  if (searchTerms.length === 1) {
    searchQuery[Op.or] = {
      firstName: { [Op.or]: searchTerms },
      lastName: { [Op.or]: searchTerms },
    };
  } else {
    searchQuery[Op.or] = {
      [Op.and]: {
        firstName: {
          [Op.or]: { [Op.or]: searchTerms },
        },
        lastName: {
          [Op.or]: { [Op.or]: searchTerms },
        },
      },
    };
  }
  return searchQuery;
};

const generateQuery = (userIds, limit, after, searchText) => {
  logger.message(
    `Executing generatePaginationQuery with limit ${limit} searchText ${searchText} and after ${after}`,
  );
  const query = {};
  if (userIds) {
    query.where = { userId: JSON.parse(userIds) };
    return query;
  }
  // Not putting limit before the userIds condition is because we want all users with givenIds
  // without any limit
  if (limit) {
    query.limit = parseInt(limit, 10) + 1;
  }

  if (after) {
    query.where = {
      userId: {
        [Op.gt]: decodeCursor(after),
      },
    };
  }
  if (searchText) {
    const searchQuery = getSearchQuery(searchText);
    query.where = { ...query.where, ...searchQuery };
  }
  logger.message(
    `Executed generateQuery successfully with query ${JSON.stringify(
      query,
      null,
      2,
    )}`,
  );
  return query;
};

const generatePaginatedUserList = (
  users,
  userIds,
  limit,
  getPaginated,
) => {
  if (userIds) {
    if (getPaginated) {
      return {
        data: users,
        pageInfo: { hasNextPage: false, endCursor: null },
      };
    }
    return users;
  }
  const hasNextPage = users.length === parseInt(limit, 10) + 1;
  let endCursor;
  if (users.length === 1) {
    endCursor = users[0].userId;
  } else if (hasNextPage) {
    endCursor = users[users.length - 2].userId;
  } else {
    endCursor = users[users.length - 1].userId;
  }
  const userList = users;
  if (userList.length !== parseInt(limit, 10)) {
    userList.splice(parseInt(limit, 10), 1);
  }
  return {
    data: userList,
    pageInfo: {
      hasNextPage,
      endCursor: encodeCursor(endCursor),
    },
  };
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

const getUserService = (
  { userIds, limit = 20, after, search, getPaginated },
  userId,
) => {
  logger.message(`Executing getUserService`);
  return new Promise((resolve, reject) => {
    models.User.findAll(generateQuery(userIds, limit, after, search))
      .then(async (users) => {
        logger.message(`Executing getUserService was successful`);
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

        const userList = generatePaginatedUserList(
          plainUserList,
          userIds,
          limit,
          getPaginated,
        );
        return resolve(userList);
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing getUserService ${
            error?.stack || error
          }`,
          '',
        );
        return reject(new ServerException('Unable to get user'));
      });
  });
};
module.exports = getUserService;
