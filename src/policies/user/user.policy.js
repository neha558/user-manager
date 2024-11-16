import { EMAIL_REGEX, USERNAME_REGEX } from 'utils/constants';

const Joi = require('joi');
const {
  combineValidationMessages,
  generateMandatoryFieldMessage,
} = require('utils/validations');

const userPolicy = {
  body: Joi.object().keys({
    userId: Joi.string(),
    firstName: Joi.string()
      .max(50)
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('firstName'),
        ),
        'string.max': `lastName should have a maximum 50 Char length`,
      }),
    lastName: Joi.string()
      .max(50)
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('lastName'),
        ),
        'string.max': `lastName should have a maximum 50 Char length`,
      }),
    userName: Joi.string()
      .max(100)
      .min(1)
      .required()
      .pattern(USERNAME_REGEX)
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('userName'),
        ),
        'string.pattern.base': `Invalid userName entered`,
        'string.min': `Password should have a minimum 1 Char length`,
      }),
    email: Joi.string()
      .max(50)
      .pattern(EMAIL_REGEX)
      .messages({
        ...combineValidationMessages(
          ['string.empty'],
          generateMandatoryFieldMessage('email'),
        ),
        'string.pattern.base': `Invalid email Address entered`,
      }),
    mobileNumber: Joi.string().messages({
      ...combineValidationMessages(
        ['string.empty'],
        generateMandatoryFieldMessage('mobileNumber'),
      ),
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
    bio: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    twoFactorAuthentication: Joi.boolean().allow(null, ''),
    forgotPasswordToken: Joi.string().allow(null, ''),
    verifyByEmail: Joi.date().allow(null, ''),
    verifyByMobile: Joi.date().allow(null, ''),
    otp: Joi.date().allow(null, ''),
    otpExpiryTime: Joi.date().allow(null, ''),
    status: Joi.string()
      .valid('ACTIVE', 'DEACTIVE', 'BLOCKED')
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('status'),
        ),
      }),
    imageId: Joi.string().allow(null, ''),
    profileBanner: Joi.string().allow(null, ''),
    gender: Joi.string()
      .valid('MALE', 'FEMALE', 'OTHER')
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('gender'),
        ),
      }),
    dateOfBirth: Joi.date().messages({
      ...combineValidationMessages(
        ['any.required', 'string.empty'],
        generateMandatoryFieldMessage('dateOfBirth'),
      ),
    }),
    language: Joi.string().messages({
      ...combineValidationMessages(
        ['any.required', 'string.empty'],
        generateMandatoryFieldMessage('language'),
      ),
    }),
    interests: Joi.array()
      .items(Joi.string())
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('interests'),
        ),
      }),
    googleId: Joi.string()
      .allow(null, '')
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('googleId'),
        ),
      }),
    facebookId: Joi.string()
      .allow(null, '')
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('facebookId'),
        ),
      }),
    areTermsAccepted: Joi.boolean()
      .required()
      .messages({
        ...combineValidationMessages(
          ['any.required', 'string.empty'],
          generateMandatoryFieldMessage('tncAccepted'),
        ),
      }),
  }),
};

export default userPolicy;
