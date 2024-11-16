"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../../services/user"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var updateUserProfile = function updateUserProfile(req, res, next) {
  _logger["default"].message("Executing updateUserProfile controller");

  _user["default"].updateUserProfile(req.body, req.body.user).then(function (user) {
    _logger["default"].message("Executing updateUserProfile was successful");

    res.status(204).json(user);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing updateUserProfile", 'error');

    next(error);
  });
};

var _default = updateUserProfile;
exports["default"] = _default;