"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _validUserId = _interopRequireDefault(require("../../utilities/validUserId"));

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

/**
 *
 * @param {
 * "name":string
 * "addressType":string,
 * "fieldType":string,
 * "minOptionLimit":int,
 * "maxOptionLimit":int,
 * "status":ENUM
 * } data
 */
function followerExists(userId, followerId) {
  var whereCondition = {
    where: {
      userId: userId,
      followerId: followerId
    }
  };
  return _models["default"].Follow.findAll(whereCondition).then(function (count) {
    if (count.length === 0) {
      return false;
    }

    return true;
  });
}

var increaseFollowerCount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userId) {
    var isIncrease;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].User.increment('followers', {
              by: 1,
              where: {
                userId: userId
              }
            }).then(function (count) {
              if (count.length === 0) {
                return false;
              }

              return true;
            });

          case 2:
            isIncrease = _context.sent;
            return _context.abrupt("return", isIncrease);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function increaseFollowerCount(_x) {
    return _ref.apply(this, arguments);
  };
}();

var increaseFollowingCount = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(userId) {
    var isIncrease;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].User.increment('followings', {
              by: 1,
              where: {
                userId: userId
              }
            }).then(function (count) {
              if (count.length === 0) {
                return false;
              }

              return true;
            });

          case 2:
            isIncrease = _context2.sent;
            return _context2.abrupt("return", isIncrease);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function increaseFollowingCount(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var followService = function followService(followDetail) {
  _logger["default"].message("Executing followService");

  return new Promise(function (resolve, reject) {
    (0, _validUserId["default"])(followDetail.followerId).then( /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(userCount) {
        var followData, isAlreadyFollowed;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                followData = {
                  userId: followDetail.user.userId,
                  followerId: followDetail.followerId
                };

                if (!(userCount != null)) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 4;
                return followerExists(followData.userId.toString(), followData.followerId).then(function (isUnique) {
                  if (isUnique) {
                    return reject(new _exceptions.BadRequestException('You are already followed this user'));
                  }

                  return true;
                });

              case 4:
                isAlreadyFollowed = _context4.sent;

                if (!isAlreadyFollowed) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 8;
                return _models["default"].Follow.create(followData).then( /*#__PURE__*/function () {
                  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(savedFollower) {
                    return _regenerator["default"].wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            _logger["default"].message("Executing followService was successful");

                            _context3.next = 3;
                            return increaseFollowerCount(followData.followerId);

                          case 3:
                            _context3.next = 5;
                            return increaseFollowingCount(followData.userId);

                          case 5:
                            (0, _publishToKafka["default"])('FOLLOWER-UPDATES', savedFollower, 'CREATE');
                            return _context3.abrupt("return", resolve({
                              followId: savedFollower.followId
                            }));

                          case 7:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x4) {
                    return _ref4.apply(this, arguments);
                  };
                }())["catch"](function (error) {
                  _logger["default"].message("Error occurred while executing followService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

                  return reject(new _exceptions.ServerException('Unable to followService'));
                });

              case 8:
                return _context4.abrupt("return", reject(new _exceptions.ResourceNotFoundException('Unable to find follower')));

              case 9:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());
  });
};

module.exports = followService;