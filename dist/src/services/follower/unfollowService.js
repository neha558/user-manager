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

    return count;
  });
}

var decreaseFollowerCount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userId) {
    var isDecrease;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _models["default"].User.decrement('followers', {
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
            isDecrease = _context.sent;
            return _context.abrupt("return", isDecrease);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function decreaseFollowerCount(_x) {
    return _ref.apply(this, arguments);
  };
}();

var decreaseFollowingCount = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(userId) {
    var isDecrease;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _models["default"].User.decrement('followings', {
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
            isDecrease = _context2.sent;
            return _context2.abrupt("return", isDecrease);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function decreaseFollowingCount(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var followService = function followService(followDetail) {
  _logger["default"].message("Executing followService");

  return new Promise(function (resolve, reject) {
    (0, _validUserId["default"])(followDetail.followerId).then( /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(userCount) {
        var followData;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                followData = {
                  userId: followDetail.user.userId,
                  followerId: followDetail.followerId
                };

                if (!(userCount != null)) {
                  _context5.next = 4;
                  break;
                }

                _context5.next = 4;
                return followerExists(followData.userId.toString(), followData.followerId).then( /*#__PURE__*/function () {
                  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(isUnique) {
                    var whereCondition;
                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            if (!isUnique) {
                              _context4.next = 4;
                              break;
                            }

                            whereCondition = {
                              where: followData,
                              force: true
                            };
                            _context4.next = 4;
                            return _models["default"].Follow.destroy(whereCondition).then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
                              return _regenerator["default"].wrap(function _callee3$(_context3) {
                                while (1) {
                                  switch (_context3.prev = _context3.next) {
                                    case 0:
                                      _logger["default"].message("Executing followService was successful");

                                      _context3.next = 3;
                                      return decreaseFollowerCount(followData.followerId);

                                    case 3:
                                      _context3.next = 5;
                                      return decreaseFollowingCount(followData.userId);

                                    case 5:
                                      (0, _publishToKafka["default"])('FOLLOWER-UPDATES', {
                                        userId: followDetail.user.userId,
                                        followerId: followDetail.followerId
                                      }, 'DELETE');
                                      return _context3.abrupt("return", resolve({
                                        message: 'unfollowed successfully'
                                      }));

                                    case 7:
                                    case "end":
                                      return _context3.stop();
                                  }
                                }
                              }, _callee3);
                            })))["catch"](function (error) {
                              _logger["default"].message("Error occurred while executing followService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

                              return reject(new _exceptions.ServerException('Unable to followService'));
                            });

                          case 4:
                            return _context4.abrupt("return", reject(new _exceptions.BadRequestException('You are not followed this user')));

                          case 5:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x4) {
                    return _ref4.apply(this, arguments);
                  };
                }());

              case 4:
                return _context5.abrupt("return", reject(new _exceptions.ResourceNotFoundException('Unable to find follower')));

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());
  });
};

module.exports = followService;