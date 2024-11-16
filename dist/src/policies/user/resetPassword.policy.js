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

var resetPasswordPolicy = {
  body: Joi.object().keys({
    token: Joi.string().messages(_objectSpread(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('email'))), {}, {
      'string.pattern.base': 'Please enter a valid email'
    })),
    password: Joi.string().min(8).required().messages(_objectSpread(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('password'))), {}, {
      'string.min': "Password should have a minimum 8 Char length"
    }))
  })
};
var _default = resetPasswordPolicy;
exports["default"] = _default;