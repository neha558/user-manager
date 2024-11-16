"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _admin = _interopRequireDefault(require("../../services/admin"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var getUserStatisticsController = function getUserStatisticsController(req, res, next) {
  _logger["default"].message("Executing getUserStatisticsController");

  _admin["default"].getUsersStatistics().then(function (statics) {
    _logger["default"].message("Executing getUserStatisticsController was successful");

    return res.status(200).json(statics);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing getUserStatisticsController", 'error');

    return next(error);
  });
};

var _default = getUserStatisticsController;
exports["default"] = _default;