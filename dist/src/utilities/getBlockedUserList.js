"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _exceptions = require("./exceptions");

var _models = _interopRequireDefault(require("../models"));

var _sequelize = require("sequelize");

var _logger = _interopRequireDefault(require("../../config/logger"));

var getBlockedUserList = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userId) {
    var blockedUserId, blockedIds;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            _logger["default"].message('Getting Blocked User');

            blockedUserId = [];
            _context.next = 5;
            return _models["default"].sequelize.query("SELECT \"blockByUserId\",\"blockedUserId\" FROM \"blockUsers\" WHERE \"blockByUserId\"= ".concat(userId, " OR \"blockedUserId\" = ").concat(userId), {
              type: _sequelize.QueryTypes.SELECT
            });

          case 5:
            blockedIds = _context.sent;
            blockedIds.map(function (blocked) {
              var blockedId = parseInt(blocked.blockedUserId, 10);
              var blockedById = parseInt(blocked.blockByUserId, 10);
              return blockedUserId.push(blockedId, blockedById);
            });

            _logger["default"].message('BlockedUser Executed Successfully');

            return _context.abrupt("return", blockedUserId);

          case 11:
            _context.prev = 11;
            _context.t0 = _context["catch"](0);

            _logger["default"].message('Error while getting Blocked User');

            return _context.abrupt("return", Promise.reject(new _exceptions.ServerException('Unable to Connect BlockUserModel')));

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 11]]);
  }));

  return function getBlockedUserList(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = getBlockedUserList;
exports["default"] = _default;