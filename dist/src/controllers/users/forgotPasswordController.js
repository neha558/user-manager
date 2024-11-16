"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../../services/user"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var forgotPassword = function forgotPassword(req, res, next) {
  _logger["default"].message("Executing forgotPassword");

  _user["default"].forgotPasswordService(req.body).then(function (success) {
    _logger["default"].message("Executing forgotPassword was successful");

    res.status(200).json(success);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing forgotPassword", 'error');

    next(error);
  });
};

var _default = forgotPassword;
exports["default"] = _default;