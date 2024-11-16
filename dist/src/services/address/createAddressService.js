"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

/**
 *
 * @param {
 * "name":string
 * "addressType":string,
 * "fieldType":string,
 * "minOptionLimit":int,
 * "maxOptionLimit":int,
 * "status":ENUM
 * } data
 */
var createAddressService = function createAddressService(addressDetail) {
  _logger["default"].message("Executing createAddressService");

  return new Promise(function (resolve, reject) {
    return _models["default"].Address.create(addressDetail).then(function (savedAddress) {
      _logger["default"].message("Executing createAddressService was successful");

      (0, _publishToKafka["default"])('UPDATE-ADDRESS-TOPIC', savedAddress, 'CREATE');
      return resolve(savedAddress.addressId);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing createAddressService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to create Address'));
    });
  });
};

module.exports = createAddressService;