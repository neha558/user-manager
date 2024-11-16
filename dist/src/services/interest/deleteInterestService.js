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
var deleteInterestService = function deleteInterestService(params) {
  _logger["default"].message("Executing deleteInterestService");

  return new Promise(function (resolve, reject) {
    _models["default"].Interest.destroy({
      where: {
        interestId: params.interestId
      }
    }).then(function (interestObject) {
      _logger["default"].message("Executing deleteInterestService was successful");

      return resolve(interestObject);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing deleteInterestService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), '');

      return reject(new _exceptions.ServerException('Unable to get deleteInterestService'));
    });
  });
};

var _default = deleteInterestService;
exports["default"] = _default;