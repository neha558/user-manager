"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _moment = _interopRequireDefault(require("moment"));

var _verificationCodeUtil = require("../../utilities/verificationCodeUtil");

var _config = _interopRequireDefault(require("config"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var findAndVerifyMobileNumberService = function findAndVerifyMobileNumberService(userId, otp) {
  _logger["default"].message("Executing findAndVerifyMobileNumberService");

  return new Promise(function (resolve, reject) {
    _models["default"].User.findByPk(userId).then(function (user) {
      _logger["default"].message("Found user with user id ".concat(userId, " for Otp"));

      if (user.otp !== otp) {
        _logger["default"].message("Invalid Otp code ".concat(otp));

        return reject(new _exceptions.BadRequestException('Invalid Otp'));
      }

      var currentDate = (0, _moment["default"])(new Date());

      if ((0, _moment["default"])(currentDate).isAfter(user.otpExpiryTime)) {
        _logger["default"].message("Otp has expired");

        return reject(new _exceptions.UnauthorizedException('Otp has expired'));
      }

      return resolve(user);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing findAndVerifyMobileNumberService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Something went wrong while verifying otp'));
    });
  });
};

var updateUserOtpDetails = function updateUserOtpDetails(userDetails, mobileNumber, forgotPasswordToken) {
  _logger["default"].message("Executing updateUserOtpDetails for user ".concat(userDetails.userId));

  var userUpdateObject = _objectSpread(_objectSpread({}, userDetails), {}, {
    otpExpiryTime: null,
    otp: null,
    verifyByMobile: new Date(),
    forgotPasswordToken: forgotPasswordToken
  });

  if (mobileNumber) {
    userUpdateObject.mobileNumber = mobileNumber;
  }

  return new Promise(function (resolve, reject) {
    _models["default"].User.update(userUpdateObject, {
      where: {
        userId: userDetails.userId
      },
      returning: true
    }).then(function () {
      _logger["default"].message("Successfully executed updateUserOtpDetails");

      return resolve(userUpdateObject);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing updateUserOtpDetails ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Something went wrong while verifying user'));
    });
  });
};

var verifyMobileNumberService = function verifyMobileNumberService(userId, otp, mobileNumber) {
  _logger["default"].message("Executing verifyMobileNumberService for user ".concat(userId));

  return new Promise(function (resolve, reject) {
    findAndVerifyMobileNumberService(userId, otp).then(function (verifiedUserDetails) {
      var currentDate = new Date();
      var forgotPasswordToken = (0, _verificationCodeUtil.generateVerificationCode)((0, _moment["default"])(currentDate).add(_config["default"].get('verificationLinkExpiryDuration'), 'hours'), {
        mobileNumber: mobileNumber
      });
      updateUserOtpDetails(verifiedUserDetails, mobileNumber, forgotPasswordToken).then(function () {
        _logger["default"].message("Successfully executed verifyMobileNumberService");

        return resolve({
          token: forgotPasswordToken
        });
      })["catch"](function (error) {
        _logger["default"].message("Error occurred while updating otp details ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

        return reject(error);
      });
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while verifying code ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(error);
    });
  });
};

var _default = verifyMobileNumberService;
exports["default"] = _default;