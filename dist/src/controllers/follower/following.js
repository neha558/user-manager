"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _authentication = _interopRequireDefault(require("../../middleware/authentication"));

var _getFollowingController = _interopRequireDefault(require("./getFollowingController"));

var router = _express["default"].Router();

router.route('/').get(_authentication["default"], _getFollowingController["default"]);
module.exports = router;