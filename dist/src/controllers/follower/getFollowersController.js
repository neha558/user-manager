"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _follower = _interopRequireDefault(require("../../services/follower"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var getFollower = function getFollower(req, res, next) {
  _logger["default"].message("Executing getFollower");

  return _follower["default"].getFollowersService(req.body.user.userId.toString(), req.query).then(function (followers) {
    _logger["default"].message("Executing getFollower was successful");

    res.status(200).json(followers);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing getFollower");

    next(error);
  });
};

module.exports = getFollower;