"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _getInterestService = _interopRequireDefault(require("./getInterestService"));

var _createInterestService = _interopRequireDefault(require("./createInterestService"));

var _deleteInterestService = _interopRequireDefault(require("./deleteInterestService"));

var _updateInterestService = _interopRequireDefault(require("./updateInterestService"));

module.exports = {
  getInterestService: _getInterestService["default"],
  createInterestService: _createInterestService["default"],
  updateInterestService: _updateInterestService["default"],
  deleteInterestService: _deleteInterestService["default"]
};