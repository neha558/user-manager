"use strict";

var removeNullFromObject = function removeNullFromObject(object) {
  return JSON.parse(JSON.stringify(object, function (key, value) {
    // eslint-disable-next-line no-param-reassign
    value = value === null ? undefined : value;
    return value;
  }));
}; // eslint-disable-next-line no-unused-vars


var paginateData = function paginateData(lists, limit, cursor) {
  var hasNextPage = lists.length === limit;
  var endCursor;

  if (lists.length === 1) {
    endCursor = lists.length;
  } else if (hasNextPage) {
    endCursor = lists.length;
  } else if (lists.length === 0) {
    endCursor = null;
  } else {
    endCursor = lists.length;
  }

  var dataLists = lists;

  if (dataLists.length === limit) {
    dataLists.splice(limit - 1, 1);
  }

  return {
    data: dataLists,
    pageInfo: {
      hasNextPage: hasNextPage,
      endCursor: endCursor
    }
  };
};

var emailDuplicationMessage = function emailDuplicationMessage(_ref) {
  var googleId = _ref.googleId,
      facebookId = _ref.facebookId,
      appleId = _ref.appleId;
  var error;

  if (googleId) {
    error = "It looks like you've already signedup using google.";
  } else if (facebookId) {
    error = "It looks like you've already signedup using facebook.";
  } else if (appleId) {
    error = "It looks like you've already signedup using apple.";
  } else {
    error = "It looks like you've already got an account associated with this email.";
  }

  return error;
};

var checkUserSuspended = function checkUserSuspended(reject, UnauthorizedException, logger) {
  logger.message("Your account has been suspended by admin");
  return reject(new UnauthorizedException("Your account has been suspended by admin"));
};

var encodeToBase64 = function encodeToBase64(text) {
  return Buffer.from(text.toString()).toString('base64');
};
/**
 *
 * @param {string} encodedText
 */


var decodeFromBase64 = function decodeFromBase64(encodedText) {
  return Buffer.from(encodedText, 'base64').toString('utf8');
};

module.exports = {
  checkUserSuspended: checkUserSuspended,
  removeNullFromObject: removeNullFromObject,
  paginateData: paginateData,
  emailDuplicationMessage: emailDuplicationMessage,
  encodeToBase64: encodeToBase64,
  decodeFromBase64: decodeFromBase64
};