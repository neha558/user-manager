"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _interest = _interopRequireDefault(require("../../services/interest"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var createInterest = function createInterest(req, res, next) {
  _logger["default"].message("Executing createUser controller");

  _interest["default"].createInterestService(req.body).then(function (user) {
    _logger["default"].message("Executing createUser was successful");

    res.status(201).json(user);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing createUser", 'error');

    next(error);
  });
};

var _default = createInterest;
exports["default"] = _default;