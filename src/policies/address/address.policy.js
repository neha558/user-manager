const Joi = require('joi');

const {
  combineValidationMessages,
  generateMandatoryFieldMessage,
  generateInvalidDataTypeMessage,
} = require('../../utilities/validations');

const addressPolicy = {
  body: Joi.object().keys({
    addressId: Joi.number(),
    userId: Joi.number()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('userId'),
        ),
      }),
    city: Joi.string()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('city'),
        ),
      }),
    state: Joi.string()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('state'),
        ),
      }),
    country: Joi.string()
      .min(2)
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('country'),
        ),
        ...generateInvalidDataTypeMessage('string', 'minOptionLimit'),
        'string.min': `"minOptionLimit" must be greater than or equal to 2`,
      }),
    latitude: Joi.number()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('latitude'),
        ),
      }),
    longitude: Joi.number()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('longitude'),
        ),
      }),
  }),
};

module.exports = addressPolicy;
