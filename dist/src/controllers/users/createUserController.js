"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../../services/user"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var createUser = function createUser(req, res, next) {
  var _req$body;

  _logger["default"].message("Executing createUser controller");

  if ((_req$body = req.body) !== null && _req$body !== void 0 && _req$body.email) {
    req.body.email.toLowerCase();
  }

  _user["default"].createUserService(req.body).then(function (user) {
    _logger["default"].message("Executing createUser was successful");

    res.status(201).json(user);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing createUser", 'error');

    next(error);
  });
};

var _default = createUser;
exports["default"] = _default;