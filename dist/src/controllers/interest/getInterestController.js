"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _interest = _interopRequireDefault(require("../../services/interest"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var getInterest = function getInterest(req, res, next) {
  _logger["default"].message("Executing getUserById");

  _interest["default"].getInterestService().then(function (interests) {
    _logger["default"].message("Executing getUserById was successful");

    return res.status(200).json(interests);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing getUserById", 'error');

    return next(error);
  });
};

var _default = getInterest;
exports["default"] = _default;