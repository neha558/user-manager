const Joi = require('joi');

const {
  combineValidationMessages,
  generateMandatoryFieldMessage,
} = require('../../utilities/validations');

const blockUserPolicy = {
  body: Joi.object().keys({
    user: Joi.any(),
    iat: Joi.any(),
    exp: Joi.any(),
    blockUserId: Joi.number()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'number.empty'],
          generateMandatoryFieldMessage('blockUserId'),
        ),
        'number.base': 'blockUserId should be of type number',
      }),
    action: Joi.string()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('action'),
        ),
        'string.base': 'action should be of type string',
        'string.max': 'action should be of Max 10 Characters',
      }),
  }),
};

module.exports = blockUserPolicy;
