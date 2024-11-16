"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _address = _interopRequireDefault(require("../../services/address"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var getAddress = function getAddress(req, res, next) {
  _logger["default"].message("Executing getAddress");

  return _address["default"].getAddressService(req.params).then(function (template) {
    _logger["default"].message("Executing getAddress was successful");

    res.status(200).json(template);
  })["catch"](function (error) {
    _logger["default"].message("Error while executing getAddress");

    next(error);
  });
};

module.exports = getAddress;