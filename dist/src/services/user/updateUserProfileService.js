"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _constants = require("../../utilities/constants");

var _lodash = require("lodash");

var _verificationCodeUtil = require("../../utilities/verificationCodeUtil");

var _generateOtp = _interopRequireDefault(require("../../utilities/generateOtp"));

var _moment = _interopRequireDefault(require("moment"));

var _config = _interopRequireDefault(require("config"));

var _sequelize = require("sequelize");

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var updateSyncedContact = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(userId, requestedUserDetails) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _logger["default"].message("Executing updateSyncedContact");

            _context.next = 3;
            return _models["default"].syncedContacts.update({
              systemFirstName: requestedUserDetails.firstName,
              systemLastName: requestedUserDetails.lastName,
              contactUserName: requestedUserDetails.userName,
              contactNumber: requestedUserDetails.mobileNumber
            }, {
              where: {
                contactUserId: userId
              },
              returning: true
            }).then(function (fetchedUser) {
              _logger["default"].message("Executing updateSyncedContact successfully");

              return fetchedUser;
            })["catch"](function (error) {
              _logger["default"].message("Executing updateSyncedContact failure ".concat(error));
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function updateSyncedContact(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var checkUserName = function checkUserName(_ref2, userId) {
  var userName = _ref2.userName;

  _logger["default"].message("Executing checkUserName");

  return new Promise(function (resolve, reject) {
    if (!userName) {
      return resolve(false);
    }

    return _models["default"].Username.count({
      where: (0, _defineProperty2["default"])({
        userName: userName
      }, _sequelize.Op.not, [{
        userId: [userId]
      }])
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
  _logger["default"].message("Executing userNameSave");

  return new Promise(function (resolve, reject) {
    _models["default"].Username.create(userData).then(function (success) {
      _logger["default"].message("successfully Execute checkUserName");

      var responseData = success !== 0;
      return resolve(responseData);
    })["catch"](function (err) {
      _logger["default"].message("Error on Executing checkUserName".concat(err));

      return reject(new _exceptions.BadRequestException('Username already exists.'));
    });
  });
};

var findUserAndCreateUpdateObject = function findUserAndCreateUpdateObject(userDetails, userId) {
  _logger["default"].message("Executing findUserAndCreateUpdateObject");

  var requestedUserDetails = (0, _lodash.cloneDeep)(userDetails);
  return new Promise(function (resolve, reject) {
    return checkUserName(userDetails, userId).then(function (checkUserNameObject) {
      if (checkUserNameObject) {
        return reject(new _exceptions.BadRequestException('Username already exists.'));
      }

      return _models["default"].User.findByPk(userId, {
        raw: true
      }).then( /*#__PURE__*/function () {
        var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(fetchedUser) {
          var user, currentDate, _currentDate;

          return _regenerator["default"].wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  user = (0, _lodash.cloneDeep)(fetchedUser);

                  if (requestedUserDetails.email && requestedUserDetails.email !== user.email) {
                    currentDate = new Date();
                    requestedUserDetails.emailVerificationCode = (0, _verificationCodeUtil.generateVerificationCode)((0, _moment["default"])(currentDate).add(_config["default"].get('verificationLinkExpiryDuration'), 'hours'), {
                      email: requestedUserDetails.email
                    });
                    requestedUserDetails.email = user.email;
                  }

                  if (requestedUserDetails.mobileNumber && requestedUserDetails.mobileNumber !== user.mobileNumber) {
                    requestedUserDetails.otp = (0, _generateOtp["default"])();
                    _currentDate = new Date();
                    requestedUserDetails.otpExpiryTime = (0, _moment["default"])(_currentDate).add(_config["default"].get('otpExpiryDuration'), 'minutes');
                    requestedUserDetails.mobileNumber = user.mobileNumber;
                  }

                  if (requestedUserDetails.userName) {
                    saveUserName({
                      userId: user.userId,
                      userName: requestedUserDetails.userName
                    }).then(function () {
                      _logger["default"].message("Executing saveUserName was successful");

                      return resolve(requestedUserDetails);
                    })["catch"](function () {
                      _logger["default"].message("Executing saveUserName was successful");

                      return reject(new _exceptions.ServerException('Unable to save userName'));
                    });
                  }

                  _context2.next = 6;
                  return updateSyncedContact(user.userId, requestedUserDetails);

                case 6:
                  return _context2.abrupt("return", resolve(requestedUserDetails));

                case 7:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      }())["catch"](function (error) {
        _logger["default"].message("Error occurred while executing finding user ".concat(error.stack || error));

        return reject(new _exceptions.ServerException('Failed to update user profile'));
      });
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing finding user ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Failed to update user profile'));
    });
  });
};

var sendEmailOrSms = function sendEmailOrSms(updatedUser, requestedUserDetails) {
  var notificationEvent = {};

  if (requestedUserDetails.email && requestedUserDetails.email !== updatedUser.email) {
    notificationEvent.type = 'EMAIL';
    notificationEvent.activityTime = updatedUser.updatedAt;
    notificationEvent.userId = updatedUser.userId;
    notificationEvent.emailOptions = {
      from: _config["default"].get('adminEmailId'),
      to: requestedUserDetails.email,
      subject: 'Public poll email verification',
      text: "Click on the link to verify your email with public poll ".concat(_config["default"].get('emailVerificationUrl'), "/").concat(updatedUser.emailVerificationCode)
    };
  }

  if (requestedUserDetails.mobileNumber && requestedUserDetails.mobileNumber !== updatedUser.mobileNumber) {
    notificationEvent.type = 'SMS';
    notificationEvent.activityTime = updatedUser.updatedAt;
    notificationEvent.userId = updatedUser.userId;
    notificationEvent.smsOptions = {
      message: "".concat(updatedUser.otp, " is your one time password (OTP) for Public Poll."),
      phoneNumber: requestedUserDetails.mobileNumber
    };
  }

  if (Object.keys(notificationEvent).length > 0) {
    (0, _publishToKafka["default"])('SMS-EMAIL-NOTIFICATION', notificationEvent, 'CREATE');
  }
};

var getPreviousImageId = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(params) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _logger["default"].message("Executing getPreviousImageId");

            _context3.next = 3;
            return _models["default"].User.findOne({
              attributes: ['imageId'],
              where: {
                userId: params.userId
              }
            }).then(function (user) {
              _logger["default"].message("Executing getPreviousImageId successful ".concat(user));

              (0, _publishToKafka["default"])('FILE-UPDATE', user === null || user === void 0 ? void 0 : user.imageId, 'DELETE');
            })["catch"](function (error) {
              _logger["default"].message("Error on Executing getPreviousImageId ".concat(error));
            });

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getPreviousImageId(_x4) {
    return _ref4.apply(this, arguments);
  };
}();

var checkEmailOrMobileExists = function checkEmailOrMobileExists(_ref5, userId) {
  var mobileNumber = _ref5.mobileNumber,
      email = _ref5.email,
      userName = _ref5.userName;

  _logger["default"].message("Executing checkEmailOrMobile");

  return new Promise(function (resolve, reject) {
    _logger["default"].message("Executing checkEmailOrMobile");

    if (mobileNumber === undefined && email === undefined && userName === undefined) {
      return resolve(false);
    }

    var where = {};
    var lableName;

    if (mobileNumber) {
      where = (0, _defineProperty2["default"])({
        mobileNumber: (0, _defineProperty2["default"])({}, _sequelize.Op.iLike, mobileNumber)
      }, _sequelize.Op.not, [{
        userId: [userId]
      }]);
      lableName = 'Mobile Number';
    }

    if (email) {
      where = (0, _defineProperty2["default"])({
        email: (0, _defineProperty2["default"])({}, _sequelize.Op.iLike, email)
      }, _sequelize.Op.not, [{
        userId: [userId]
      }]);
      lableName = 'Email';
    }

    if (userName) {
      where = (0, _defineProperty2["default"])({
        userName: (0, _defineProperty2["default"])({}, _sequelize.Op.iLike, userName)
      }, _sequelize.Op.not, [{
        userId: [userId]
      }]);
      lableName = 'userName';
      return checkUserName({
        userName: userName
      }, userId).then(function (success) {
        _logger["default"].message("successfully Execute checkEmailOrMobile");

        return resolve(success);
      })["catch"](function (error) {
        _logger["default"].message("Error on Executing checkEmailOrMobile".concat(error));

        return reject(new _exceptions.BadRequestException("".concat(lableName, " already exists.")));
      });
    }

    return _models["default"].User.count({
      where: where
    }).then(function (success) {
      _logger["default"].message("successfully Execute checkEmailOrMobile");

      var responseData = success !== 0;
      return resolve(responseData);
    })["catch"](function (err) {
      _logger["default"].message("Error on Executing checkEmailOrMobile".concat(err));

      return reject(new _exceptions.BadRequestException("".concat(lableName, " already exists.")));
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


var updateUserProfile = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data, params) {
    var dataObject;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _logger["default"].message("Executing updateUserProfile ");

            dataObject = (0, _lodash.cloneDeep)(data);

            if (!dataObject.password) {
              _context4.next = 6;
              break;
            }

            _context4.next = 5;
            return _bcrypt["default"].hash(dataObject.password, _constants.SALT_ROUND);

          case 5:
            dataObject.password = _context4.sent;

          case 6:
            return _context4.abrupt("return", new Promise(function (resolve, reject) {
              _logger["default"].message("Executing updateUserProfile ");

              return checkEmailOrMobileExists(dataObject, params.userId).then(function (success) {
                _logger["default"].message("Executing updateUserProfile ".concat(success));

                if (success) {
                  var fieldName;

                  if (dataObject.mobileNumber) {
                    fieldName = 'Mobile Number';
                  } else if (dataObject.email) {
                    fieldName = 'Email';
                  } else {
                    fieldName = 'UserName';
                  }

                  return reject(new _exceptions.BadRequestException("".concat(fieldName, " already exists.")));
                }

                findUserAndCreateUpdateObject(dataObject, params.userId).then(function (userDetails) {
                  var requestedUserDetails = (0, _lodash.cloneDeep)(userDetails);

                  if ((dataObject === null || dataObject === void 0 ? void 0 : dataObject.imageId) === null) {
                    getPreviousImageId(params);
                    requestedUserDetails.imageId = (userDetails === null || userDetails === void 0 ? void 0 : userDetails.imageId) == null ? null : userDetails === null || userDetails === void 0 ? void 0 : userDetails.imageId;
                  }

                  _models["default"].User.update(_objectSpread(_objectSpread({}, requestedUserDetails), {}, {
                    isNewLogin: false
                  }), {
                    where: {
                      userId: params.userId
                    },
                    returning: true
                  }).then(function (updatedUser) {
                    _logger["default"].message("Executing updateUserProfile was successful");

                    (0, _publishToKafka["default"])('USER-NOTIFICATION', updatedUser[1][0], 'UPDATE');
                    sendEmailOrSms(updatedUser[1][0], dataObject);
                    return resolve();
                  })["catch"](function (error) {
                    _logger["default"].message("Error occurred while executing updateUserProfile ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

                    return reject(new _exceptions.ServerException('Unable to updateUserProfile'));
                  });
                })["catch"](function (error) {
                  if (error !== null && error !== void 0 && error.description) {
                    _logger["default"].message("userName must be unique ".concat(error === null || error === void 0 ? void 0 : error.description));

                    return reject(new _exceptions.BadRequestException("".concat(error === null || error === void 0 ? void 0 : error.description)));
                  }

                  _logger["default"].message("Error occurred while executing updateUserProfile ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

                  return reject(new _exceptions.ServerException('Failed to update user profile'));
                });
                return resolve(success);
              }, function (error) {
                _logger["default"].message("Error on Executing updateUserProfile ".concat(error));

                return reject(new _exceptions.ServerException('Failed to update user profile'));
              });
            }));

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function updateUserProfile(_x5, _x6) {
    return _ref6.apply(this, arguments);
  };
}();

var _default = updateUserProfile;
exports["default"] = _default;