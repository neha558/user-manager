"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _validUserId = _interopRequireDefault(require("../../utilities/validUserId"));

var _models = _interopRequireDefault(require("../../models"));

var _exceptions = require("../../utilities/exceptions");

var _safeAwait = _interopRequireDefault(require("safe-await"));

var _follower = _interopRequireDefault(require("../follower"));

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

/**
 *
 * @param {
 * "blockByUserId":int,
 * "blockedUserId":int,
 * } data
 */
var checkIfUserIsBlocked = function checkIfUserIsBlocked(blockByUserId, blockedUserId) {
  var whereCondition = {
    where: {
      blockByUserId: blockByUserId,
      blockedUserId: blockedUserId
    }
  };
  return _models["default"].BlockUser.findOne(whereCondition).then(function (data) {
    return data;
  })["catch"](function () {
    _logger["default"].message('Unable to connect to BlockUser Model.');

    throw new _exceptions.ServerException('Unable to connect BlockUser!');
  });
};

var blockUser = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(blockUserId, userId) {
    var isBlocked, blockUserData;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _logger["default"].message('Executing blockUser!');

            _context2.prev = 1;
            _context2.next = 4;
            return checkIfUserIsBlocked(userId, blockUserId);

          case 4:
            isBlocked = _context2.sent;

            if (!isBlocked) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", Promise.reject(new _exceptions.BadRequestException('You have already blocked this user!')));

          case 7:
            blockUserData = {
              blockByUserId: userId,
              blockedUserId: blockUserId
            };
            return _context2.abrupt("return", _models["default"].BlockUser.create(blockUserData).then( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(insertedData) {
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return (0, _safeAwait["default"])(_follower["default"].unfollowService({
                          followerId: blockUserId,
                          user: {
                            userId: userId
                          }
                        }));

                      case 2:
                        _context.next = 4;
                        return (0, _safeAwait["default"])(_follower["default"].unfollowService({
                          followerId: userId,
                          user: {
                            userId: blockUserId
                          }
                        }));

                      case 4:
                        (0, _publishToKafka["default"])('BLOCK-USER-UPDATES', insertedData, 'CREATE');
                        return _context.abrupt("return", {
                          blockedByUserId: insertedData.blockByUserId,
                          blockedUserId: insertedData.blockedUserId
                        });

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function () {
              _logger["default"].message('Error while inserting blockuser data');

              Promise.reject(new _exceptions.ServerException('Unable to connect BlockUser Model'));
            }));

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](1);

            _logger["default"].message('Error Executing blockService!');

            return _context2.abrupt("return", Promise.reject(new _exceptions.ServerException('Unable to connect BlockUser Model!')));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 11]]);
  }));

  return function blockUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var unblockUser = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(blockUserId, userId) {
    var isBlocked, unblockUserData, whereCondition;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _logger["default"].message('Executing unblockUser!');

            _context3.prev = 1;
            _context3.next = 4;
            return checkIfUserIsBlocked(userId, blockUserId);

          case 4:
            isBlocked = _context3.sent;

            if (isBlocked) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", Promise.reject(new _exceptions.BadRequestException('You have not blocked this user!')));

          case 7:
            unblockUserData = {
              blockByUserId: userId,
              blockedUserId: blockUserId
            };
            whereCondition = {
              where: unblockUserData,
              force: true
            };
            return _context3.abrupt("return", _models["default"].BlockUser.destroy(whereCondition).then(function () {
              _logger["default"].message("Executing unblockService was successful");

              (0, _publishToKafka["default"])('BLOCK-USER-UPDATES', unblockUserData, 'DELETE');
              return unblockUserData;
            })["catch"](function (error) {
              _logger["default"].message("Error occurred while executing unblockService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

              return Promise.reject(new _exceptions.ServerException('Unable to perform unblockService'));
            }));

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](1);

            _logger["default"].message('Error Executing unblockService!');

            return _context3.abrupt("return", Promise.reject(new _exceptions.ServerException('Unable to connect BlockUser Model!')));

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 12]]);
  }));

  return function unblockUser(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var blockUserService = function blockUserService(blockUserId, userId, action) {
  _logger["default"].message('Executing blockHandlerService!');

  var blockAction = {
    block: blockUser,
    unblock: unblockUser
  };
  return new Promise(function (resolve, reject) {
    (0, _validUserId["default"])(blockUserId).then( /*#__PURE__*/function () {
      var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(userDetail) {
        var allowedActions, _yield$safeAwait, _yield$safeAwait2, errorResponse, blockResponse;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(userDetail !== null)) {
                  _context4.next = 14;
                  break;
                }

                allowedActions = ['block', 'unblock'];

                if (!allowedActions.includes(action)) {
                  _context4.next = 13;
                  break;
                }

                _context4.next = 5;
                return (0, _safeAwait["default"])(blockAction[action](blockUserId, userId));

              case 5:
                _yield$safeAwait = _context4.sent;
                _yield$safeAwait2 = (0, _slicedToArray2["default"])(_yield$safeAwait, 2);
                errorResponse = _yield$safeAwait2[0];
                blockResponse = _yield$safeAwait2[1];

                if (!errorResponse) {
                  _context4.next = 11;
                  break;
                }

                return _context4.abrupt("return", reject(errorResponse));

              case 11:
                if (!blockResponse) {
                  _context4.next = 13;
                  break;
                }

                return _context4.abrupt("return", resolve(blockResponse));

              case 13:
                return _context4.abrupt("return", reject(new _exceptions.BadRequestException('Given block action is invalid. It Should be block/unblock.')));

              case 14:
                return _context4.abrupt("return", reject(new _exceptions.ResourceNotFoundException('Unable to find UserID')));

              case 15:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x6) {
        return _ref4.apply(this, arguments);
      };
    }())["catch"](function (error) {
      _logger["default"].message('Error Executing blockHandlerService');

      if (error) {
        return reject(error);
      }

      return reject(new _exceptions.ServerException('Unable to connect User Model'));
    });
  });
};

module.exports = blockUserService;