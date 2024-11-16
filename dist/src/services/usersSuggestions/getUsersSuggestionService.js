"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _commons = require("../../utilities/commons");

var _sequelize = require("sequelize");

var _getBlockedUserList = _interopRequireDefault(require("../../utilities/getBlockedUserList"));

/* eslint-disable indent */
var getUserDetails = function getUserDetails(userId) {
  return new Promise(function (resolve, reject) {
    _models["default"].User.findOne({
      where: {
        userId: userId
      },
      include: [{
        model: _models["default"].Address,
        though: 'addresses',
        as: 'address'
      }]
    }).then(function (user) {
      _logger["default"].message("Executing getUserDetails for suggestions was successful");

      if (!user) {
        // eslint-disable-next-line no-param-reassign
        user = {};
      }

      return resolve((0, _commons.removeNullFromObject)(user));
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing getUserDetails for suggestions ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), '');

      return reject(new _exceptions.ServerException('Unable to getUserDetails for suggestions'));
    });
  });
};

var transformArrayOfIds = function transformArrayOfIds(array) {
  var stringifiedArrayElements = array.map(function (item) {
    return item.toString();
  });
  return stringifiedArrayElements.join();
};

var interestsBasedSuggestionQuery = function interestsBasedSuggestionQuery(userDetails, followingIds, searchText) {
  if (followingIds.length || userDetails.interests !== undefined) {
    var query = "SELECT \"userId\" from users where";

    if (userDetails.interests !== undefined) {
      query = "".concat(query, " interests && '{").concat(transformArrayOfIds(userDetails.interests), "}' AND \"userId\"!=").concat(userDetails.userId);
    }

    if (followingIds.length) {
      query = "".concat(query, " AND \"userId\" NOT IN (").concat(transformArrayOfIds(followingIds), ") ");
    }

    if (searchText) {
      query = "".concat(query, " AND (\"firstName\" ILIKE '%").concat(searchText, "%' OR \"lastName\" ILIKE '%").concat(searchText, "%' OR \"userName\" ILIKE '%").concat(searchText, "%') ");
    }

    query = "".concat(query, " UNION");
    return query;
  }

  return '';
};

var addressBasedSuggestionQuery = function addressBasedSuggestionQuery(userDetails, followingIds, searchText) {
  var _userDetails$address;

  var query = "SELECT \"userId\" from users where \"userId\" IN (SELECT \"userId\" from addresses where addresses.city='".concat((_userDetails$address = userDetails.address) === null || _userDetails$address === void 0 ? void 0 : _userDetails$address.city, "' AND \"userId\"!=").concat(userDetails.userId);

  if (followingIds.length) {
    query = "".concat(query, " AND \"userId\" NOT IN (").concat(transformArrayOfIds(followingIds), ")");
  }

  query = "".concat(query, " )");

  if (searchText) {
    query = "".concat(query, " AND (\"firstName\" ILIKE '%").concat(searchText, "%' OR \"lastName\" ILIKE '%").concat(searchText, "%' OR \"userName\" ILIKE '%").concat(searchText, "%') ");
  }

  query = "".concat(query, " UNION");
  return query;
};

var followingFollowsBasedSuggestionQuery = function followingFollowsBasedSuggestionQuery(userDetails, followingIds, searchText) {
  if (followingIds.length) {
    var query = "SELECT \"followerId\" from follows where";
    query = "".concat(query, " \"userId\" IN (").concat(transformArrayOfIds(followingIds), ") AND  \"followerId\"!=").concat(userDetails.userId);
    query = "".concat(query, " AND \"followerId\" NOT IN (").concat(transformArrayOfIds(followingIds), ")");
    if (searchText) query = "".concat(query, " AND (\"firstName\" ILIKE '%").concat(searchText, "%' OR \"lastName\" ILIKE '%").concat(searchText, "%' OR \"userName\" ILIKE '%").concat(searchText, "%') ");
    query = "".concat(query, " UNION");
    return query;
  }

  return '';
};

var followersFollowsBasedSuggestionQuery = function followersFollowsBasedSuggestionQuery(userDetails, followingIds, searchText) {
  var query = "SELECT \"followerId\" from follows where \"userId\" IN (SELECT \"userId\" from follows where \"followerId\"=".concat(userDetails.userId, ") AND \"followerId\"!=").concat(userDetails.userId);

  if (followingIds.length) {
    query = "".concat(query, " AND \"followerId\" NOT IN (").concat(transformArrayOfIds(followingIds), ")");
  }

  if (searchText) query = "".concat(query, " AND (\"firstName\" ILIKE '%").concat(searchText, "%' OR \"lastName\" ILIKE '%").concat(searchText, "%' OR \"userName\" ILIKE '%").concat(searchText, "%') ");
  return query;
};

