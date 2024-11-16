"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _safeAwait = _interopRequireDefault(require("safe-await"));

var followerExists = function followerExists(loggedUserId, followerId) {
  var whereCondition = {
    where: {
      userId: loggedUserId,
      followerId: followerId
    }
  };
  return _models["default"].Follow.findAll(whereCondition).then(function (count) {
    if (count.length === 0) {
      return false;
    }

    return true;
  });
};

var isBlocked = function isBlocked(loggedUserId, searchedUserID) {
  _logger["default"].message('Executing Blocked user checking');

  var whereCondition = {
    where: {
      blockByUserId: loggedUserId,
      blockedUserId: searchedUserID
    }
  };
  return _models["default"].BlockUser.findAll(whereCondition).then(function (count) {
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


var getUserByUserNameService = function getUserByUserNameService(loggedInUserId, userName) {
  _logger["default"].message("Executing getUserByUserNameService"); // NOTE: This is to stop UI from breaking as currently UI sends userId instead of sending userName, this logic can be removed once UI starts sending userName only


  var where = {}; // eslint-disable-next-line no-restricted-globals

  if (isNaN(userName)) {
    where = {
      userName: userName,
      isSuspended: false
    };
  } else {
    where = {
      userId: userName,
      isSuspended: false
    };
  }

  return new Promise(function (resolve, reject) {
    _models["default"].User.findOne({
      where: where
    }).then( /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user) {
        var youFollowed, youBlocked, _yield$safeAwait, _yield$safeAwait2, isUserBlocked, userObject;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!((user === null || user === void 0 ? void 0 : user.userId) == null)) {
                  _context.next = 3;
                  break;
                }

                _logger["default"].message("Unable to find getUserByUserNameService by userName ".concat(userName));

                return _context.abrupt("return", reject(new _exceptions.ResourceNotFoundException('User not found')));

              case 3:
                youFollowed = false;
                youBlocked = false;
                _context.prev = 5;
                _context.next = 8;
                return isBlocked(loggedInUserId, user.userId);

              case 8:
                youBlocked = _context.sent;
                _context.next = 11;
                return (0, _safeAwait["default"])(isBlocked(user.userId, loggedInUserId));

              case 11:
                _yield$safeAwait = _context.sent;
                _yield$safeAwait2 = (0, _slicedToArray2["default"])(_yield$safeAwait, 2);
                isUserBlocked = _yield$safeAwait2[1];

                if (!isUserBlocked) {
                  _context.next = 16;
                  break;
                }

                return _context.abrupt("return", reject(new _exceptions.ResourceNotFoundException('User not found')));

              case 16:
                _context.next = 18;
                return followerExists(loggedInUserId, user.userId);

              case 18:
                youFollowed = _context.sent;
                _context.next = 24;
                break;

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](5);
                throw new _exceptions.ServerException('Unable to get Followed detail');

              case 24:
                userObject = {
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
                  youFollowed: youFollowed,
                  youBlocked: youBlocked,
                  bio: user.bio,
                  description: user.description,
                  dateOfBirth: user.dateOfBirth,
                  followings: user.followings,
                  createdAt: user.createdAt
                };

                _logger["default"].message("Executing getUserByUserNameService was successful");

                return _context.abrupt("return", resolve(userObject));

              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[5, 21]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }())["catch"](function (error) {
      _logger["default"].message("Error occurred while executing getUserByUserNameService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to find getUserByUserNameService'));
    });
  });
};

module.exports = getUserByUserNameService;