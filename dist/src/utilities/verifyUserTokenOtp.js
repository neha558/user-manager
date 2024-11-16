"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../models"));

var verifyUserTokenOtp = function verifyUserTokenOtp(credentials) {
  var whereCondition = {};

  if (credentials.token) {
    whereCondition = {
      where: {
        forgotPasswordToken: credentials.token
      }
    };
  } else {
    whereCondition = {
      where: {
        otp: credentials.otp
      }
    };
  }

  return _models["default"].User.findOne(whereCondition);
};

var _default = verifyUserTokenOtp;
exports["default"] = _default;