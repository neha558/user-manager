"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _getUserStatisticsController = _interopRequireDefault(require("./getUserStatisticsController"));

var _getUsersController = _interopRequireDefault(require("./getUsersController"));

var _suspendUserController = _interopRequireDefault(require("./suspendUserController"));

var _authentication = _interopRequireDefault(require("../../middleware/authentication"));

var router = _express["default"].Router();

router.route('/user-stats').get(_authentication["default"], _getUserStatisticsController["default"]);
router.route('/users').get(_authentication["default"], _getUsersController["default"]);
router.route('/users/status/:userId').put(_authentication["default"], _suspendUserController["default"]);
router.use('/report', require("./report"));
module.exports = router;