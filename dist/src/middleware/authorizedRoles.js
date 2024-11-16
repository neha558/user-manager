"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _logger = _interopRequireDefault(require("../../config/logger"));

var _exceptions = require("../utilities/exceptions");

var authorizedRoles = function authorizedRoles(roles) {
  return function (req, res, next) {
    if (!roles) {
      throw new _exceptions.UnauthorizedException(new Error('Unauthorized user'));
    }

    var finalRoles = roles || [];

    if (typeof roles === 'string') {
      finalRoles = [roles];
    }

    _logger["default"].message("executing authorizedRoles");

    var user = req.body.user;
    var _user$roles = user.roles,
        userRoles = _user$roles === void 0 ? [] : _user$roles;

    if (!user == null) {
      throw new _exceptions.BadRequestException('User not found');
    }

    try {
      var allowAccess = false;
      finalRoles.forEach(function (role) {
        allowAccess = allowAccess || userRoles.includes(role);
      });

      if (!allowAccess) {
        _logger["default"].message("Unauthorized user");

        throw new _exceptions.UnauthorizedException(new Error('Unauthorized user'));
      }

      next();
    } catch (error) {
      _logger["default"].message("occurring error authorizedRoles".concat((error === null || error === void 0 ? void 0 : error.stack) || error));

      throw new _exceptions.UnauthorizedException(error);
    }
  };
};

module.exports = authorizedRoles;