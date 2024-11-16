"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

/**
 *
 * @param {
 * "name":string
 * "UserType":string,
 * "fieldType":string,
 * "minOptionLimit":int,
 * "maxOptionLimit":int,
 * "status":ENUM
 * } data
 */
var createInterestService = function createInterestService(interests) {
  _logger["default"].message("Executing createInterestService");

  return new Promise(function (resolve, reject) {
    _models["default"].Interest.bulkCreate(interests).then(function (interest) {
      var tempInt = interest.map(function (item) {
        return item.interestId;
      });

      _logger["default"].message("Executing createInterestService was successful");

      return resolve(tempInt);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing createInterestService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), '');

      return reject(new _exceptions.ServerException('Unable to get createInterestService'));
    });
  });
};

var _default = createInterestService;
exports["default"] = _default;