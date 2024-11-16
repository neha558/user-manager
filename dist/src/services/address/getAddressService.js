"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _ResourceNotFoundException = _interopRequireDefault(require("../../utilities/exceptions/ResourceNotFoundException"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

/**
 *
 * @param { id:string } params
 */
var getAddressService = function getAddressService(params) {
  _logger["default"].message("Executing getAddressByIdService");

  return new Promise(function (resolve, reject) {
    _models["default"].Address.findOne({
      where: {
        userId: params.id
      }
    }).then(function (address) {
      if (address) {
        _logger["default"].message("Executing getAddress was successful");

        return resolve(address);
      }

      return reject(new _ResourceNotFoundException["default"]('Address Not Found'));
    })["catch"](function (error) {
      _logger["default"].message("Uncaught error occurred status get address ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to get address'));
    });
  });
};

module.exports = getAddressService;