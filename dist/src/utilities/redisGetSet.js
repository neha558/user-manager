"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteKey = exports.getDataFromRedis = exports.setDataInRedis = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _logger = _interopRequireDefault(require("../../config/logger"));

var _connectRedis = _interopRequireDefault(require("../../config/connectRedis"));

var setDataInRedis = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(key, contactList) {
    var pipeline, setDataResponse;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pipeline = _connectRedis["default"].pipeline();
            pipeline.del(key);
            contactList.forEach(function (value, index) {
              pipeline.zadd(key, index, JSON.stringify(value));
            });
            _context.next = 5;
            return pipeline.exec(function (err, results) {
              if (err) {
                _logger["default"].message("error on executing setDataInRedis ".concat(err));

                return err;
              }

              _logger["default"].message("redis results ".concat(results));

              return true;
            });

          case 5:
            setDataResponse = _context.sent;
            return _context.abrupt("return", setDataResponse);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function setDataInRedis(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.setDataInRedis = setDataInRedis;

var getDataFromRedis = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(key, start, end) {
    var lists;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _connectRedis["default"].zrange(key, start, end).then(function (res) {
              return res;
            });

          case 2:
            lists = _context2.sent;
            return _context2.abrupt("return", lists);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getDataFromRedis(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getDataFromRedis = getDataFromRedis;

var deleteKey = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(key) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _connectRedis["default"].del(key);

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function deleteKey(_x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.deleteKey = deleteKey;