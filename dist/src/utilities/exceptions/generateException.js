"use strict";

/* eslint-disable no-param-reassign */
function generateException(errorInstance, statusCode, title, exception) {
  // eslint-disable-next-line no-console
  console.log(exception);
  errorInstance.statusCode = exception.statusCode || statusCode;
  errorInstance.title = exception.title || title;
  errorInstance.description = typeof exception === 'string' ? exception : exception.description;
}

module.exports = generateException;