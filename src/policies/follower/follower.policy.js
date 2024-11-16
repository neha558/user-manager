const Joi = require('joi');

const {
  combineValidationMessages,
  generateMandatoryFieldMessage,
} = require('../../utilities/validations');

const followerPolicy = {
  body: Joi.object().keys({
    user: Joi.any(),
    iat: Joi.any(),
    exp: Joi.any(),
    followId: Joi.string(),
    followerId: Joi.string()
      .required()
      .max(100)
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('userId'),
        ),
        'string.base': 'followerId should be of type string',
        'string.max': 'followerId should be of Max 100 Characters',
      }),
  }),
};

module.exports = followerPolicy;
