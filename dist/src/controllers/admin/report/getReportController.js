"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _report = _interopRequireDefault(require("../../../services/admin/report"));

var _logger = _interopRequireDefault(require("../../../../config/logger"));

var getReports = function getReports(req, res, next) {
  _logger["default"].message("Executing admin getReportsController");

  _report["default"].getAdminUserReportService(req).then(function (reportedUsers) {
    _logger["default"].message("Executing admin getReportsController was successful");

    res.status(200).json(reportedUsers);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing admin getReportsController ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), 'error');

    next(error);
  });
};

module.exports = getReports;