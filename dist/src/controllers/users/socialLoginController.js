"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _socialAuth = _interopRequireDefault(require("../../services/auth/socialAuth"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var socialLogin = function socialLogin(req, res, next) {
  _logger["default"].message("Executing socialLogin");

  (0, _socialAuth["default"])(req.body).then(function (user) {
    _logger["default"].message("Executing socialLogin was successful");

    res.status(200).json(user);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing socialLogin", 'error');

    next(error);
  });
};

var _default = socialLogin;
exports["default"] = _default;