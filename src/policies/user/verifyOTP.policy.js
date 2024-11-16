const Joi = require('joi');

const {
  combineValidationMessages,
  generateMandatoryFieldMessage,
} = require('utils/validations');

const verifyOTPPolicy = {
  body: Joi.object().keys({
    userId: Joi.any()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('userId'),
        ),
      }),
    otp: Joi.string()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('userId'),
        ),
      }),
    mobileNumber: Joi.string()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('password'),
        ),
      }),
  }),
};

export default verifyOTPPolicy;
