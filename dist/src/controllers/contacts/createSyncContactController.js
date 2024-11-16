"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _contacts = _interopRequireDefault(require("../../services/contacts"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var createSyncContactController = function createSyncContactController(req, res, next) {
  _logger["default"].message("Executing createTemplate controller");

  return _contacts["default"].createSyncContactService(req.body).then(function () {
    _logger["default"].message("Executing createSyncContactController was successful");

    res.status(200).send();
  })["catch"](function (error) {
    _logger["default"].message("Error while executing createSyncContactController");

    return next(error);
  });
};

module.exports = createSyncContactController;