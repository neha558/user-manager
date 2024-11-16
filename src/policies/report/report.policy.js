const Joi = require('joi');
const {
  combineValidationMessages,
  generateMandatoryFieldMessage,
} = require('../../utilities/validations');

const ReportPolicy = {
  body: Joi.object().keys({
    user: Joi.any(),
    iat: Joi.any(),
    exp: Joi.any(),
    reportedUserId: Joi.number()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required'],
          generateMandatoryFieldMessage('reportedUserId'),
        ),
      }),
    reason: Joi.string()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required'],
          generateMandatoryFieldMessage('reason'),
        ),
      }),
  }),
};

module.exports = ReportPolicy;
