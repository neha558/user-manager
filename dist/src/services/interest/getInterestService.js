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
var getInterestService = function getInterestService() {
  _logger["default"].message("Executing getInterestService");

  return new Promise(function (resolve, reject) {
    _models["default"].Interest.findAll({}).then(function (interest) {
      _logger["default"].message("Executing getInterestService was successful");

      return resolve(interest);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing getInterestService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to getInterestService'));
    });
  });
};

var _default = getInterestService;
exports["default"] = _default;