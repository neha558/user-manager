"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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
var uploadFileService = function uploadFileService(data) {
  _logger["default"].message("Executing uploadFileService");

  return new Promise(function (resolve, reject) {
    _models["default"].File.create(data).then(function (savedUser) {
      _logger["default"].message("Executing uploadFileService was successful");

      return resolve({
        fileId: savedUser.fileId
      });
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing uploadFileService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), '');

      return reject(new _exceptions.ServerException('Unable to create User'));
    });
  });
};

module.exports = uploadFileService;