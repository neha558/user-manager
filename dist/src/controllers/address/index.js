"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _validateRequest = _interopRequireDefault(require("../../utilities/validateRequest"));

var _address = _interopRequireDefault(require("../../policies/address/address.policy"));

var _createAddressController = _interopRequireDefault(require("./createAddressController"));

var _getAddressController = _interopRequireDefault(require("./getAddressController"));

var _updateAddressController = _interopRequireDefault(require("./updateAddressController"));

var router = _express["default"].Router();

router.route('/').post((0, _validateRequest["default"])(_address["default"]), _createAddressController["default"]);
router.route('/:id').get(_getAddressController["default"]).put((0, _validateRequest["default"])(_address["default"]), _updateAddressController["default"]);
module.exports = router;