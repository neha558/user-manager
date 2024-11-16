"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _user = _interopRequireDefault(require("../../services/user"));

var deleteUserById = function deleteUserById(req, res, next) {
  _logger["default"].message("Executing deleteUserById");

  _user["default"].deleteUserByIdService(req.params).then(function (userResponse) {
    _logger["default"].message("Executing deleteUserById was successful");

    res.status(204).json(userResponse);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing deleteUserById", 'error');

    next(error);
  });
};

var _default = deleteUserById;
exports["default"] = _default;