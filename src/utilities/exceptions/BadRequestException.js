const generateException = require('./generateException');

class BadRequestException extends Error {
  constructor(exception) {
    super();
    generateException(this, 400, 'Bad request', exception);
  }
}

module.exports = BadRequestException;
