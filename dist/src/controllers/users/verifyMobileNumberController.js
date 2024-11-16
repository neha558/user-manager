"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../../services/user"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var verifyMobileNumberController = function verifyMobileNumberController(req, res, next) {
  _logger["default"].message("Executing verifyMobileNumber controller");

  var _req$body = req.body,
      userId = _req$body.userId,
      otp = _req$body.otp,
      mobileNumber = _req$body.mobileNumber;

  _user["default"].verifyMobileNumberService(userId, otp, mobileNumber).then(function (success) {
    _logger["default"].message("Executing verifyMobileNumber was successful");

    res.status(200).json(success);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing verifyMobileNumber", 'error');

    next(error);
  });
};

var _default = verifyMobileNumberController;
exports["default"] = _default;