"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _models = _interopRequireDefault(require("../models"));

var validUserId = function validUserId(userId) {
  return _models["default"].User.findByPk(userId);
};

var _default = validUserId;
exports["default"] = _default;