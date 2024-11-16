"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _getReportController = _interopRequireDefault(require("./getReportController"));

var _updateReportStatusController = _interopRequireDefault(require("./updateReportStatusController"));

var router = _express["default"].Router();

router.route('/').get(_getReportController["default"]);
router.route('/status/:id').put(_updateReportStatusController["default"]);
module.exports = router;