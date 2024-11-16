"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _lodash = require("lodash");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

var _constants = require("../../utilities/constants");

var _commons = require("../../utilities/commons");

var _exceptions = require("../../utilities/exceptions");

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

var _roles = _interopRequireDefault(require("../../constant/roles"));

var generateString = function generateString(length, userName) {
  var result = '';
  var charactersLength = _constants.CHARACTERS.length;

  for (var i = 0; i < length; i += 1) {
    result += _constants.CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
  }

  return userName + result;
};

var checkUserName = function checkUserName(userName) {
  return _models["default"].Username.count({
    where: {
      userName: userName
    }
  }).then(function (count) {
    var newUserName = count === 0 ? userName : generateString(5, userName);
    return newUserName;
  });
};

var checkEmailExits = function checkEmailExits(email) {
  return _models["default"].User.findOne({
    where: {
      email: email
    }
  }).then(function (userObject) {
    return userObject;
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

var generateToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user) {
    var userObject, token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userObject = user.get({
              plain: true
            });

            if (userObject.email === _config["default"].get('adminEmail') || userObject.mobileNumber === _config["default"].get('adminMobileNumber') || userObject.userName === _config["default"].get('adminUserName')) {
              userObject.roles = [_roles["default"].ADMIN];
            }

            _context.next = 4;
            return _jsonwebtoken["default"].sign({
              user: userObject
            }, _config["default"].get('TOKEN_SECRET'), {
              expiresIn: _constants.EXPIRES_IN // expires in 60 days

            });

          case 4:
            token = _context.sent;
            return _context.abrupt("return", token);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function generateToken(_x) {
    return _ref.apply(this, arguments);
  };
}();

var createUser = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(profile, accessToken) {
    var dataObject, userName, userObject, user, token;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            dataObject = (0, _lodash.cloneDeep)(profile);
            _context2.next = 4;
            return _bcrypt["default"].hash(accessToken, _constants.SALT_ROUND);

          case 4:
            dataObject.password = _context2.sent;
            _context2.next = 7;
            return checkUserName(profile === null || profile === void 0 ? void 0 : profile.email.split('@')[0]);

          case 7:
            userName = _context2.sent;

            if (dataObject.provider === 'apple') {
              userObject = {
                appleId: dataObject.id,
                firstName: dataObject === null || dataObject === void 0 ? void 0 : dataObject.givenName,
                lastName: dataObject === null || dataObject === void 0 ? void 0 : dataObject.familyName,
                email: dataObject === null || dataObject === void 0 ? void 0 : dataObject.email,
                userName: dataObject.userName === undefined ? userName : dataObject.userName,
                password: dataObject.password,
                verifyByEmail: new Date(),
                areTermsAccepted: true
              };
            }

            if (dataObject.provider === 'google') {
              userObject = {
                googleId: dataObject.id,
                firstName: dataObject === null || dataObject === void 0 ? void 0 : dataObject.givenName,
                lastName: dataObject === null || dataObject === void 0 ? void 0 : dataObject.familyName,
                email: dataObject === null || dataObject === void 0 ? void 0 : dataObject.email,
                userName: dataObject.userName === undefined ? userName : dataObject.userName,
                password: dataObject.password,
                verifyByEmail: new Date(),
                areTermsAccepted: true
              };
            }

            if (dataObject.provider === 'facebook') {
              userObject = {
                facebookId: dataObject.id,
                firstName: dataObject === null || dataObject === void 0 ? void 0 : dataObject.givenName,
                lastName: dataObject === null || dataObject === void 0 ? void 0 : dataObject.familyName,
                email: dataObject === null || dataObject === void 0 ? void 0 : dataObject.email,
                userName: dataObject.userName === undefined ? userName : dataObject.userName,
                password: dataObject.password,
                verifyByEmail: new Date(),
                areTermsAccepted: true
              };
            }

            _context2.next = 13;
            return _models["default"].User.create(userObject);

          case 13:
            user = _context2.sent;
            saveUserName({
              userId: user.userId,
              userName: user.userName
            });
            (0, _publishToKafka["default"])('USER-NOTIFICATION', user, 'CREATE');
            _context2.next = 18;
            return generateToken(user);

          case 18:
            token = _context2.sent;
            return _context2.abrupt("return", Promise.resolve(token));

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](0);

            _logger["default"].message("Error occurred createUser social auth while fetching ".concat(_context2.t0));

            return _context2.abrupt("return", Promise.reject(_context2.t0));

          case 26:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 22]]);
  }));

  return function createUser(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var socialAuth = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(bodyObject) {
    var where, user, error, _token, isEmailExists, _error, token;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _logger["default"].message("Executing socialAuth");

            if (bodyObject.provider === 'google') {
              where = {
                googleId: bodyObject.id
              };
            }

            if (bodyObject.provider === 'facebook') {
              where = {
                facebookId: bodyObject.id
              };
            }

            if (bodyObject.provider === 'apple') {
              where = {
                appleId: bodyObject.id
              };
            }

            _logger["default"].message("Executing socialAuth with ".concat(bodyObject.provider, " provider"));

            _context3.next = 7;
            return _models["default"].User.findOne({
              where: where
            });

          case 7:
            user = _context3.sent;

            if (!(user !== null)) {
              _context3.next = 17;
              break;
            }

            if (!user.isSuspended) {
              _context3.next = 12;
              break;
            }

            error = 'Your account has been suspended by admin';
            return _context3.abrupt("return", Promise.reject(new _exceptions.BadRequestException(error)));

          case 12:
            _logger["default"].message("Executing socialAuth user found successfully");

            _context3.next = 15;
            return generateToken(user);

          case 15:
            _token = _context3.sent;
            return _context3.abrupt("return", Promise.resolve({
              token: _token
            }));

          case 17:
            _logger["default"].message("Executing socialAuth not user found request for create new user");

            _context3.next = 20;
            return checkEmailExits(bodyObject.email);

          case 20:
            isEmailExists = _context3.sent;

            if (!(isEmailExists !== null)) {
              _context3.next = 25;
              break;
            }

            _logger["default"].message("Email ".concat(bodyObject.email, " already exists"));

            _error = (0, _commons.emailDuplicationMessage)(isEmailExists);
            return _context3.abrupt("return", Promise.reject(new _exceptions.BadRequestException(_error)));

          case 25:
            _logger["default"].message("Executing socialAuth token generated");

            _context3.next = 28;
            return createUser(bodyObject, bodyObject.accessToken);

          case 28:
            token = _context3.sent;
            return _context3.abrupt("return", Promise.resolve({
              token: token
            }));

          case 30:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function socialAuth(_x4) {
    return _ref3.apply(this, arguments);
  };
}();

module.exports = socialAuth;