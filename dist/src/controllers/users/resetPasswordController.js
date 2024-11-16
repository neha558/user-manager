"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../../services/user"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var resetPassword = function resetPassword(req, res, next) {
  _logger["default"].message("Executing resetPassword");

  _user["default"].resetPasswordService(req.body).then(function () {
    _logger["default"].message("Executing resetPassword was successful");

    res.status(204).json();
  })["catch"](function (error) {
    _logger["default"].message("Error while executing resetPassword", 'error');

    next(error);
  });
};

var _default = resetPassword;
exports["default"] = _default;