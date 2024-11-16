const removeNullFromObject = (object) =>
  JSON.parse(
    JSON.stringify(object, (key, value) => {
      // eslint-disable-next-line no-param-reassign
      value = value === null ? undefined : value;
      return value;
    }),
  );

// eslint-disable-next-line no-unused-vars
const paginateData = (lists, limit, cursor) => {
  const hasNextPage = lists.length === limit;
  let endCursor;
  if (lists.length === 1) {
    endCursor = lists.length;
  } else if (hasNextPage) {
    endCursor = lists.length;
  } else if (lists.length === 0) {
    endCursor = null;
  } else {
    endCursor = lists.length;
  }

  const dataLists = lists;

  if (dataLists.length === limit) {
    dataLists.splice(limit - 1, 1);
  }

  return {
    data: dataLists,
    pageInfo: {
      hasNextPage,
      endCursor,
    },
  };
};

const emailDuplicationMessage = ({
  googleId,
  facebookId,
  appleId,
}) => {
  let error;
  if (googleId) {
    error = `It looks like you've already signedup using google.`;
  } else if (facebookId) {
    error = `It looks like you've already signedup using facebook.`;
  } else if (appleId) {
    error = `It looks like you've already signedup using apple.`;
  } else {
    error = `It looks like you've already got an account associated with this email.`;
  }
  return error;
};

const checkUserSuspended = (
  reject,
  UnauthorizedException,
  logger,
) => {
  logger.message(`Your account has been suspended by admin`);
  return reject(
    new UnauthorizedException(
      `Your account has been suspended by admin`,
    ),
  );
};

const encodeToBase64 = (text) =>
  Buffer.from(text.toString()).toString('base64');

/**
 *
 * @param {string} encodedText
 */
const decodeFromBase64 = (encodedText) =>
  Buffer.from(encodedText, 'base64').toString('utf8');

module.exports = {
  checkUserSuspended,
  removeNullFromObject,
  paginateData,
  emailDuplicationMessage,
  encodeToBase64,
  decodeFromBase64,
};
