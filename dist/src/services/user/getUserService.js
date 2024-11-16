"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _cursorUtils = require("../../utilities/cursorUtils");

var _sequelize = require("sequelize");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var getListOfFollows = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userId) {
    var follows, followsIds;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _models["default"].Follow.findAll({
              where: {
                userId: userId
              }
            });

          case 3:
            follows = _context.sent;
            followsIds = follows.map(function (follow) {
              return follow.followerId;
            });
            return _context.abrupt("return", Promise.resolve(followsIds));

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);

            _logger["default"].message("Error occurred while getting list of follows ".concat((_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.stack) || _context.t0));

            return _context.abrupt("return", Promise.reject(new _exceptions.ServerException('Unable to get user')));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));

  return function getListOfFollows(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getSearchQuery = function getSearchQuery(searchText) {
  var searchTerms = searchText.split(' ');
  searchTerms = searchTerms.map(function (searchTerm) {
    return (0, _defineProperty2["default"])({}, _sequelize.Op.iLike, "%".concat(searchTerm, "%"));
  });
  var searchQuery = {};

  if (searchTerms.length === 1) {
    searchQuery[_sequelize.Op.or] = {
      firstName: (0, _defineProperty2["default"])({}, _sequelize.Op.or, searchTerms),
      lastName: (0, _defineProperty2["default"])({}, _sequelize.Op.or, searchTerms)
    };
  } else {
    searchQuery[_sequelize.Op.or] = (0, _defineProperty2["default"])({}, _sequelize.Op.and, {
      firstName: (0, _defineProperty2["default"])({}, _sequelize.Op.or, (0, _defineProperty2["default"])({}, _sequelize.Op.or, searchTerms)),
      lastName: (0, _defineProperty2["default"])({}, _sequelize.Op.or, (0, _defineProperty2["default"])({}, _sequelize.Op.or, searchTerms))
    });
  }

  return searchQuery;
};

var generateQuery = function generateQuery(userIds, limit, after, searchText) {
  _logger["default"].message("Executing generatePaginationQuery with limit ".concat(limit, " searchText ").concat(searchText, " and after ").concat(after));

  var query = {};

  if (userIds) {
    query.where = {
      userId: JSON.parse(userIds)
    };
    return query;
  } // Not putting limit before the userIds condition is because we want all users with givenIds
  // without any limit


  if (limit) {
    query.limit = parseInt(limit, 10) + 1;
  }

  if (after) {
    query.where = {
      userId: (0, _defineProperty2["default"])({}, _sequelize.Op.gt, (0, _cursorUtils.decodeCursor)(after))
    };
  }

  if (searchText) {
    var searchQuery = getSearchQuery(searchText);
    query.where = _objectSpread(_objectSpread({}, query.where), searchQuery);
  }

  _logger["default"].message("Executed generateQuery successfully with query ".concat(JSON.stringify(query, null, 2)));

  return query;
};

var generatePaginatedUserList = function generatePaginatedUserList(users, userIds, limit, getPaginated) {
  if (userIds) {
    if (getPaginated) {
      return {
        data: users,
        pageInfo: {
          hasNextPage: false,
          endCursor: null
        }
      };
    }

    return users;
  }

  var hasNextPage = users.length === parseInt(limit, 10) + 1;
  var endCursor;

  if (users.length === 1) {
    endCursor = users[0].userId;
  } else if (hasNextPage) {
    endCursor = users[users.length - 2].userId;
  } else {
    endCursor = users[users.length - 1].userId;
  }

  var userList = users;

  if (userList.length !== parseInt(limit, 10)) {
    userList.splice(parseInt(limit, 10), 1);
  }

  return {
    data: userList,
    pageInfo: {
      hasNextPage: hasNextPage,
      endCursor: (0, _cursorUtils.encodeCursor)(endCursor)
    }
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


var getUserService = function getUserService(_ref3, userId) {
  var userIds = _ref3.userIds,
      _ref3$limit = _ref3.limit,
      limit = _ref3$limit === void 0 ? 20 : _ref3$limit,
      after = _ref3.after,
      search = _ref3.search,
      getPaginated = _ref3.getPaginated;

  _logger["default"].message("Executing getUserService");

  return new Promise(function (resolve, reject) {
    _models["default"].User.findAll(generateQuery(userIds, limit, after, search)).then( /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(users) {
        var userFollowsIds, plainUserList, userList;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _logger["default"].message("Executing getUserService was successful");

                _context2.next = 3;
                return getListOfFollows(userId);

              case 3:
                userFollowsIds = _context2.sent;
                plainUserList = users.map(function (user) {
                  var plainUserObject = user.get({
                    plain: true
                  });

                  if (userFollowsIds.includes(plainUserObject.userId)) {
                    plainUserObject.youFollowed = true;
                  } else {
                    plainUserObject.youFollowed = false;
                  }

                  return plainUserObject;
                });
                userList = generatePaginatedUserList(plainUserList, userIds, limit, getPaginated);
                return _context2.abrupt("return", resolve(userList));

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      return function (_x2) {
        return _ref4.apply(this, arguments);
      };
    }())["catch"](function (error) {
      _logger["default"].message("Error occurred while executing getUserService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), '');

      return reject(new _exceptions.ServerException('Unable to get user'));
    });
  });
};

module.exports = getUserService;