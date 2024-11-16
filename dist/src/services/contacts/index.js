"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createSyncContactService = _interopRequireDefault(require("./createSyncContactService"));

var _getSyncContactService = _interopRequireDefault(require("./getSyncContactService"));

module.exports = {
  createSyncContactService: _createSyncContactService["default"],
  getSyncContactService: _getSyncContactService["default"]
};