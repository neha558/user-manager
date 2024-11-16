const Joi = require('joi');

const {
  combineValidationMessages,
  generateMandatoryFieldMessage,
} = require('utils/validations');

const resetPasswordPolicy = {
  body: Joi.object().keys({
    token: Joi.string().messages({
      ...combineValidationMessages(
        ['any.required', 'string.empty'],
        generateMandatoryFieldMessage('email'),
      ),
      'string.pattern.base': 'Please enter a valid email',
    }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('password'),
        ),
        'string.min': `Password should have a minimum 8 Char length`,
      }),
  }),
};

export default resetPasswordPolicy;
