"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _address = _interopRequireDefault(require("../../services/address"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var createAddress = function createAddress(req, res, next) {
  _logger["default"].message("Executing createTemplate controller");

  return _address["default"].createAddresservice(req.body).then(function (addressId) {
    _logger["default"].message("Executing createAddress was successful"); // eslint-disable-next-line object-shorthand


    res.status(201).json({
      addressId: addressId
    });
  })["catch"](function (error) {
    _logger["default"].message("Error while executing createAddress");

    return next(error);
  });
};

module.exports = createAddress;