var generateSuggestionsQuery = function generateSuggestionsQuery(userDetails, followingIds, searchText) {
  var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 21;
  var after = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var blockedUserIds = arguments.length > 5 ? arguments[5] : undefined;

  _logger["default"].message("Executing generateSuggestionsQuery for user ".concat(userDetails.userId));

  var blockedUserQuery = '';
  if (blockedUserIds.length > 0) blockedUserQuery = "AND \"userId\" NOT IN (".concat(transformArrayOfIds(blockedUserIds), ")");
  var query = "SELECT * from (SELECT row_number() over (partition by true) as row_num, * from (\n    SELECT \"userId\", \"firstName\", \"lastName\",\"userName\",\"imageId\",\"interests\" from users where \"isSuspended\"=false AND\n    \"userId\" IN\n    (\n      SELECT \"contactUserId\" from synced_contacts where \"userId\" = ".concat(userDetails.userId, " UNION\n      ").concat(interestsBasedSuggestionQuery(userDetails, followingIds, searchText), "\n\n      ").concat(addressBasedSuggestionQuery(userDetails, followingIds, searchText), "\n\n      ").concat(followingFollowsBasedSuggestionQuery(userDetails, followingIds, searchText), "\n\n      ").concat(followersFollowsBasedSuggestionQuery(userDetails, followingIds, searchText), "\n    ) ").concat(blockedUserQuery, "\n    ) as new_sug)as sug where sug.row_num>").concat(after, " LIMIT ").concat(limit);

  _logger["default"].message("Query for suggestion generated succesfully ".concat(query));

  return query;
};

var paginateData = function paginateData(users, limit) {
  _logger["default"].message("Executing paginate data");

  var hasNextPage = users.length === limit;
  var endCursor;

  if (users.length === 1) {
    endCursor = users[0].row_num;
  } else if (hasNextPage) {
    endCursor = users[users.length - 2].row_num;
  } else if (users.length === 0) {
    endCursor = null;
  } else {
    endCursor = users[users.length - 1].row_num;
  }

  var userList = users;

  if (userList.length === limit) {
    userList.splice(limit - 1, 1);
  }

  userList.forEach(function (user) {
    // eslint-disable-next-line no-param-reassign
    delete user.row_num; // eslint-disable-next-line no-param-reassign

    user.youFollowed = false;
  });
  return {
    data: userList,
    pageInfo: {
      hasNextPage: hasNextPage,
      endCursor: endCursor
    }
  };
};

var modifyUserList = function modifyUserList(users, userFollowersLists) {
  users.forEach(function (user) {
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

var getUsersSuggestionService = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref, body) {
    var _ref$limit, limit, after, search, pageLimit, userDetails, blockedUserIds, userFollows, suggestionQuery, users, modifiedUserList, userFollowers, userFollowersLists;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _ref$limit = _ref.limit, limit = _ref$limit === void 0 ? 20 : _ref$limit, after = _ref.after, search = _ref.search;
            _context.prev = 1;
            pageLimit = Number(limit) + 1;
            _context.next = 5;
            return getUserDetails(body.user.userId);

          case 5:
            userDetails = _context.sent;
            _context.next = 8;
            return (0, _getBlockedUserList["default"])(body.user.userId);

          case 8:
            blockedUserIds = _context.sent;
            _context.next = 11;
            return _models["default"].Follow.findAll({
              where: {
                userId: body.user.userId
              }
            });

          case 11:
            userFollows = _context.sent;
            userFollows = userFollows.map(function (userFollow) {
              return userFollow.followerId;
            });
            suggestionQuery = generateSuggestionsQuery(userDetails, userFollows, search, pageLimit, after, blockedUserIds);
            _context.next = 16;
            return _models["default"].sequelize.query(suggestionQuery, {
              type: _sequelize.QueryTypes.SELECT
            });

          case 16:
            users = _context.sent;
            modifiedUserList = [];

            if (!users.length) {
              _context.next = 24;
              break;
            }

            _context.next = 21;
            return _models["default"].Follow.findAll({
              where: {
                followerId: body.user.userId
              }
            });

          case 21:
            userFollowers = _context.sent;
            userFollowersLists = userFollowers.map(function (userFollow) {
              return userFollow.userId;
            });
            modifiedUserList = modifyUserList(users, userFollowersLists);

          case 24:
            return _context.abrupt("return", Promise.resolve(paginateData(modifiedUserList, pageLimit)));

          case 27:
            _context.prev = 27;
            _context.t0 = _context["catch"](1);

            _logger["default"].message("Error occurred while fetching user suggestions");

            return _context.abrupt("return", Promise.reject(_context.t0));

          case 31:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 27]]);
  }));

  return function getUsersSuggestionService(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = getUsersSuggestionService;