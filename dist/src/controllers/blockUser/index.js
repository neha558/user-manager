"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _blockUser = _interopRequireDefault(require("../../policies/blockUser/blockUser.policy"));

var _validateRequest = _interopRequireDefault(require("../../utilities/validateRequest"));

var _authentication = _interopRequireDefault(require("../../middleware/authentication"));

var _blockUserController = _interopRequireDefault(require("./blockUserController"));

var router = _express["default"].Router();

router.route('/block').post(_authentication["default"], (0, _validateRequest["default"])(_blockUser["default"]), _blockUserController["default"]);
router.route('/unblock').post(_authentication["default"], (0, _validateRequest["default"])(_blockUser["default"]), _blockUserController["default"]);
module.exports = router;