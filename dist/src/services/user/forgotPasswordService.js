"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _exceptions = require("../../utilities/exceptions");

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _models = _interopRequireDefault(require("../../models"));

var _verificationCodeUtil = require("../../utilities/verificationCodeUtil");

var _checkUserExists = _interopRequireDefault(require("../../utilities/checkUserExists"));

var _moment = _interopRequireDefault(require("moment"));

var _config = _interopRequireDefault(require("config"));

var _commons = require("../../utilities/commons");

var _generateOtp = _interopRequireDefault(require("../../utilities/generateOtp"));

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

var _forgotPasswordTemplate = _interopRequireDefault(require("../../templates/forgotPasswordTemplate"));

var sendEmailOrSms = function sendEmailOrSms(credentials, updatedUser, otp) {
  var notificationEvent = {};
  var emailNotification = {
    type: 'EMAIL',
    activityTime: updatedUser.createdAt,
    userId: updatedUser.userId,
    emailOptions: {
      from: _config["default"].get('adminEmailId'),
      to: updatedUser.email,
      subject: 'Public poll reset password',
      html: (0, _forgotPasswordTemplate["default"])(_config["default"].get('forgotPasswordVerificationUrl'), updatedUser.forgotPasswordToken, _config["default"].get('IMAGE_URL'))
    }
  };
  var smsNotification = {
    type: 'SMS',
    activityTime: updatedUser.createdAt,
    userId: updatedUser.userId,
    smsOptions: {
      message: "".concat(otp, " is your one time password (OTP) to reset your password on Public Poll"),
      phoneNumber: updatedUser.mobileNumber
    }
  };

  if (credentials.email) {
    notificationEvent = emailNotification;
  } else if (credentials.mobileNumber) {
    notificationEvent = smsNotification;
  } else if (credentials.userName && updatedUser.email) {
    notificationEvent = emailNotification;
  } else if (credentials.userName && updatedUser.mobileNumber) {
    notificationEvent = smsNotification;
  }

  (0, _publishToKafka["default"])('SMS-EMAIL-NOTIFICATION', notificationEvent, 'CREATE');
};
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


var forgotPasswordService = function forgotPasswordService(credentials) {
  _logger["default"].message("Executing forgotPasswordService");

  return new Promise(function (resolve, reject) {
    (0, _checkUserExists["default"])(credentials).then(function (user) {
      if (user === null) {
        throw reject(new _exceptions.ResourceNotFoundException('User not found'));
      }

      if (user.isSuspended) {
        (0, _commons.checkUserSuspended)(reject, _exceptions.UnauthorizedException, _logger["default"]);
      }

      if (user.googleId || user.facebookId || user.appleId) {
        var message = (0, _commons.emailDuplicationMessage)(user);
        return reject(new _exceptions.ForbiddenException(message));
      }

      var currentDate = new Date();
      var updateObject;
      var provider;
      var otp = (0, _generateOtp["default"])();
      var forgotPasswordToken = (0, _verificationCodeUtil.generateVerificationCode)((0, _moment["default"])(currentDate).add(_config["default"].get('verificationLinkExpiryDuration'), 'hours'), credentials);
      var otpExpiryTime = (0, _moment["default"])(currentDate).add(_config["default"].get('otpExpiryDuration'), 'minutes');

      if (credentials.email) {
        updateObject = {
          forgotPasswordToken: forgotPasswordToken
        };
        provider = 'email';
      } else if (credentials.mobileNumber) {
        updateObject = {
          otp: otp,
          otpExpiryTime: otpExpiryTime
        };
        provider = 'mobile';
      } else if (credentials.userName && user.email) {
        updateObject = {
          forgotPasswordToken: forgotPasswordToken
        };
        provider = 'email';
      } else if (credentials.userName && user.mobileNumber) {
        updateObject = {
          otp: otp,
          otpExpiryTime: otpExpiryTime
        };
        provider = 'mobile';
      }

      return _models["default"].User.update(updateObject, {
        where: credentials,
        returning: true
      }).then(function (updatedUser) {
        _logger["default"].message('Successfully set the forgotPasswordToken');

        sendEmailOrSms(credentials, updatedUser[1][0], otp);
        var generateResponse = {
          userId: user.userId,
          provider: provider
        };

        if (provider === 'mobile') {
          generateResponse.mobile = user.mobileNumber;
        }

        return resolve(generateResponse);
      })["catch"](function (error) {
        _logger["default"].message("Error occurred while updating forgot password token ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

        return reject(new _exceptions.ServerException('Failed to execute forgot password'));
      });
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while verify token ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Failed to execute forgot password'));
    });
  });
};

module.exports = forgotPasswordService;