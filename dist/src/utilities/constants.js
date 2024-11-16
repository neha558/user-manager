"use strict";

module.exports = {
  EMAIL_REGEX: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  USERNAME_REGEX: /^(?=^.{1,30}$)[0-9a-zA-Z-_.]+$/,
  MOBILE_NUMBER_REGEX: /^\d{10}$/,
  MANDATORY_FIELD_RULE: ['string.empty', 'any.required'],
  LISTENERS: {},
  CREATORS: {
    CREATE_REQUEST_HASHTAGS_TOPIC: 'poll-manager-create-campaign-request'
  },
  PARTITION: 1,
  REPLICATION_FACTOR: 1,
  TOPIC_NAME: 'poll-create-hashtags-request',
  CHARACTERS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  OTP_CHARACTERS: '0123456789',
  IMAGE_SIZE: 2504642,
  SALT_ROUND: 8,
  EXPIRES_IN: 5184000
};