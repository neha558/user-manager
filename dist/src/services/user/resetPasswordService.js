"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _moment = _interopRequireDefault(require("moment"));

var _verificationCodeUtil = require("../../utilities/verificationCodeUtil");

/* eslint-disable no-console */
var _require = require("../../utilities/constants"),
    SALT_ROUND = _require.SALT_ROUND;

var findAndVerifyCode = function findAndVerifyCode(verificationCode) {
  _logger["default"].message("Executing findAndVerifyCode");

  return new Promise(function (resolve, reject) {
    _models["default"].User.findOne({
      where: {
        forgotPasswordToken: verificationCode
      }
    }).then(function (user) {
      _logger["default"].message("Found user with code ".concat(verificationCode, " for verification"));

      if (!user) {
        _logger["default"].message("Invalid verification code ".concat(verificationCode));

        return reject(new _exceptions.BadRequestException('Invalid verification code'));
      }

      var decodedToken = (0, _verificationCodeUtil.decodeVerificationCode)(verificationCode);
      var currentDate = (0, _moment["default"])(new Date());

      if ((0, _moment["default"])(currentDate).isAfter(JSON.parse(decodedToken).expiryDate)) {
        _logger["default"].message("Verification link has expired");

        return reject(new _exceptions.UnauthorizedException('Verification link has expired'));
      }

      return resolve({
        user: user,
        decodedToken: decodedToken
      });
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing findAndVerifyCode ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Something went wrong while verifying user'));
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


var resetPasswordService = function resetPasswordService(credentials) {
  _logger["default"].message("Executing resetPasswordService");

  return new Promise(function (resolve, reject) {
    findAndVerifyCode(credentials.token) // eslint-disable-next-line consistent-return
    .then( /*#__PURE__*/function () {
      var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
        var decodedToken, tokenDetails, _tokenDetails$data, _tokenDetails$data2, newPassword, whereClause;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                decodedToken = _ref.decodedToken;
                tokenDetails = JSON.parse(decodedToken);
                _context.prev = 2;
                _context.next = 5;
                return _bcrypt["default"].hash(credentials.password, SALT_ROUND);

              case 5:
                newPassword = _context.sent;
                whereClause = {};

                if (tokenDetails !== null && tokenDetails !== void 0 && (_tokenDetails$data = tokenDetails.data) !== null && _tokenDetails$data !== void 0 && _tokenDetails$data.mobileNumber) {
                  whereClause.mobileNumber = tokenDetails.data.mobileNumber;
                } else if (tokenDetails !== null && tokenDetails !== void 0 && (_tokenDetails$data2 = tokenDetails.data) !== null && _tokenDetails$data2 !== void 0 && _tokenDetails$data2.userName) {
                  whereClause.userName = tokenDetails.data.userName;
                } else {
                  whereClause.email = tokenDetails.data.email;
                }

                _models["default"].User.update({
                  password: newPassword,
                  forgotPasswordToken: null
                }, {
                  where: whereClause
                }).then(function () {
                  _logger["default"].message("Successfully reset password");

                  return resolve();
                })["catch"](function (error) {
                  _logger["default"].message("Error occurred while resetting password token ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

                  return reject(new _exceptions.ServerException('Failed to reset password'));
                });

                _context.next = 15;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](2);

                _logger["default"].message("Error occurred while resetting password token ".concat((_context.t0 === null || _context.t0 === void 0 ? void 0 : _context.t0.stack) || _context.t0));

                return _context.abrupt("return", reject(new _exceptions.ServerException('Failed to reset password')));

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 11]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }())["catch"](function (error) {
      _logger["default"].message("Error occurred while verifying token ".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      return reject(new _exceptions.ServerException('Your reset password link has expired. Request for new link and try again.'));
    });
  });
};

module.exports = resetPasswordService;