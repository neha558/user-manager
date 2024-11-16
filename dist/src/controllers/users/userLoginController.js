"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../../services/user"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var getUser = function getUser(req, res, next) {
  _logger["default"].message("Executing getUser");

  _user["default"].userLoginService(req.body).then(function (user) {
    _logger["default"].message("Executing getUser was successful");

    res.status(200).json(user);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing getUser", 'error');

    next(error);
  });
};

var _default = getUser;
exports["default"] = _default;