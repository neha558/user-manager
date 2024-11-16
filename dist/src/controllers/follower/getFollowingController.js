"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _follower = _interopRequireDefault(require("../../services/follower"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var getFollowing = function getFollowing(req, res, next) {
  _logger["default"].message("Executing getFollowing");

  return _follower["default"].getFollowingService(req.body.user.userId.toString(), req.query).then(function (followers) {
    _logger["default"].message("Executing getFollowing was successful");

    res.status(200).json(followers);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing getFollowing");

    next(error);
  });
};

module.exports = getFollowing;