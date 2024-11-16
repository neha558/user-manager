"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

/**
 *
 * @param {array} validations array of validations to be combined for eg. ["any.required","string.empty"]
 * @param {string} errorMessage common message to be set for these validations
 *
 * @returns {object} returns a validation message object
 *
 * eg.
 * combineValidationMessages(["any.required","string.empty"],"Pollname is mandatory");
 *
 * will return
 * {"any.empty":"Poll name is mandatory","any.required":"Pollname is mandatory"}
 */
var combineValidationMessages = function combineValidationMessages(validations, errorMessage) {
  var validationMessageRules = {};
  validations.forEach(function (fieldRule) {
    validationMessageRules[fieldRule] = errorMessage;
  });
  return validationMessageRules;
};
/**
 *
 * @param {string} key it is the validation key eg. number.base
 * @param {string} dataType it is the data type being validated eg.number
 * @param {string} fieldText it is the name of field being validated eg. age
 *
 * @returns {object} returns an object of validation message
 *
 * eg: {"number.base":"Age should be a valid number"}
 */


var generateInvalidDataTypeMessage = function generateInvalidDataTypeMessage(key, dataType, fieldText) {
  return (0, _defineProperty2["default"])({}, key, "".concat(fieldText, " should be of type ").concat(dataType));
};
/**
 *
 * @param {*} field it field name
 * @param {*} enums enum list
 */


var generateInvalidEnumMessage = function generateInvalidEnumMessage(field, enums) {
  return {
    'any.only': "".concat(field, " should be one of ").concat(enums)
  };
};
/**
 *
 * @param {string } message it field name eg. email, name, password
 */


var generateMandatoryFieldMessage = function generateMandatoryFieldMessage(message) {
  return "".concat(message, " is a mandatory field");
};

module.exports = {
  combineValidationMessages: combineValidationMessages,
  generateInvalidDataTypeMessage: generateInvalidDataTypeMessage,
  generateInvalidEnumMessage: generateInvalidEnumMessage,
  generateMandatoryFieldMessage: generateMandatoryFieldMessage
};