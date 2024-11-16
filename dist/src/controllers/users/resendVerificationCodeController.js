"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../../services/user"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var resendVerificationCodeController = function resendVerificationCodeController(req, res, next) {
  _logger["default"].message("Executing resendVerificationCode controller");

  var _req$body = req.body,
      email = _req$body.email,
      mobileNumber = _req$body.mobileNumber;

  _user["default"].resendVerificationCodeService({
    email: email,
    mobileNumber: mobileNumber
  }).then(function (userDetail) {
    _logger["default"].message("Executing resendVerificationCode was successful");

    res.status(200).json(userDetail);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing resendVerificationCode", 'error');

    next(error);
  });
};

var _default = resendVerificationCodeController;
exports["default"] = _default;