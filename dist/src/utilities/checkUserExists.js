"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../models"));

var checkUserExists = function checkUserExists(credentials) {
  var whereCondition = {};
  var attributes = ['userId', 'firstName', 'lastName', 'email', 'userName', 'mobileNumber', 'password', 'googleId', 'facebookId', 'appleId', 'verifyByEmail', 'verifyByMobile', 'isSuspended'];

  if (credentials.userName) {
    whereCondition = {
      attributes: attributes,
      where: {
        userName: credentials.userName
      }
    };
  }

  if (credentials.email) {
    whereCondition = {
      attributes: attributes,
      where: {
        email: credentials.email
      }
    };
  }

  if (credentials.mobileNumber) {
    whereCondition = {
      attributes: attributes,
      where: {
        mobileNumber: credentials.mobileNumber
      }
    };
  }

  return _models["default"].User.findOne(whereCondition);
};

var _default = checkUserExists;
exports["default"] = _default;