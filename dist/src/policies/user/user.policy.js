"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _constants = require("../../utilities/constants");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Joi = require('joi');

var _require = require("../../utilities/validations"),
    combineValidationMessages = _require.combineValidationMessages,
    generateMandatoryFieldMessage = _require.generateMandatoryFieldMessage;

var userPolicy = {
  body: Joi.object().keys({
    userId: Joi.string(),
    firstName: Joi.string().max(50).required().messages(_objectSpread(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('firstName'))), {}, {
      'string.max': "lastName should have a maximum 50 Char length"
    })),
    lastName: Joi.string().max(50).required().messages(_objectSpread(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('lastName'))), {}, {
      'string.max': "lastName should have a maximum 50 Char length"
    })),
    userName: Joi.string().max(100).min(1).required().pattern(_constants.USERNAME_REGEX).messages(_objectSpread(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('userName'))), {}, {
      'string.pattern.base': "Invalid userName entered",
      'string.min': "Password should have a minimum 1 Char length"
    })),
    email: Joi.string().max(50).pattern(_constants.EMAIL_REGEX).messages(_objectSpread(_objectSpread({}, combineValidationMessages(['string.empty'], generateMandatoryFieldMessage('email'))), {}, {
      'string.pattern.base': "Invalid email Address entered"
    })),
    mobileNumber: Joi.string().messages(_objectSpread({}, combineValidationMessages(['string.empty'], generateMandatoryFieldMessage('mobileNumber')))),
    password: Joi.string().min(8).required().messages(_objectSpread(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('password'))), {}, {
      'string.min': "Password should have a minimum 8 Char length"
    })),
    bio: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    twoFactorAuthentication: Joi["boolean"]().allow(null, ''),
    forgotPasswordToken: Joi.string().allow(null, ''),
    verifyByEmail: Joi.date().allow(null, ''),
    verifyByMobile: Joi.date().allow(null, ''),
    otp: Joi.date().allow(null, ''),
    otpExpiryTime: Joi.date().allow(null, ''),
    status: Joi.string().valid('ACTIVE', 'DEACTIVE', 'BLOCKED').messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('status')))),
    imageId: Joi.string().allow(null, ''),
    profileBanner: Joi.string().allow(null, ''),
    gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('gender')))),
    dateOfBirth: Joi.date().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('dateOfBirth')))),
    language: Joi.string().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('language')))),
    interests: Joi.array().items(Joi.string()).messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('interests')))),
    googleId: Joi.string().allow(null, '').messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('googleId')))),
    facebookId: Joi.string().allow(null, '').messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('facebookId')))),
    areTermsAccepted: Joi["boolean"]().required().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('tncAccepted'))))
  })
};
var _default = userPolicy;
exports["default"] = _default;