"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _getUsersStatisticsService = _interopRequireDefault(require("./getUsersStatisticsService"));

var _getUsersListService = _interopRequireDefault(require("./getUsersListService"));

var _suspendUserService = _interopRequireDefault(require("./suspendUserService"));

module.exports = {
  getUsersStatistics: _getUsersStatisticsService["default"],
  getUserService: _getUsersListService["default"],
  suspendUserService: _suspendUserService["default"]
};