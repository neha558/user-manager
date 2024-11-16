"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _user = _interopRequireDefault(require("./user"));

var _interest = _interopRequireDefault(require("./interest"));

module.exports = {
  userService: _user["default"],
  interestService: _interest["default"]
};