"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _follower = _interopRequireDefault(require("../../services/follower"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var unfollow = function unfollow(req, res, next) {
  _logger["default"].message("Executing unfollow controller");

  return _follower["default"].unfollowService(req.body).then(function (followId) {
    _logger["default"].message("Executing unfollow was successful");

    res.status(201).json(followId);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing unfollow");

    return next(error);
  });
};

module.exports = unfollow;