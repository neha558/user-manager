"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _follower = _interopRequireDefault(require("../../services/follower"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var follower = function follower(req, res, next) {
  _logger["default"].message("Executing follower controller");

  return _follower["default"].followService(req.body).then(function (followId) {
    _logger["default"].message("Executing follower was successful");

    res.status(201).json(followId);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing follower");

    return next(error);
  });
};

module.exports = follower;