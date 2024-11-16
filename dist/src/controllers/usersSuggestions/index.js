"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _getUsersSuggestionController = _interopRequireDefault(require("./getUsersSuggestionController"));

var _authentication = _interopRequireDefault(require("../../middleware/authentication"));

var router = _express["default"].Router();

router.route('/').get(_authentication["default"], _getUsersSuggestionController["default"]);
module.exports = router;