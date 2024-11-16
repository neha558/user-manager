"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _exceptions = require("../../utilities/exceptions");

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

var _commons = require("../../utilities/commons");

var _checkUserExists = _interopRequireDefault(require("../../utilities/checkUserExists"));

var _constants = require("../../utilities/constants");

var _roles = _interopRequireDefault(require("../../constant/roles"));

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
var userLoginService = function userLoginService(credentials) {
  _logger["default"].message("Executing userLoginService");

  return new Promise(function (resolve, reject) {
    return (0, _checkUserExists["default"])(credentials).then(function (userResponse) {
      if (userResponse === null) {
        return reject(new _exceptions.ResourceNotFoundException('User not found'));
      }

      if (userResponse.isSuspended) {
        (0, _commons.checkUserSuspended)(reject, _exceptions.UnauthorizedException, _logger["default"]);
      }

      var user = userResponse.get({
        plain: true
      });

      if (user.googleId || user.facebookId || user.appleId) {
        var message = (0, _commons.emailDuplicationMessage)(user);
        return reject(new _exceptions.ForbiddenException(message));
      }

      if (credentials.mobileNumber && user.verifyByMobile === null) {
        return reject(new _exceptions.ForbiddenException('Please verify your mobile number via OTP'));
      }

      if (credentials.email && user.verifyByEmail === null) {
        return reject(new _exceptions.ForbiddenException('Please verify your email via verification link'));
      }

      if (credentials.userName && user.verifyByEmail === null && user.verifyByMobile === null) {
        var _message = user.email ? 'Please verify your email via verification link' : 'Please verify your mobile number via OTP';

        return reject(new _exceptions.ForbiddenException(_message));
      }

      if (!_bcrypt["default"].compareSync(credentials.password, user.password)) {
        return reject(new _exceptions.UnauthorizedException('Invalid password'));
      }

      if (credentials.email === _config["default"].get('adminEmail') || credentials.mobileNumber === _config["default"].get('adminMobileNumber') || credentials.userName === _config["default"].get('adminUserName')) {
        // eslint-disable-next-line no-param-reassign
        user.roles = [_roles["default"].ADMIN];
      }

      delete user.password;
      delete user.googleId;
      delete user.facebookId;

      var token = _jsonwebtoken["default"].sign({
        user: user
      }, _config["default"].get('TOKEN_SECRET'), {
        expiresIn: _constants.EXPIRES_IN // expires in 60 days

      });

      return resolve({
        token: token
      });
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while verify token ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to verify token'));
    });
  });
};

module.exports = userLoginService;