"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _moment = _interopRequireDefault(require("moment"));

var _verificationCodeUtil = require("../../utilities/verificationCodeUtil");

var _generateOtp = _interopRequireDefault(require("../../utilities/generateOtp"));

var _config = _interopRequireDefault(require("config"));

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

var _userCreateTemplate = _interopRequireDefault(require("../../templates/userCreateTemplate"));

var sendEmailOrSms = function sendEmailOrSms(email, updatedUser) {
  var notificationEvent = {};

  if (email) {
    notificationEvent.type = 'EMAIL';
    notificationEvent.activityTime = updatedUser.createdAt;
    notificationEvent.userId = updatedUser.userId;
    notificationEvent.emailOptions = {
      from: _config["default"].get('adminEmailId'),
      to: updatedUser.email,
      subject: 'Public poll email verification',
      html: (0, _userCreateTemplate["default"])(_config["default"].get('emailVerificationUrl'), updatedUser.emailVerificationCode, _config["default"].get('IMAGE_URL'))
    };
  } else {
    notificationEvent.type = 'SMS';
    notificationEvent.activityTime = updatedUser.createdAt;
    notificationEvent.userId = updatedUser.userId;
    notificationEvent.smsOptions = {
      message: "".concat(updatedUser.otp, " is your one time password (OTP) for Public Poll."),
      phoneNumber: updatedUser.mobileNumber
    };
  }

  (0, _publishToKafka["default"])('SMS-EMAIL-NOTIFICATION', notificationEvent, 'CREATE');
};

var resendVerificationCodeService = function resendVerificationCodeService(_ref) {
  var mobileNumber = _ref.mobileNumber,
      email = _ref.email;

  _logger["default"].message("Executing resendVerificationCodeService for email ".concat(email, " or mobileNumber ").concat(mobileNumber));

  return new Promise(function (resolve, reject) {
    var updateDetails = {};
    var whereClause = {};
    var currentDate = new Date();

    if (mobileNumber) {
      whereClause = {
        mobileNumber: mobileNumber
      };
      updateDetails = {
        otp: (0, _generateOtp["default"])(),
        otpExpiryTime: (0, _moment["default"])(currentDate).add(_config["default"].get('otpExpiryDuration'), 'minutes')
      };
    } else {
      whereClause = {
        email: email
      };
      updateDetails = {
        emailVerificationCode: (0, _verificationCodeUtil.generateVerificationCode)((0, _moment["default"])(currentDate).add(_config["default"].get('verificationLinkExpiryDuration'), 'hours'), {
          email: email
        })
      };
    }

    _models["default"].User.update(updateDetails, {
      where: whereClause,
      returning: true
    }).then(function (updatedUser) {
      _logger["default"].message("Successfully executed resendVerificationCodeService");

      if (updatedUser[1].length === 0) {
        if (email) {
          return reject(new _exceptions.BadRequestException("This email is not registered"));
        }

        return reject(new _exceptions.BadRequestException("This mobile number is not registered"));
      }

      sendEmailOrSms(email, updatedUser[1][0]);
      return resolve({
        userId: updatedUser[1][0].userId
      });
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing resendVerificationCodeService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Something went wrong while sending verification code'));
    });
  });
};

var _default = resendVerificationCodeService;
exports["default"] = _default;