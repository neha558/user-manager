"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _authorizedRoles = _interopRequireDefault(require("../middleware/authorizedRoles"));

var _authentication = _interopRequireDefault(require("../middleware/authentication"));

var _roles = _interopRequireDefault(require("../constant/roles"));

var router = _express["default"].Router();

router.use('/user', require("./users"));
router.use('/contacts', require("./contacts"));
router.use('/fileUpload', require("./files"));
router.use('/interest', require("./interest"));
router.use('/address', require("./address"));
router.use('/follower', require("./follower"));
router.use('/following', require("./follower/following"));
router.use('/blockUser', require("./blockUser"));
router.use('/user/report', require("./report"));
router.use('/users/suggestions', require("./usersSuggestions"));
router.use('/admin', _authentication["default"], (0, _authorizedRoles["default"])(_roles["default"].ADMIN), require("./admin"));
module.exports = router;