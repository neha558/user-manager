"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _ResourceNotFoundException = _interopRequireDefault(require("../../utilities/exceptions/ResourceNotFoundException"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _commons = require("../../utilities/commons");

var _sequelize = require("sequelize");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function createWhereClause(search, after, userIds) {
  _logger["default"].message('Creating where clause in getFollowingService');

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
}

function getFollowing(userIds, search, after, limit, userId) {
  var where = createWhereClause(search, after, userIds, userId);
  var attributes = ['userId', 'firstName', 'lastName', 'userName', 'imageId'];
  return _models["default"].User.findAll({
    where: where,
    limit: limit,
    attributes: attributes,
    order: [['createdAt', 'DESC']]
  }).then(function (users) {
    if (users.length === 0) {
      return {
        data: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: null
        }
      };
    } // eslint-disable-next-line no-param-reassign


    users = users.map(function (user) {
      var plainUserObject = user.get({
        plain: true
      });
      plainUserObject.youFollowed = true;
      return plainUserObject;
    });
    return (0, _commons.paginateData)(users, limit);
  });
}
/**
 *
 * @param { id:string } params
 */


var getFollowingService = function getFollowingService(followerId, _ref2) {
  var search = _ref2.search,
      after = _ref2.after,
      _ref2$limit = _ref2.limit,
      limit = _ref2$limit === void 0 ? 20 : _ref2$limit;

  _logger["default"].message("Executing getFollowingService");

  return new Promise(function (resolve, reject) {
    var pageLimit = Number(limit) + 1;

    _models["default"].Follow.findAll({
      where: {
        userId: followerId
      }
    }).then( /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(followers) {
        var followerIds, followersList;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                followerIds = [];
                followers.map(function (follower) {
                  var followingId = parseInt(follower.followerId, 10);
                  return followerIds.push(followingId);
                });
                _context.next = 5;
                return getFollowing(followerIds, search, after, pageLimit);

              case 5:
                followersList = _context.sent;

                if (!followersList) {
                  _context.next = 9;
                  break;
                }

                _logger["default"].message("Executing getFollowingService was successful");

                return _context.abrupt("return", resolve(followersList));

              case 9:
                return _context.abrupt("return", reject(new _ResourceNotFoundException["default"]('You have no following.')));

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](0);

                if (!_context.t0) {
                  _context.next = 16;
                  break;
                }

                return _context.abrupt("return", reject(_context.t0));

              case 16:
                return _context.abrupt("return", reject(new _exceptions.ServerException('Unable to getFollowingService')));

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 12]]);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }())["catch"](function (error) {
      _logger["default"].message("Uncaught error occurred status getFollowingService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to getFollowingService'));
    });
  });
};

module.exports = getFollowingService;