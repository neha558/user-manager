"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var Joi = require('joi');

var _require = require("../../utilities/validations"),
    combineValidationMessages = _require.combineValidationMessages,
    generateMandatoryFieldMessage = _require.generateMandatoryFieldMessage,
    generateInvalidDataTypeMessage = _require.generateInvalidDataTypeMessage;

var addressPolicy = {
  body: Joi.object().keys({
    addressId: Joi.number(),
    userId: Joi.number().required().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('userId')))),
    city: Joi.string().required().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('city')))),
    state: Joi.string().required().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('state')))),
    country: Joi.string().min(2).required().messages(_objectSpread(_objectSpread(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('country'))), generateInvalidDataTypeMessage('string', 'minOptionLimit')), {}, {
      'string.min': "\"minOptionLimit\" must be greater than or equal to 2"
    })),
    latitude: Joi.number().required().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('latitude')))),
    longitude: Joi.number().required().messages(_objectSpread({}, combineValidationMessages(['any.required', 'string.empty'], generateMandatoryFieldMessage('longitude'))))
  })
};
module.exports = addressPolicy;