"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createAddressService = _interopRequireDefault(require("./createAddressService"));

var _getAddressService = _interopRequireDefault(require("./getAddressService"));

var _updateAddressService = _interopRequireDefault(require("./updateAddressService"));

module.exports = {
  createAddresservice: _createAddressService["default"],
  getAddressService: _getAddressService["default"],
  updateAddressService: _updateAddressService["default"]
};