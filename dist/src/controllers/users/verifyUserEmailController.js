"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../../services/user"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var verifyUserEmail = function verifyUserEmail(req, res, next) {
  _logger["default"].message("Executing verifyUserEmail controller");

  _user["default"].verifyUserEmailService(req.params.verificationCode).then(function () {
    _logger["default"].message("Executing verifyUserEmail was successful");

    res.status(204).json();
  })["catch"](function (error) {
    _logger["default"].message("Error while executing verifyUserEmail", 'error');

    next(error);
  });
};

var _default = verifyUserEmail;
exports["default"] = _default;