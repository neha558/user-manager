/* eslint-disable indent */
import { ServerException } from 'utils/exceptions';
import models from 'models';
import logger from 'appConfig/logger';
import { removeNullFromObject } from 'utils/commons';
import { QueryTypes } from 'sequelize';
import getBlockedUserList from 'utils/getBlockedUserList';

const getUserDetails = (userId) =>
  new Promise((resolve, reject) => {
    models.User.findOne({
      where: { userId },
      include: [
        {
          model: models.Address,
          though: 'addresses',
          as: 'address',
        },
      ],
    })
      .then((user) => {
        logger.message(
          `Executing getUserDetails for suggestions was successful`,
        );
        if (!user) {
          // eslint-disable-next-line no-param-reassign
          user = {};
        }
        return resolve(removeNullFromObject(user));
      })
      .catch((error) => {
        logger.message(
          `Error occurred while executing getUserDetails for suggestions ${
            error?.stack || error
          }`,
          '',
        );
        return reject(
          new ServerException(
            'Unable to getUserDetails for suggestions',
          ),
        );
      });
  });

const transformArrayOfIds = (array) => {
  const stringifiedArrayElements = array.map((item) =>
    item.toString(),
  );
  return stringifiedArrayElements.join();
};

const interestsBasedSuggestionQuery = (
  userDetails,
  followingIds,
  searchText,
) => {
  if (followingIds.length || userDetails.interests !== undefined) {
    let query = `SELECT "userId" from users where`;
    if (userDetails.interests !== undefined) {
      query = `${query} interests && '{${transformArrayOfIds(
        userDetails.interests,
      )}}' AND "userId"!=${userDetails.userId}`;
    }
    if (followingIds.length) {
      query = `${query} AND "userId" NOT IN (${transformArrayOfIds(
        followingIds,
      )}) `;
    }
    if (searchText) {
      query = `${query} AND ("firstName" ILIKE '%${searchText}%' OR "lastName" ILIKE '%${searchText}%' OR "userName" ILIKE '%${searchText}%') `;
    }
    query = `${query} UNION`;
    return query;
  }
  return '';
};

const addressBasedSuggestionQuery = (
  userDetails,
  followingIds,
  searchText,
) => {
  let query = `SELECT "userId" from users where "userId" IN (SELECT "userId" from addresses where addresses.city='${userDetails.address?.city}' AND "userId"!=${userDetails.userId}`;
  if (followingIds.length) {
    query = `${query} AND "userId" NOT IN (${transformArrayOfIds(
      followingIds,
    )})`;
  }
  query = `${query} )`;
  if (searchText) {
    query = `${query} AND ("firstName" ILIKE '%${searchText}%' OR "lastName" ILIKE '%${searchText}%' OR "userName" ILIKE '%${searchText}%') `;
  }
  query = `${query} UNION`;
  return query;
};

const followingFollowsBasedSuggestionQuery = (
  userDetails,
  followingIds,
  searchText,
) => {
  if (followingIds.length) {
    let query = `SELECT "followerId" from follows where`;
    query = `${query} "userId" IN (${transformArrayOfIds(
      followingIds,
    )}) AND  "followerId"!=${userDetails.userId}`;
    query = `${query} AND "followerId" NOT IN (${transformArrayOfIds(
      followingIds,
    )})`;

    if (searchText)
      query = `${query} AND ("firstName" ILIKE '%${searchText}%' OR "lastName" ILIKE '%${searchText}%' OR "userName" ILIKE '%${searchText}%') `;

    query = `${query} UNION`;
    return query;
  }
  return '';
};

const followersFollowsBasedSuggestionQuery = (
  userDetails,
  followingIds,
  searchText,
) => {
  let query = `SELECT "followerId" from follows where "userId" IN (SELECT "userId" from follows where "followerId"=${userDetails.userId}) AND "followerId"!=${userDetails.userId}`;
  if (followingIds.length) {
    query = `${query} AND "followerId" NOT IN (${transformArrayOfIds(
      followingIds,
    )})`;
  }
  if (searchText)
    query = `${query} AND ("firstName" ILIKE '%${searchText}%' OR "lastName" ILIKE '%${searchText}%' OR "userName" ILIKE '%${searchText}%') `;

  return query;
};

