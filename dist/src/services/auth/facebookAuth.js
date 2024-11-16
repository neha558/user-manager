"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _lodash = require("lodash");

var _passport = _interopRequireDefault(require("passport"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

var _constants = require("../../utilities/constants");

var _commons = require("../../utilities/commons");

var _publishToKafka = _interopRequireDefault(require("../../kafka/publisher/publishToKafka"));

/* eslint-disable no-console */
var FacebookStrategy = require('passport-facebook').Strategy;

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
    if (count) {
      return userName;
    }

    return generateString(5, userName);
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

var checkEmailExits = function checkEmailExits(email) {
  return _models["default"].User.findOne({
    where: {
      email: email
    }
  }).then(function (userObject) {
    return userObject;
  });
};

var generateToken = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(user) {
    var token;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _jsonwebtoken["default"].sign({
              user: user
            }, _config["default"].get('TOKEN_SECRET'), {
              expiresIn: _constants.EXPIRES_IN // expires in 60 days

            });

          case 2:
            token = _context.sent;
            return _context.abrupt("return", token);

          case 4:
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
    var _dataObject$name, _dataObject$name2, dataObject, userName, user, token;

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
            return checkUserName(dataObject === null || dataObject === void 0 ? void 0 : dataObject.emails[0].value.split('@')[0]);

          case 7:
            userName = _context2.sent;
            _context2.next = 10;
            return _models["default"].User.create({
              facebookId: dataObject.id,
              firstName: dataObject === null || dataObject === void 0 ? void 0 : (_dataObject$name = dataObject.name) === null || _dataObject$name === void 0 ? void 0 : _dataObject$name.givenName,
              lastName: dataObject === null || dataObject === void 0 ? void 0 : (_dataObject$name2 = dataObject.name) === null || _dataObject$name2 === void 0 ? void 0 : _dataObject$name2.familyName,
              email: dataObject === null || dataObject === void 0 ? void 0 : dataObject.emails[0].value,
              userName: dataObject.userName === undefined ? userName : dataObject.userName,
              password: dataObject.password,
              verifyByEmail: new Date(),
              areTermsAccepted: true
            });

          case 10:
            user = _context2.sent;
            saveUserName({
              userId: user.userId,
              userName: user.userName
            });
            (0, _publishToKafka["default"])('USER-NOTIFICATION', user, 'CREATE');
            _context2.next = 15;
            return generateToken(user);

          case 15:
            token = _context2.sent;
            return _context2.abrupt("return", Promise.resolve(token));

          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](0);

            _logger["default"].message("Error occurred createUser social auth while fetching ".concat(_context2.t0));

            return _context2.abrupt("return", Promise.reject(_context2.t0));

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 19]]);
  }));

  return function createUser(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var facebookAuth = function facebookAuth(authType) {
  var facebookOptions = {
    clientID: _config["default"].get('clientID'),
    clientSecret: _config["default"].get('clientSecret'),
    callbackURL: _config["default"].get('callbackURL'),
    profileFields: ['id', 'email', 'name']
  };

  var facebookCallback = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(accessToken, refreshToken, profile, done) {
      var token, user, error, isEmailExists, _error;

      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _logger["default"].message('init facebook login');

              _context3.prev = 1;
              _context3.next = 4;
              return _models["default"].User.findOne({
                where: {
                  facebookId: profile.id
                }
              });

            case 4:
              user = _context3.sent;

              _logger["default"].message("Executing facebookCallback");

              if (!(user !== null)) {
                _context3.next = 16;
                break;
              }

              if (user.isSuspended) {
                error = 'Your account has been suspended by admin';
                done(null, {
                  error: error
                });
              }

              _logger["default"].message("Executing facebookCallback user found successfully");

              _context3.next = 11;
              return generateToken(user);

            case 11:
              token = _context3.sent;
              console.log('Login success', token);
              done(null, {
                token: token
              });
              _context3.next = 31;
              break;

            case 16:
              _logger["default"].message("Executing facebookCallback not user found request for create new user");

              _context3.next = 19;
              return checkEmailExits(profile.emails[0].value);

            case 19:
              isEmailExists = _context3.sent;

              if (!(isEmailExists !== null)) {
                _context3.next = 26;
                break;
              }

              _logger["default"].message("Email already exists");

              _error = (0, _commons.emailDuplicationMessage)(isEmailExists);
              done(null, {
                error: _error
              });
              _context3.next = 31;
              break;

            case 26:
              _logger["default"].message("Executing googleCallback token generated");

              _context3.next = 29;
              return createUser(profile, accessToken);

            case 29:
              token = _context3.sent;
              done(null, {
                token: token
              });

            case 31:
              _context3.next = 36;
              break;

            case 33:
              _context3.prev = 33;
              _context3.t0 = _context3["catch"](1);

              _logger["default"].message("Error occurred while fetching facebookCallback ".concat(_context3.t0));

            case 36:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 33]]);
    }));

    return function facebookCallback(_x4, _x5, _x6, _x7) {
      return _ref3.apply(this, arguments);
    };
  }();

  _passport["default"].use(new FacebookStrategy(facebookOptions, facebookCallback));

  if (authType === 'signup') {
    return _passport["default"].authenticate('facebook', {
      scope: 'email'
    });
  }

  return _passport["default"].authenticate('facebook', {
    failureRedirect: _config["default"].get('callbackFailureURL')
  });
};

module.exports = facebookAuth;