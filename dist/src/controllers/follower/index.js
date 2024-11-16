"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _validateRequest = _interopRequireDefault(require("../../utilities/validateRequest"));

var _follower = _interopRequireDefault(require("../../policies/follower/follower.policy"));

var _authentication = _interopRequireDefault(require("../../middleware/authentication"));

var _followerController = _interopRequireDefault(require("./followerController"));

var _unfollowController = _interopRequireDefault(require("./unfollowController"));

var _getFollowersController = _interopRequireDefault(require("./getFollowersController"));

var router = _express["default"].Router();

router.route('/').get(_authentication["default"], _getFollowersController["default"]);
router.route('/').get(_authentication["default"], _getFollowersController["default"]);
router.route('/follow').post(_authentication["default"], (0, _validateRequest["default"])(_follower["default"]), _followerController["default"]).get(_authentication["default"], _getFollowersController["default"]);
router.route('/unfollow').post(_authentication["default"], (0, _validateRequest["default"])(_follower["default"]), _unfollowController["default"]);
module.exports = router;