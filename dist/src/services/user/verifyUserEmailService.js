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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var findAndVerifyCode = function findAndVerifyCode(verificationCode) {
  _logger["default"].message("Executing findAndVerifyCode");

  return new Promise(function (resolve, reject) {
    _models["default"].User.findOne({
      where: {
        emailVerificationCode: verificationCode
      }
    }).then(function (user) {
      _logger["default"].message("Found user with code ".concat(verificationCode, " for verification"));

      if (!user) {
        _logger["default"].message("Invalid verification code ".concat(verificationCode));

        return reject(new _exceptions.BadRequestException('Invalid verification code'));
      }

      var decodedValue = (0, _verificationCodeUtil.decodeVerificationCode)(verificationCode);
      var currentDate = (0, _moment["default"])(new Date());

      if ((0, _moment["default"])(currentDate).isAfter(JSON.parse(decodedValue).expiryDate)) {
        _logger["default"].message("Verification link has expired");

        return reject(new _exceptions.UnauthorizedException('Verification link has expired'));
      }

      var newEmail = JSON.parse(decodedValue).data.email;
      return resolve({
        user: user,
        newEmail: newEmail
      });
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing findAndVerifyCode ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Something went wrong while verifying user'));
    });
  });
};

var updateUserVerificationDetails = function updateUserVerificationDetails(userDetails, email) {
  _logger["default"].message("Executing updateUserVerificationDetails for user ".concat(userDetails.userId));

  return new Promise(function (resolve, reject) {
    var updateUserObject = _objectSpread(_objectSpread({}, userDetails), {}, {
      email: email,
      emailVerificationCode: null,
      verifyByEmail: new Date()
    });

    _models["default"].User.update(updateUserObject, {
      where: {
        userId: userDetails.userId
      },
      returning: true
    }).then(function (updatedUser) {
      _logger["default"].message("Successfully executed updateUserVerificationDetails");

      return resolve(updatedUser);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing updateUserVerificationDetails ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Something went wrong while verifying code'));
    });
  });
};

var verifyUserEmailService = function verifyUserEmailService(verificationCode) {
  _logger["default"].message("Executing verifyUserEmailService for verificationCode ".concat(verificationCode));

  return new Promise(function (resolve, reject) {
    findAndVerifyCode(verificationCode).then(function (_ref) {
      var user = _ref.user,
          newEmail = _ref.newEmail;
      updateUserVerificationDetails(user, newEmail).then(function () {
        _logger["default"].message("Successfully executed verifyUserEmailService");

        return resolve();
      })["catch"](function (error) {
        _logger["default"].message("Error occurred while updating verification details ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

        return reject(error);
      });
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while verifying code ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(error);
    });
  });
};

var _default = verifyUserEmailService;
exports["default"] = _default;