"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _blockUser = _interopRequireDefault(require("../../services/blockUser"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var block = function block(req, res, next) {
  _logger["default"].message("Executing BlockUserService controller");

  return _blockUser["default"].blockUserService(req.body.blockUserId, req.body.user.userId, req.body.action).then(function (serviceResponse) {
    _logger["default"].message("Executing BlockUserService is successful");

    res.status(201).json(serviceResponse);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing BlockUserService in BlockUserHandleController");

    return next(error);
  });
};

module.exports = block;