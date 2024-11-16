"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _uploadFile = _interopRequireDefault(require("../../policies/file/uploadFile.policy"));

var _validateRequest = _interopRequireDefault(require("../../utilities/validateRequest"));

var _uploadFileController = _interopRequireDefault(require("./uploadFileController"));

var _getFileController = _interopRequireDefault(require("./getFileController"));

var router = _express["default"].Router();

router.route('/').post((0, _validateRequest["default"])(_uploadFile["default"]), _uploadFileController["default"]);
router.route('/:fileId').get(_getFileController["default"]);
module.exports = router;