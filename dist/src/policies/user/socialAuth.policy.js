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

var _require = require("../../utilities/validations"),
    combineValidationMessages = _require.combineValidationMessages,
    generateMandatoryFieldMessage = _require.generateMandatoryFieldMessage;

var socialAuthPolicy = {
  body: Joi.object().keys({
    accessToken: Joi.string().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('accessToken')))),
    provider: Joi.string().required().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('provider')))),
    familyName: Joi.string().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('familyName')))),
    givenName: Joi.string().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('givenName')))),
    email: Joi.string().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('email')))),
    id: Joi.string().required().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('id')))),
    username: Joi.string().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('username'))))
  })
};
var _default = socialAuthPolicy;
exports["default"] = _default;