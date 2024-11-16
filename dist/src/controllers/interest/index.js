"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _getInterestController = _interopRequireDefault(require("./getInterestController"));

var _createInterestController = _interopRequireDefault(require("./createInterestController"));

var _updateInterestController = _interopRequireDefault(require("./updateInterestController"));

var _deleteInterestController = _interopRequireDefault(require("./deleteInterestController"));

var _authentication = _interopRequireDefault(require("../../middleware/authentication"));

var router = _express["default"].Router();

router.route('/').get(_getInterestController["default"]).post(_createInterestController["default"]);
router.route('/:interestId')["delete"](_authentication["default"], _deleteInterestController["default"]).put(_authentication["default"], _updateInterestController["default"]);
module.exports = router;