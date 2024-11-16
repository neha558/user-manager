"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _address = _interopRequireDefault(require("../../services/address"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var updateAddress = function updateAddress(req, res, next) {
  _logger["default"].message("Executing getAddress");

  return _address["default"].updateAddressService(req.body, req.params).then(function () {
    _logger["default"].message("Executing getAddress was successful");

    res.status(204).send();
  })["catch"](function (error) {
    _logger["default"].message("Error while executing getAddress");

    next(error);
  });
};

module.exports = updateAddress;