"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var createUserReportService = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var userId, reportedUserId, reason, userReport;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userId = _ref.userId, reportedUserId = _ref.reportedUserId, reason = _ref.reason;
            _context.prev = 1;

            _logger["default"].message("Executing createPollReportService of user ".concat(reportedUserId, " by user ").concat(userId));

            _context.next = 5;
            return _models["default"].ReportedUser.create({
              reportedBy: userId,
              userId: reportedUserId,
              reason: reason
            });

          case 5:
            userReport = _context.sent;

            _logger["default"].message("Executed createUserReportService successfully");

            return _context.abrupt("return", Promise.resolve(userReport));

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);

            _logger["default"].message("Error occurred while executing createUserReportService ".concat((_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.stack) || _context.t0));

            return _context.abrupt("return", Promise.reject(new _exceptions.ServerException('Failed to createUserReportService')));

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 10]]);
  }));

  return function createUserReportService(_x) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = createUserReportService;