"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _report = _interopRequireDefault(require("../../../services/admin/report"));

var _logger = _interopRequireDefault(require("../../../../config/logger"));

var updateUserReportStatus = function updateUserReportStatus(req, res, next) {
  _logger["default"].message("Executing admin updateUserReportStatus");

  _report["default"].updateUserReportStatusService(req).then(function (userReport) {
    _logger["default"].message("Executing admin updateUserReportStatus was successful");

    res.status(204).send(userReport);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing admin updateUserReportStatus ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), 'error');

    next(error);
  });
};

module.exports = updateUserReportStatus;