"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Joi = require('joi');

var _require = require("../../utilities/constants"),
    EMAIL_REGEX = _require.EMAIL_REGEX,
    USERNAME_REGEX = _require.USERNAME_REGEX;

var _require2 = require("../../utilities/validations"),
    combineValidationMessages = _require2.combineValidationMessages,
    generateMandatoryFieldMessage = _require2.generateMandatoryFieldMessage;

var forgotPasswordPolicy = {
  body: Joi.object().keys({
    userName: Joi.string().max(255, 'utf8').pattern(USERNAME_REGEX).messages(_objectSpread(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('userName'))), {}, {
      'string.pattern.base': 'Please enter a valid userName'
    })),
    email: Joi.string().max(255, 'utf8').pattern(EMAIL_REGEX).messages(_objectSpread(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('email'))), {}, {
      'string.pattern.base': 'Please enter a valid email'
    })),
    mobileNumber: Joi.string().max(14, 'utf8').min(10, 'utf8').messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('mobileNumber'))))
  })
};
var _default = forgotPasswordPolicy;
exports["default"] = _default;