const generateSuggestionsQuery = (
  userDetails,
  followingIds,
  searchText,
  limit = 21,
  after = 0,
  blockedUserIds,
) => {
  logger.message(
    `Executing generateSuggestionsQuery for user ${userDetails.userId}`,
  );
  let blockedUserQuery = '';
  if (blockedUserIds.length > 0)
    blockedUserQuery = `AND "userId" NOT IN (${transformArrayOfIds(
      blockedUserIds,
    )})`;

  const query = `SELECT * from (SELECT row_number() over (partition by true) as row_num, * from (
    SELECT "userId", "firstName", "lastName","userName","imageId","interests" from users where "isSuspended"=false AND
    "userId" IN
    (
      SELECT "contactUserId" from synced_contacts where "userId" = ${
        userDetails.userId
      } UNION
      ${interestsBasedSuggestionQuery(
        userDetails,
        followingIds,
        searchText,
      )}

      ${addressBasedSuggestionQuery(
        userDetails,
        followingIds,
        searchText,
      )}

      ${followingFollowsBasedSuggestionQuery(
        userDetails,
        followingIds,
        searchText,
      )}

      ${followersFollowsBasedSuggestionQuery(
        userDetails,
        followingIds,
        searchText,
      )}
    ) ${blockedUserQuery}
    ) as new_sug)as sug where sug.row_num>${after} LIMIT ${limit}`;
  logger.message(
    `Query for suggestion generated succesfully ${query}`,
  );
  return query;
};

const paginateData = (users, limit) => {
  logger.message(`Executing paginate data`);
  const hasNextPage = users.length === limit;

  let endCursor;
  if (users.length === 1) {
    endCursor = users[0].row_num;
  } else if (hasNextPage) {
    endCursor = users[users.length - 2].row_num;
  } else if (users.length === 0) {
    endCursor = null;
  } else {
    endCursor = users[users.length - 1].row_num;
  }

  const userList = users;

  if (userList.length === limit) {
    userList.splice(limit - 1, 1);
  }

  userList.forEach((user) => {
    // eslint-disable-next-line no-param-reassign
    delete user.row_num;
    // eslint-disable-next-line no-param-reassign
    user.youFollowed = false;
  });
  return {
    data: userList,
    pageInfo: {
      hasNextPage,
      endCursor,
    },
  };
};

const modifyUserList = (users, userFollowersLists) => {
  users.forEach((user) => {
    if (userFollowersLists.includes(user.userId)) {
      // eslint-disable-next-line no-param-reassign
      user.isFollowingYou = true;
    } else {
      // eslint-disable-next-line no-param-reassign
      user.isFollowingYou = false;
    }
  });

  return users;
};

const getUsersSuggestionService = async (
  { limit = 20, after, search },
  body,
) => {
  try {
    const pageLimit = Number(limit) + 1;
    const userDetails = await getUserDetails(body.user.userId);
    const blockedUserIds = await getBlockedUserList(body.user.userId);

    let userFollows = await models.Follow.findAll({
      where: { userId: body.user.userId },
    });

    userFollows = userFollows.map(
      (userFollow) => userFollow.followerId,
    );
    const suggestionQuery = generateSuggestionsQuery(
      userDetails,
      userFollows,
      search,
      pageLimit,
      after,
      blockedUserIds,
    );

    const users = await models.sequelize.query(suggestionQuery, {
      type: QueryTypes.SELECT,
    });

    let modifiedUserList = [];
    if (users.length) {
      const userFollowers = await models.Follow.findAll({
        where: { followerId: body.user.userId },
      });

      const userFollowersLists = userFollowers.map(
        (userFollow) => userFollow.userId,
      );
      modifiedUserList = modifyUserList(users, userFollowersLists);
    }

    return Promise.resolve(paginateData(modifiedUserList, pageLimit));
  } catch (error) {
    logger.message(`Error occurred while fetching user suggestions`);
    return Promise.reject(error);
  }
};

module.exports = getUsersSuggestionService;
