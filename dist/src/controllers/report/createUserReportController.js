"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _report = _interopRequireDefault(require("../../services/report"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var createUserReport = function createUserReport(req, res, next) {
  _logger["default"].message("Executing createReport");

  var _req$body = req.body,
      reportedUserId = _req$body.reportedUserId,
      reason = _req$body.reason,
      userId = _req$body.user.userId;

  _logger["default"].message("Executing createUserReport controller for reportedUserId ".concat(reportedUserId, " by userId ").concat(userId));

  return _report["default"].createUserReportService({
    reportedUserId: reportedUserId,
    reason: reason,
    userId: userId
  }).then(function (responseUser) {
    _logger["default"].message("Executing createUserReport was successful");

    res.status(201).json(responseUser);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing createUserReport ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), 'error');

    next(error);
  });
};

module.exports = createUserReport;