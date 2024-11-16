"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _constants = require("../../utilities/constants");

var _lodash = require("lodash");

var _checkUserExists = _interopRequireDefault(require("../../utilities/checkUserExists"));

var _verificationCodeUtil = require("../../utilities/verificationCodeUtil");

var _generateOtp = _interopRequireDefault(require("../../utilities/generateOtp"));

var _moment = _interopRequireDefault(require("moment"));

var _config = _interopRequireDefault(require("config"));

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

var _userCreateTemplate = _interopRequireDefault(require("../../templates/userCreateTemplate"));

var capitalize = function capitalize(inputString) {
  if (typeof inputString !== 'string') return '';
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
};

var sendEmailOrSms = function sendEmailOrSms(savedUser) {
  var notificationEvent = {};

  if (savedUser.email && savedUser.userName) {
    notificationEvent.type = 'EMAIL';
    notificationEvent.activityTime = savedUser.createdAt;
    notificationEvent.userId = savedUser.userId;
    notificationEvent.emailOptions = {
      from: _config["default"].get('adminEmailId'),
      to: savedUser.email,
      subject: 'Public poll email verification',
      html: (0, _userCreateTemplate["default"])(_config["default"].get('emailVerificationUrl'), savedUser.emailVerificationCode, _config["default"].get('IMAGE_URL'))
    };
  } else {
    notificationEvent.type = 'SMS';
    notificationEvent.activityTime = savedUser.createdAt;
    notificationEvent.userId = savedUser.userId;
    notificationEvent.smsOptions = {
      message: "".concat(savedUser.otp, " is your one time password (OTP) for Public Poll."),
      phoneNumber: savedUser.mobileNumber
    };
  }

  (0, _publishToKafka["default"])('SMS-EMAIL-NOTIFICATION', notificationEvent, 'CREATE');
};

var checkUserName = function checkUserName(userName) {
  _logger["default"].message("Executing checkUserName");

  return new Promise(function (resolve, reject) {
    _models["default"].Username.count({
      where: {
        userName: userName
      }
    }).then(function (success) {
      _logger["default"].message("successfully Execute checkUserName");

      var responseData = success !== 0;
      return resolve(responseData);
    })["catch"](function (err) {
      _logger["default"].message("Error on Executing checkUserName".concat(err));

      return reject(new _exceptions.BadRequestException('Username already exists.'));
    });
  });
};

var saveUserName = function saveUserName(userData) {
  _logger["default"].message("Executing saveUserName");

  return new Promise(function (resolve, reject) {
    _models["default"].Username.create(userData).then(function (createUserName) {
      _logger["default"].message("successfully execute saveUserName");

      resolve(createUserName);
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing saveUserName ".concat(error));

      reject(error);
    });
  });
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


var createUserService = function createUserService(data) {
  _logger["default"].message("Executing createUserService");

  return new Promise(function (resolve, reject) {
    if (!data.email && !data.mobileNumber) {
      return reject(new _exceptions.BadRequestException('Email or mobile number filed required'));
    }

    return checkUserName(data.userName).then( /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(success) {
        var dataObject;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!success) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", reject(new _exceptions.BadRequestException('Username already exists.')));

              case 2:
                dataObject = (0, _lodash.cloneDeep)(data);
                _context.next = 5;
                return _bcrypt["default"].hash(dataObject.password, _constants.SALT_ROUND);

              case 5:
                dataObject.password = _context.sent;
                return _context.abrupt("return", (0, _checkUserExists["default"])(data).then(function (userCount) {
                  if (userCount) {
                    if (data.email) {
                      return reject(new _exceptions.BadRequestException('This email address is already being used.'));
                    }

                    return reject(new _exceptions.BadRequestException('This Phone Number is already being used.'));
                  }

                  if (userCount === null) {
                    dataObject.firstName = capitalize(dataObject.firstName);
                    dataObject.lastName = capitalize(dataObject.lastName);

                    if (data.email && data.userName) {
                      var currentDate = new Date();
                      dataObject.emailVerificationCode = (0, _verificationCodeUtil.generateVerificationCode)((0, _moment["default"])(currentDate).add(_config["default"].get('verificationLinkExpiryDuration'), 'hours'), {
                        email: data.email
                      });
                    }

                    if (data.mobileNumber) {
                      dataObject.otp = (0, _generateOtp["default"])();

                      var _currentDate = new Date();

                      dataObject.otpExpiryTime = (0, _moment["default"])(_currentDate).add(_config["default"].get('otpExpiryDuration'), 'minutes');
                    } // start create user


                    return _models["default"].User.create(dataObject).then(function (savedUser) {
                      _logger["default"].message("Executing createUserService was successful");

                      (0, _publishToKafka["default"])('USER-NOTIFICATION', savedUser, 'CREATE');
                      sendEmailOrSms(savedUser);
                      saveUserName({
                        userId: savedUser.userId,
                        userName: savedUser.userName
                      }).then(function () {
                        _logger["default"].message("Executing saveUserName was successful");

                        return resolve({
                          userId: savedUser.userId
                        });
                      })["catch"](function () {
                        _logger["default"].message("Executing saveUserName was successful");

                        return reject(new _exceptions.ServerException('Unable to save userName'));
                      });
                    })["catch"](function (error) {
                      if (error.errors[0].message) {
                        _logger["default"].message("userName must be unique ".concat(error.errors[0].message));

                        return reject(new _exceptions.ServerException('Unable to create User'));
                      }

                      _logger["default"].message("Error occurred while executing createUserService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

                      return reject(new _exceptions.ServerException('Unable to create User'));
                    }); // end create user
                  }

                  return userCount;
                }));

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }())["catch"](function (error) {
      _logger["default"].message("Error occurred while executing createUserService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Unable to create User'));
    });
  });
};

module.exports = createUserService;