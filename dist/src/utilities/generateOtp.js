"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/* eslint-disable no-restricted-properties */
var generateOtp = function generateOtp() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
  return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
};

var _default = generateOtp;
exports["default"] = _default;