"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _validateRequest = _interopRequireDefault(require("../../utilities/validateRequest"));

var _report = _interopRequireDefault(require("../../policies/report/report.policy"));

var _createUserReportController = _interopRequireDefault(require("./createUserReportController"));

var _authentication = _interopRequireDefault(require("../../middleware/authentication"));

var router = _express["default"].Router();

router.route('/').post(_authentication["default"], (0, _validateRequest["default"])(_report["default"]), _createUserReportController["default"]);
module.exports = router;