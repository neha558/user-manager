"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _admin = _interopRequireDefault(require("../../services/admin"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var suspendUser = function suspendUser(req, res, next) {
  _logger["default"].message("Executing suspendUser");

  _admin["default"].suspendUserService(req).then(function () {
    _logger["default"].message("Executing suspendUser was successful");

    return res.status(204).send();
  })["catch"](function (error) {
    _logger["default"].message("Error while executing suspendUser", 'error');

    return next(error);
  });
};

var _default = suspendUser;
exports["default"] = _default;