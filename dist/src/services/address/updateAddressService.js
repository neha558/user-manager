"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 *
 * @param { id:string } params
 */
var updateAddressService = function updateAddressService(data, params) {
  _logger["default"].message("Executing getAddressByIdService");

  return new Promise(function (resolve, reject) {
    _models["default"].Address.update(_objectSpread({}, data), {
      where: {
        userId: data.userId,
        addressId: params.id
      },
      returning: true
    }).then(function (updateAddressResponse) {
      if (updateAddressResponse[0] === 0) {
        return reject(new _exceptions.BadRequestException('No such address registered for given user'));
      }

      var updatedAddress = updateAddressResponse[1][0];
      (0, _publishToKafka["default"])('UPDATE-ADDRESS-TOPIC', updatedAddress, 'UPDATE');
      return resolve(updatedAddress);
    })["catch"](function (error) {
      _logger["default"].message("Uncaught error occurred status update address ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to update address'));
    });
  });
};

module.exports = updateAddressService;