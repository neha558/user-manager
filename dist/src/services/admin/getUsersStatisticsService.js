"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _exceptions = require("../../utilities/exceptions");

var _sequelize = require("sequelize");

var getUsersStatisticsService = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _createdAt, TODAY_START, NOW, totalUsers, totalUsers24Hours;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            _logger["default"].message("Executing getUsersStatisticsService");

            TODAY_START = new Date().setHours(0, 0, 0, 0);
            NOW = new Date();
            _context.next = 6;
            return _models["default"].User.count();

          case 6:
            totalUsers = _context.sent;
            _context.next = 9;
            return _models["default"].User.count({
              where: {
                createdAt: (_createdAt = {}, (0, _defineProperty2["default"])(_createdAt, _sequelize.Op.gt, TODAY_START), (0, _defineProperty2["default"])(_createdAt, _sequelize.Op.lt, NOW), _createdAt)
              }
            });

          case 9:
            totalUsers24Hours = _context.sent;
            return _context.abrupt("return", Promise.resolve({
              totalUsers: totalUsers,
              totalUsers24Hours: totalUsers24Hours
            }));

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);

            _logger["default"].message("Error occurred while getUsersStatisticsService ".concat(_context.t0));

            return _context.abrupt("return", Promise.reject(new _exceptions.ServerException('Unable to get getUsersStatisticsService')));

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));

  return function getUsersStatisticsService() {
    return _ref.apply(this, arguments);
  };
}();

module.exports = getUsersStatisticsService;