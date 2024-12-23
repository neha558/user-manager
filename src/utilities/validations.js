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
const combineValidationMessages = (validations, errorMessage) => {
  const validationMessageRules = {};
  validations.forEach((fieldRule) => {
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
const generateInvalidDataTypeMessage = (
  key,
  dataType,
  fieldText,
) => ({
  [key]: `${fieldText} should be of type ${dataType}`,
});

/**
 *
 * @param {*} field it field name
 * @param {*} enums enum list
 */
const generateInvalidEnumMessage = (field, enums) => ({
  'any.only': `${field} should be one of ${enums}`,
});
/**
 *
 * @param {string } message it field name eg. email, name, password
 */
const generateMandatoryFieldMessage = (message) =>
  `${message} is a mandatory field`;

module.exports = {
  combineValidationMessages,
  generateInvalidDataTypeMessage,
  generateInvalidEnumMessage,
  generateMandatoryFieldMessage,
};
