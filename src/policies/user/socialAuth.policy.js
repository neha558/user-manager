const Joi = require('joi');

const {
  combineValidationMessages,
  generateMandatoryFieldMessage,
} = require('utils/validations');

const socialAuthPolicy = {
  body: Joi.object().keys({
    accessToken: Joi.string().messages({
      ...combineValidationMessages(
        ['any.required', 'string.empty'],
        generateMandatoryFieldMessage('accessToken'),
      ),
    }),
    provider: Joi.string()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('provider'),
        ),
      }),
    familyName: Joi.string().messages({
      ...combineValidationMessages(
        ['any.required', 'string.empty'],
        generateMandatoryFieldMessage('familyName'),
      ),
    }),
    givenName: Joi.string().messages({
      ...combineValidationMessages(
        ['any.required', 'string.empty'],
        generateMandatoryFieldMessage('givenName'),
      ),
    }),
    email: Joi.string().messages({
      ...combineValidationMessages(
        ['any.required', 'string.empty'],
        generateMandatoryFieldMessage('email'),
      ),
    }),
    id: Joi.string()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('id'),
        ),
      }),
    username: Joi.string().messages({
      ...combineValidationMessages(
        ['any.required', 'string.empty'],
        generateMandatoryFieldMessage('username'),
      ),
    }),
  }),
};

export default socialAuthPolicy;
