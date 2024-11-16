"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _ResourceNotFoundException = _interopRequireDefault(require("../../utilities/exceptions/ResourceNotFoundException"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _commons = require("../../utilities/commons");

var _redisGetSet = require("../../utilities/redisGetSet");

var getSyncContactService = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req) {
    var body, query, recordLimit, cursor, limit, afterCursor, redisLimit, redisKey, getRedisResponse, resultLists;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _logger["default"].message("Executing getSyncContactService");

            body = req.body, query = req.query;
            recordLimit = query.recordLimit, cursor = query.cursor;
            limit = recordLimit ? Number(recordLimit) + 1 : 500;
            afterCursor = Number(cursor) ? Number(cursor) : 0;
            redisLimit = 0;

            if (afterCursor >= 0) {
              redisLimit = Number(limit) + Number(afterCursor);
            }

            redisKey = "contacts:".concat(body.user.userId);
            _context2.prev = 8;
            _context2.next = 11;
            return (0, _redisGetSet.getDataFromRedis)(redisKey, afterCursor, redisLimit - 1);

          case 11:
            getRedisResponse = _context2.sent;

            if (!(getRedisResponse.length && afterCursor)) {
              _context2.next = 15;
              break;
            }

            resultLists = getRedisResponse.map(function (contact) {
              return JSON.parse(contact);
            });
            return _context2.abrupt("return", Promise.resolve((0, _commons.paginateData)(resultLists, limit, afterCursor)));

          case 15:
            return _context2.abrupt("return", _models["default"].syncedContacts.findAll({
              where: {
                userId: body.user.userId
              }
            }).then( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(contactsObject) {
                var getRedisResponseObject, _resultLists;

                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!contactsObject) {
                          _context.next = 15;
                          break;
                        }

                        _logger["default"].message("Executing getSyncContactService was successful");

                        if (!contactsObject.length) {
                          _context.next = 14;
                          break;
                        }

                        _context.next = 5;
                        return (0, _redisGetSet.deleteKey)(redisKey);

                      case 5:
                        _context.next = 7;
                        return (0, _redisGetSet.setDataInRedis)(redisKey, contactsObject);

                      case 7:
                        _context.next = 9;
                        return (0, _redisGetSet.getDataFromRedis)(redisKey, afterCursor, redisLimit - 1);

                      case 9:
                        getRedisResponseObject = _context.sent;

                        if (!getRedisResponseObject.length) {
                          _context.next = 13;
                          break;
                        }

                        _resultLists = getRedisResponseObject.map(function (contact) {
                          return JSON.parse(contact);
                        });
                        return _context.abrupt("return", Promise.resolve((0, _commons.paginateData)(_resultLists, limit, afterCursor)));

                      case 13:
                        return _context.abrupt("return", Promise.resolve((0, _commons.paginateData)(contactsObject, limit, afterCursor)));

                      case 14:
                        return _context.abrupt("return", Promise.resolve((0, _commons.paginateData)(contactsObject, limit, afterCursor)));

                      case 15:
                        return _context.abrupt("return", Promise.reject(new _ResourceNotFoundException["default"]('getSyncContactService Not Found')));

                      case 16:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x2) {
                return _ref2.apply(this, arguments);
              };
            }())["catch"](function (error) {
              _logger["default"].message(error);

              _logger["default"].message("Uncaught error occurred status getSyncContactService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

              return Promise.reject(new _exceptions.ServerException('Unable to getSyncContactService'));
            }));

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](8);

            _logger["default"].message("Something went wrong ".concat((_context2.t0 === null || _context2.t0 === void 0 ? void 0 : _context2.t0.stack) || _context2.t0));

            return _context2.abrupt("return", Promise.reject(new _exceptions.ServerException("Something went wrong ")));

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[8, 18]]);
  }));

  return function getSyncContactService(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = getSyncContactService;