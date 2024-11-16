"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _getAdminUserReportService = _interopRequireDefault(require("./getAdminUserReportService"));

var _updateUserReportStatusService = _interopRequireDefault(require("./updateUserReportStatusService"));

module.exports = {
  getAdminUserReportService: _getAdminUserReportService["default"],
  updateUserReportStatusService: _updateUserReportStatusService["default"]
};