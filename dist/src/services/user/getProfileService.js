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
var getProfileService = function getProfileService(userId) {
  _logger["default"].message("Executing getUserService"); // const attributes = [
  //   'userId',
  //   'firstName',
  //   'lastName',
  //   'email',
  //   'mobileNumber',
  //   'gender',
  //   'profileBanner',
  //   'imageId',
  //   'followers',
  //   'followings',
  // ];


  return new Promise(function (resolve, reject) {
    _models["default"].User.findByPk(userId).then(function (user) {
      _logger["default"].message("Executing getUserService was successful");

      return resolve(user);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing getUserService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), '');

      return reject(new _exceptions.ServerException('Unable to get user'));
    });
  });
};

module.exports = getProfileService;