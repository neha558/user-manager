"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _exceptions = require("../../utilities/exceptions");

var _models = _interopRequireDefault(require("../../models"));

var _logger = _interopRequireDefault(require("../../../config/logger"));

var _map = _interopRequireDefault(require("lodash/map"));

var _commons = require("../../utilities/commons");

var _sequelize = require("sequelize");

var _generateQuery2 = _interopRequireDefault(require("../../utilities/generateQuery"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var modifyUsers = function modifyUsers(users) {
  _logger["default"].message("Executing modifyUsers");

  var nullRemovedUsers = (0, _commons.removeNullFromObject)(users);
  return (0, _map["default"])(nullRemovedUsers, function (user) {
    var newUser = _objectSpread({}, user);

    delete newUser.password;
    delete newUser.emailVerificationCode;
    delete newUser.forgotPasswordToken;
    newUser.fullName = "".concat(user.firstName, " ").concat(user.lastName);
    return newUser;
  });
};

var generateIncludeWhere = function generateIncludeWhere(cityName, stateName) {
  var includeWhere;

  if (cityName) {
    includeWhere = {
      city: (0, _defineProperty2["default"])({}, _sequelize.Op.like, cityName)
    };
  }

  if (stateName) {
    includeWhere = _objectSpread(_objectSpread({}, includeWhere), {}, {
      state: (0, _defineProperty2["default"])({}, _sequelize.Op.like, stateName)
    });
  }

  return includeWhere;
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


var getUserService = function getUserService(query) {
  var limit = query.limit,
      offset = query.offset,
      cityName = query.cityName,
      stateName = query.stateName;

  var _generateQuery = (0, _generateQuery2["default"])(query),
      order = _generateQuery.order,
      where = _generateQuery.where;

  _logger["default"].message("Executing admin getUserService");

  return new Promise(function (resolve, reject) {
    var attributes = ['userId', 'firstName', 'lastName', 'userName', 'mobileNumber', 'email', 'gender', 'imageId', 'createdAt', 'isSuspended'];
    var includeWhere = generateIncludeWhere(cityName, stateName);

    _models["default"].User.findAndCountAll({
      attributes: attributes,
      offset: offset,
      limit: limit,
      order: order,
      where: where,
      include: [{
        model: _models["default"].Address,
        though: 'addresses',
        where: includeWhere,
        as: 'address'
      }]
    }).then(function (result) {
      _logger["default"].message("Executing admin getUserService successfully");

      return resolve({
        pageInfo: {
          totalCount: result.count
        },
        data: modifyUsers(result.rows)
      });
    })["catch"](function (error) {
      _logger["default"].message("Error occurred while executing admin getUserService ".concat((error === null || error === void 0 ? void 0 : error.stack) || error), '');

      return reject(new _exceptions.ServerException('Unable to get user'));
    });
  });
};

module.exports = getUserService;