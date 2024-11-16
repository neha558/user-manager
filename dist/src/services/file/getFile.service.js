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
var getFileService = function getFileService(fileId) {
  _logger["default"].message("Executing getFileService");

  return new Promise(function (resolve, reject) {
    _models["default"].File.findByPk(fileId).then(function (files) {
      if (files == null) {
        _logger["default"].message("Error occurred while executing getFileService");

        return reject(new _exceptions.ResourceNotFoundException('File not found.'));
      }

      _logger["default"].message("Executing getFileService was successful");

      return resolve(files);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing getFileService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to getFileService'));
    });
  });
};

module.exports = getFileService;