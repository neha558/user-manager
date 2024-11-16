"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _validateRequest = _interopRequireDefault(require("../../utilities/validateRequest"));

var _contacts = _interopRequireDefault(require("../../policies/contacts/contacts.policy"));

var _createSyncContactController = _interopRequireDefault(require("./createSyncContactController"));

var _getSyncContactController = _interopRequireDefault(require("./getSyncContactController"));

var _authentication = _interopRequireDefault(require("../../middleware/authentication"));

var router = _express["default"].Router();

router.route('/sync').post(_authentication["default"], (0, _validateRequest["default"])(_contacts["default"]), _createSyncContactController["default"]).get(_authentication["default"], _getSyncContactController["default"]);
module.exports = router;