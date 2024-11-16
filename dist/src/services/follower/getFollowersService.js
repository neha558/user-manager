"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _ResourceNotFoundException = _interopRequireDefault(require("../../utilities/exceptions/ResourceNotFoundException"));

var _commons = require("../../utilities/commons");

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _sequelize = require("sequelize");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var createWhereClause = function createWhereClause(search, after, userIds) {
  _logger["default"].message('Creating where clause in getFollowersService');

  var where = {
    userId: (0, _defineProperty2["default"])({}, _sequelize.Op["in"], userIds),
    isSuspended: false
  };

  if (after) {
    where.userId = _objectSpread(_objectSpread({}, where.userId), {}, (0, _defineProperty2["default"])({}, _sequelize.Op.lt, after));
  }

  if (search) {
    var searchTerms = search.split(' ');
    searchTerms = searchTerms.map(function (searchTerm) {
      return (0, _defineProperty2["default"])({}, _sequelize.Op.iLike, "%".concat(searchTerm, "%"));
    });

    if (searchTerms.length < 2) {
      where[_sequelize.Op.or] = _objectSpread(_objectSpread({}, where[_sequelize.Op.or]), {}, {
        firstName: (0, _defineProperty2["default"])({}, _sequelize.Op.or, searchTerms),
        lastName: (0, _defineProperty2["default"])({}, _sequelize.Op.or, searchTerms),
        userName: (0, _defineProperty2["default"])({}, _sequelize.Op.or, searchTerms)
      });
    } else {
      where[_sequelize.Op.or] = _objectSpread(_objectSpread({}, where[_sequelize.Op.or]), {}, (0, _defineProperty2["default"])({}, _sequelize.Op.and, {
        firstName: (0, _defineProperty2["default"])({}, _sequelize.Op.or, (0, _defineProperty2["default"])({}, _sequelize.Op.or, searchTerms)),
        lastName: (0, _defineProperty2["default"])({}, _sequelize.Op.or, (0, _defineProperty2["default"])({}, _sequelize.Op.or, searchTerms)),
        userName: (0, _defineProperty2["default"])({}, _sequelize.Op.or, (0, _defineProperty2["default"])({}, _sequelize.Op.or, searchTerms))
      }));
    }
  }

  return where;
};

var getListOfFollows = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userId) {
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
    return _ref2.apply(this, arguments);
  };
}();

function getFollowers(userIds, search, after, limit, userId) {
  var where = createWhereClause(search, after, userIds);
  var attributes = ['userId', 'firstName', 'lastName', 'userName', 'imageId'];
  return _models["default"].User.findAll({
    where: where,
    limit: limit,
    attributes: attributes,
    order: [['createdAt', 'DESC']]
  }).then( /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(users) {
      var userFollowsIds, plainUserList;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(users.length === 0)) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", {
                data: [],
                pageInfo: {
                  hasNextPage: false,
                  endCursor: null
                }
              });

            case 2:
              _context2.next = 4;
              return getListOfFollows(userId);

            case 4:
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
              return _context2.abrupt("return", (0, _commons.paginateData)(plainUserList, limit));

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2) {
      return _ref3.apply(this, arguments);
    };
  }());
}
/**
 *
 * @param { id:string } params
 */


var getFollowersService = function getFollowersService(userId, _ref4) {
  var search = _ref4.search,
      after = _ref4.after,
      _ref4$limit = _ref4.limit,
      limit = _ref4$limit === void 0 ? 20 : _ref4$limit;

  _logger["default"].message("Executing getFollowersService");

  return new Promise(function (resolve, reject) {
    var pageLimit = Number(limit) + 1;

    _models["default"].Follow.findAll({
      where: {
        followerId: userId
      }
    }).then( /*#__PURE__*/function () {
      var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(followers) {
        var followerIds, followersList;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                followerIds = [];
                followers.map(function (follower) {
                  var followerId = parseInt(follower.userId, 10);
                  return followerIds.push(followerId);
                });
                _context3.next = 5;
                return getFollowers(followerIds, search, after, pageLimit, userId);

              case 5:
                followersList = _context3.sent;

                if (!followersList) {
                  _context3.next = 9;
                  break;
                }

                _logger["default"].message("Executing getFollowersService was successful");

                return _context3.abrupt("return", resolve(followersList));

              case 9:
                return _context3.abrupt("return", reject(new _ResourceNotFoundException["default"]('You do not have any follower.')));

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](0);

                if (!_context3.t0) {
                  _context3.next = 17;
                  break;
                }

                _logger["default"].message("Uncaught error occurred status ".concat((_context3.t0 === null || _context3.t0 === void 0 ? void 0 : _context3.t0.stack) || _context3.t0));

                return _context3.abrupt("return", reject(_context3.t0));

              case 17:
                return _context3.abrupt("return", reject(new _exceptions.ServerException('Unable to getFollowingService')));

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 12]]);
      }));

      return function (_x3) {
        return _ref5.apply(this, arguments);
      };
    }())["catch"](function (error) {
      _logger["default"].message("Uncaught error occurred status getFollowersService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to getFollowersService'));
    });
  });
};

module.exports = getFollowersService;