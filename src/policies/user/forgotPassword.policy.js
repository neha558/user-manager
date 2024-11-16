const Joi = require('joi');
const { EMAIL_REGEX, USERNAME_REGEX } = require('utils/constants');

const {
  combineValidationMessages,
  generateMandatoryFieldMessage,
} = require('utils/validations');

const forgotPasswordPolicy = {
  body: Joi.object().keys({
    userName: Joi.string()
      .max(255, 'utf8')
      .pattern(USERNAME_REGEX)
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('userName'),
        ),
        'string.pattern.base': 'Please enter a valid userName',
      }),
    email: Joi.string()
      .max(255, 'utf8')
      .pattern(EMAIL_REGEX)
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('email'),
        ),
        'string.pattern.base': 'Please enter a valid email',
      }),
    mobileNumber: Joi.string()
      .max(14, 'utf8')
      .min(10, 'utf8')
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('mobileNumber'),
        ),
      }),
  }),
};

export default forgotPasswordPolicy;
