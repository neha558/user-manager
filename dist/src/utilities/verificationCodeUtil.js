"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeVerificationCode = exports.generateVerificationCode = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var generateVerificationCode = function generateVerificationCode(expiryDate, data) {
  var secret = _crypto["default"].randomBytes(8).toString('hex');

  var tokenObject = {
    secret: secret,
    expiryDate: expiryDate,
    data: data
  };
  return Buffer.from(JSON.stringify(tokenObject)).toString('base64');
};

exports.generateVerificationCode = generateVerificationCode;

var decodeVerificationCode = function decodeVerificationCode(code) {
  return Buffer.from(code, 'base64').toString('ascii');
};

exports.decodeVerificationCode = decodeVerificationCode;