const Joi = require('joi');

const {
  combineValidationMessages,
  generateMandatoryFieldMessage,
} = require('../../utilities/validations');

const contactsPolicy = {
  body: Joi.object().keys({
    user: Joi.any(),
    iat: Joi.any(),
    exp: Joi.any(),
    contacts: Joi.array().items({
      contactNumber: Joi.number()
        .required()
        .messages({
          ...combineValidationMessages(
            ['any.required', 'string.empty'],
            generateMandatoryFieldMessage('contactNumber'),
          ),
        }),
      firstName: Joi.string().messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('firstName'),
        ),
      }),
      lastName: Joi.string().messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('lastName'),
        ),
      }),
    }),
  }),
};

module.exports = contactsPolicy;
