"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _contacts = _interopRequireDefault(require("../../services/contacts"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var getSyncContactController = function getSyncContactController(req, res, next) {
  _logger["default"].message("Executing getSyncContactController");

  return _contacts["default"].getSyncContactService(req).then(function (contacts) {
    _logger["default"].message("Executing getSyncContactController was successful");

    res.status(200).json(contacts);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing getSyncContactController");

    next(error);
  });
};

module.exports = getSyncContactController;