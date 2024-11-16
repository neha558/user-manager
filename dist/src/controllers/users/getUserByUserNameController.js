"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../../services/user"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var getUserById = function getUserById(req, res, next) {
  _logger["default"].message("Executing getUser");

  _user["default"].getUserByUserNameService(req.body.user.userId, req.params.userName).then(function (user) {
    _logger["default"].message("Executing getUser was successful");

    return res.status(200).json(user);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing getUser", 'error');

    return next(error);
  });
};

var _default = getUserById;
exports["default"] = _default;